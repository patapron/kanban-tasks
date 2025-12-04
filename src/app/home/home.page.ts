import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Column, Task, TaskStatus, TaskPriority } from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  columns: Column[] = [];
  TaskPriority = TaskPriority;

  constructor(
    private taskService: TaskService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.taskService.columns$.subscribe(columns => {
      this.columns = columns;
    });
  }

  get connectedDropLists(): string[] {
    return this.columns.map(c => c.id);
  }

  async drop(event: CdkDragDrop<Task[]>, toStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const fromStatus = task.status;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      await this.taskService.moveTask(
        task.id,
        fromStatus,
        toStatus,
        event.currentIndex
      );
    }
  }

  async addTask(columnStatus: TaskStatus) {
    const alert = await this.alertController.create({
      header: 'Nueva Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción'
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Alta',
          value: TaskPriority.HIGH,
          checked: false
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Media',
          value: TaskPriority.MEDIUM,
          checked: true
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Baja',
          value: TaskPriority.LOW,
          checked: false
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            if (data.title) {
              await this.taskService.addTask({
                title: data.title,
                description: data.description,
                priority: data.priority as TaskPriority || TaskPriority.MEDIUM,
                status: columnStatus
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Editar Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea',
          value: task.title
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción',
          value: task.description
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Alta',
          value: TaskPriority.HIGH,
          checked: task.priority === TaskPriority.HIGH
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Media',
          value: TaskPriority.MEDIUM,
          checked: task.priority === TaskPriority.MEDIUM
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Baja',
          value: TaskPriority.LOW,
          checked: task.priority === TaskPriority.LOW
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
          }
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.taskService.updateTask(task.id, {
              title: data.title,
              description: data.description,
              priority: data.priority as TaskPriority
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return '#eb445a';
      case TaskPriority.MEDIUM:
        return '#ffc409';
      case TaskPriority.LOW:
        return '#2dd36f';
      default:
        return '#92949c';
    }
  }

  async dropColumn(event: CdkDragDrop<Column[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    await this.taskService.reorderColumns(this.columns);
  }

  async addColumn() {
    const alert = await this.alertController.create({
      header: 'Nueva Columna',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Nombre de la columna'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (data.title) {
              await this.taskService.addColumn(data.title);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editColumnName(column: Column) {
    const alert = await this.alertController.create({
      header: 'Editar Columna',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Nombre de la columna',
          value: column.title
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar Columna',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteColumn(column.id);
          }
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.title) {
              await this.taskService.updateColumnTitle(column.id, data.title);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
