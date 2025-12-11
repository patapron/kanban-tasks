import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus, Column, TaskPriority } from '../models/task.model';
import { Storage } from '@ionic/storage-angular';
import { NotificationService } from './notification.service';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private columnsSubject = new BehaviorSubject<Column[]>([]);
  public columns$: Observable<Column[]> = this.columnsSubject.asObservable();
  private storage: Storage | null = null;

  constructor(
    private notificationService: NotificationService,
    private storageService: Storage,
    private boardService: BoardService
  ) {
    this.init();
  }

  async init(): Promise<void> {
    this.storage = await this.storageService.create();

    // Escuchar cambios en el tablero activo
    this.boardService.activeBoard$.subscribe(board => {
      if (board) {
        this.columnsSubject.next(board.columns);
      }
    });
  }

  private async saveColumns(): Promise<void> {
    const columns = this.columnsSubject.value;
    await this.boardService.updateActiveBoardColumns(columns);
  }

  async addTask(task: Partial<Task>): Promise<void> {
    const newTask: Task = {
      id: this.generateId(),
      title: task.title || '',
      description: task.description || '',
      status: task.status || TaskStatus.TODO,
      priority: task.priority || TaskPriority.MEDIUM,
      dueDate: task.dueDate,
      createdAt: new Date(),
      notificationEnabled: task.notificationEnabled || false
    };

    const columns = this.columnsSubject.value;
    const columnIndex = columns.findIndex(col => col.id === newTask.status);
    if (columnIndex !== -1) {
      columns[columnIndex].tasks.push(newTask);
      this.columnsSubject.next([...columns]);
      await this.saveColumns();

      // Programar notificación si está habilitada
      if (newTask.notificationEnabled && newTask.dueDate) {
        await this.notificationService.scheduleTaskNotification(newTask);
      }
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const columns = this.columnsSubject.value;
    for (const column of columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const updatedTask = {
          ...column.tasks[taskIndex],
          ...updates
        };
        column.tasks[taskIndex] = updatedTask;
        this.columnsSubject.next([...columns]);
        await this.saveColumns();

        // Cancelar notificación anterior y reprogramar si es necesario
        await this.notificationService.cancelTaskNotification(taskId);
        if (updatedTask.notificationEnabled && updatedTask.dueDate) {
          await this.notificationService.scheduleTaskNotification(updatedTask);
        }
        break;
      }
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const columns = this.columnsSubject.value;
    for (const column of columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        this.columnsSubject.next([...columns]);
        await this.saveColumns();

        // Cancelar notificación de la tarea eliminada
        await this.notificationService.cancelTaskNotification(taskId);
        break;
      }
    }
  }

  async moveTask(taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus, newIndex: number): Promise<void> {
    const columns = this.columnsSubject.value;
    const fromColumn = columns.find(col => col.id === fromStatus);
    const toColumn = columns.find(col => col.id === toStatus);

    if (!fromColumn || !toColumn) return;

    const taskIndex = fromColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromColumn.tasks.splice(taskIndex, 1);
    task.status = toStatus;
    toColumn.tasks.splice(newIndex, 0, task);

    this.columnsSubject.next([...columns]);
    await this.saveColumns();
  }

  async reorderTasksInColumn(columnId: TaskStatus, tasks: Task[]): Promise<void> {
    const columns = this.columnsSubject.value;
    const column = columns.find(col => col.id === columnId);

    if (!column) return;

    // Mantener las tareas archivadas y solo reordenar las activas
    const archivedTasks = column.tasks.filter(t => t.archived);
    column.tasks = [...tasks, ...archivedTasks];

    this.columnsSubject.next([...columns]);
    await this.saveColumns();
  }

  async reorderColumns(columns: Column[]): Promise<void> {
    this.columnsSubject.next([...columns]);
    await this.saveColumns();
  }

  async addColumn(title: string): Promise<void> {
    const columns = this.columnsSubject.value;
    const newColumn: Column = {
      id: this.generateId() as any,
      title,
      tasks: []
    };
    columns.push(newColumn);
    this.columnsSubject.next([...columns]);
    await this.saveColumns();
  }

  async deleteColumn(columnId: string | TaskStatus): Promise<void> {
    const columns = this.columnsSubject.value;
    const columnIndex = columns.findIndex(col => col.id === columnId);
    if (columnIndex !== -1) {
      columns.splice(columnIndex, 1);
      this.columnsSubject.next([...columns]);
      await this.saveColumns();
    }
  }

  async updateColumnTitle(columnId: string | TaskStatus, newTitle: string): Promise<void> {
    const columns = this.columnsSubject.value;
    const column = columns.find(col => col.id === columnId);
    if (column) {
      column.title = newTitle;
      this.columnsSubject.next([...columns]);
      await this.saveColumns();
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getColumns(): Column[] {
    return this.columnsSubject.value;
  }

  async archiveTask(taskId: string): Promise<void> {
    const columns = this.columnsSubject.value;
    for (const column of columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        column.tasks[taskIndex].archived = true;
        column.tasks[taskIndex].archivedAt = new Date();
        this.columnsSubject.next([...columns]);
        await this.saveColumns();
        break;
      }
    }
  }

  async unarchiveTask(taskId: string): Promise<void> {
    const columns = this.columnsSubject.value;
    for (const column of columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        column.tasks[taskIndex].archived = false;
        column.tasks[taskIndex].archivedAt = undefined;
        this.columnsSubject.next([...columns]);
        await this.saveColumns();
        break;
      }
    }
  }

  getArchivedTasks(): Task[] {
    const columns = this.columnsSubject.value;
    const archivedTasks: Task[] = [];

    for (const column of columns) {
      const archived = column.tasks.filter(task => task.archived === true);
      archivedTasks.push(...archived);
    }

    return archivedTasks;
  }

  getArchivedTasksCount(): number {
    return this.getArchivedTasks().length;
  }
}
