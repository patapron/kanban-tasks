import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus, Column, TaskPriority } from '../models/task.model';
import { Preferences } from '@capacitor/preferences';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'kanban_tasks';
  private columnsSubject = new BehaviorSubject<Column[]>([]);
  public columns$: Observable<Column[]> = this.columnsSubject.asObservable();

  constructor(private notificationService: NotificationService) {
    this.loadTasks();
  }

  private initializeColumns(): Column[] {
    return [
      {
        id: TaskStatus.TODO,
        title: 'Por hacer',
        tasks: []
      },
      {
        id: TaskStatus.IN_PROGRESS,
        title: 'En progreso',
        tasks: []
      },
      {
        id: TaskStatus.DONE,
        title: 'Completado',
        tasks: []
      }
    ];
  }

  async loadTasks(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      if (value) {
        const columns = JSON.parse(value) as Column[];
        // Convertir strings de fecha a objetos Date
        columns.forEach(column => {
          column.tasks.forEach(task => {
            task.createdAt = new Date(task.createdAt);
            if (task.dueDate) {
              task.dueDate = new Date(task.dueDate);
            }
          });
        });
        this.columnsSubject.next(columns);
      } else {
        this.columnsSubject.next(this.initializeColumns());
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.columnsSubject.next(this.initializeColumns());
    }
  }

  async saveTasks(): Promise<void> {
    try {
      const columns = this.columnsSubject.value;
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(columns)
      });
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
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
      await this.saveTasks();

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
        await this.saveTasks();

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
        await this.saveTasks();

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
    await this.saveTasks();
  }

  async reorderColumns(columns: Column[]): Promise<void> {
    this.columnsSubject.next([...columns]);
    await this.saveTasks();
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
    await this.saveTasks();
  }

  async deleteColumn(columnId: string | TaskStatus): Promise<void> {
    const columns = this.columnsSubject.value;
    const columnIndex = columns.findIndex(col => col.id === columnId);
    if (columnIndex !== -1) {
      columns.splice(columnIndex, 1);
      this.columnsSubject.next([...columns]);
      await this.saveTasks();
    }
  }

  async updateColumnTitle(columnId: string | TaskStatus, newTitle: string): Promise<void> {
    const columns = this.columnsSubject.value;
    const column = columns.find(col => col.id === columnId);
    if (column) {
      column.title = newTitle;
      this.columnsSubject.next([...columns]);
      await this.saveTasks();
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getColumns(): Column[] {
    return this.columnsSubject.value;
  }
}
