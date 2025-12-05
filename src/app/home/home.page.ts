import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertController, ModalController, PopoverController, ActionSheetController } from '@ionic/angular';
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
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private popoverController: PopoverController
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
          placeholder: 'Descripción (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: async (data) => {
            if (data.title) {
              // El alert se cerrará automáticamente
              // Pequeño delay para que el cierre sea suave antes de mostrar el ActionSheet
              setTimeout(() => {
                this.selectTaskPriority(data.title, data.description, columnStatus);
              }, 200);
            }
            return true; // Permite que el alert se cierre
          }
        }
      ]
    });

    await alert.present();
  }

  async selectTaskPriority(title: string, description: string, columnStatus: TaskStatus) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar Prioridad',
      cssClass: 'priority-action-sheet',
      buttons: [
        {
          text: '🔴 Alta',
          handler: async () => {
            await this.taskService.addTask({
              title,
              description,
              priority: TaskPriority.HIGH,
              status: columnStatus
            });
          }
        },
        {
          text: '🟡 Media',
          handler: async () => {
            await this.taskService.addTask({
              title,
              description,
              priority: TaskPriority.MEDIUM,
              status: columnStatus
            });
          }
        },
        {
          text: '🟢 Baja',
          handler: async () => {
            await this.taskService.addTask({
              title,
              description,
              priority: TaskPriority.LOW,
              status: columnStatus
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async editTask(task: Task) {
    const actionSheet = await this.actionSheetController.create({
      header: task.title,
      buttons: [
        {
          text: 'Editar Información',
          icon: 'create-outline',
          handler: async () => {
            await this.editTaskDetails(task);
          }
        },
        {
          text: 'Cambiar Prioridad',
          icon: 'flag-outline',
          handler: async () => {
            await this.changeTaskPriority(task);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async editTaskDetails(task: Task) {
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
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.taskService.updateTask(task.id, {
              title: data.title,
              description: data.description
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async changeTaskPriority(task: Task) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cambiar Prioridad',
      buttons: [
        {
          text: '🔴 Alta' + (task.priority === TaskPriority.HIGH ? ' ✓' : ''),
          handler: async () => {
            await this.taskService.updateTask(task.id, {
              priority: TaskPriority.HIGH
            });
          }
        },
        {
          text: '🟡 Media' + (task.priority === TaskPriority.MEDIUM ? ' ✓' : ''),
          handler: async () => {
            await this.taskService.updateTask(task.id, {
              priority: TaskPriority.MEDIUM
            });
          }
        },
        {
          text: '🟢 Baja' + (task.priority === TaskPriority.LOW ? ' ✓' : ''),
          handler: async () => {
            await this.taskService.updateTask(task.id, {
              priority: TaskPriority.LOW
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
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

  async openColumnMenu(event: Event, column: Column) {
    event.stopPropagation();

    const { ColumnMenuPopoverComponent } = await import('./column-menu-popover.component');

    const popover = await this.popoverController.create({
      component: ColumnMenuPopoverComponent,
      event: event,
      componentProps: {
        column: column
      },
      showBackdrop: true,
      translucent: true
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data?.action) {
      switch (data.action) {
        case 'editName':
          await this.editColumnName(column);
          break;
        case 'changeColor':
          await this.changeColumnColor(column);
          break;
        case 'archiveTasks':
          await this.archiveAllTasks(column);
          break;
        case 'clearColumn':
          await this.clearColumn(column);
          break;
        case 'deleteColumn':
          const confirm = await this.alertController.create({
            header: '¿Eliminar columna?',
            message: `Se eliminarán todas las tareas de "${column.title}"`,
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel'
              },
              {
                text: 'Eliminar',
                role: 'destructive',
                handler: async () => {
                  await this.taskService.deleteColumn(column.id);
                }
              }
            ]
          });
          await confirm.present();
          break;
      }
    }
  }

  async changeColumnColor(column: Column) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar Color',
      buttons: [
        {
          text: '🔵 Azul Claro',
          handler: async () => {
            await this.updateColumnBackground(column, '#e3f2fd');
          }
        },
        {
          text: '🟢 Verde Claro',
          handler: async () => {
            await this.updateColumnBackground(column, '#e8f5e9');
          }
        },
        {
          text: '🟡 Amarillo Claro',
          handler: async () => {
            await this.updateColumnBackground(column, '#fff9c4');
          }
        },
        {
          text: '🟠 Naranja Claro',
          handler: async () => {
            await this.updateColumnBackground(column, '#ffe0b2');
          }
        },
        {
          text: '🔴 Rojo Claro',
          handler: async () => {
            await this.updateColumnBackground(column, '#ffebee');
          }
        },
        {
          text: '🟣 Morado Claro',
          handler: async () => {
            await this.updateColumnBackground(column, '#f3e5f5');
          }
        },
        {
          text: '⚪ Gris (Por defecto)',
          handler: async () => {
            await this.updateColumnBackground(column, '#f4f5f8');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async updateColumnBackground(column: Column, color: string) {
    const updatedColumns = this.columns.map(col => {
      if (col.id === column.id) {
        return { ...col, backgroundColor: color };
      }
      return col;
    });
    this.columns = updatedColumns;
    await this.taskService.reorderColumns(updatedColumns);
  }

  async archiveAllTasks(column: Column) {
    // Aquí podrías implementar un sistema de archivo más complejo
    // Por ahora, simplemente movemos todas las tareas a "Completado"
    const alert = await this.alertController.create({
      header: 'Archivar Tareas',
      message: `¿Mover todas las tareas de "${column.title}" a Completado?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Archivar',
          handler: async () => {
            for (const task of column.tasks) {
              await this.taskService.moveTask(task.id, column.id, TaskStatus.DONE, 0);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async clearColumn(column: Column) {
    const alert = await this.alertController.create({
      header: 'Vaciar Columna',
      message: `¿Eliminar todas las tareas de "${column.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar Todo',
          role: 'destructive',
          handler: async () => {
            for (const task of [...column.tasks]) {
              await this.taskService.deleteTask(task.id);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openSettingsMenu(event: Event) {
    event.stopPropagation();

    const { SettingsMenuPopoverComponent } = await import('./settings-menu-popover.component');

    const popover = await this.popoverController.create({
      component: SettingsMenuPopoverComponent,
      event: event,
      showBackdrop: true,
      translucent: true
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data?.action) {
      switch (data.action) {
        case 'exportData':
          this.exportData();
          break;
        case 'importData':
          this.importData();
          break;
        case 'showStatistics':
          this.showStatistics();
          break;
        case 'showHelp':
          this.showHelp();
          break;
        case 'clearAll':
          const confirm = await this.alertController.create({
            header: '¿Limpiar todo?',
            message: 'Se eliminarán todas las tareas y columnas personalizadas.',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel'
              },
              {
                text: 'Limpiar',
                role: 'destructive',
                handler: async () => {
                  await this.clearAllData();
                }
              }
            ]
          });
          await confirm.present();
          break;
      }
    }
  }

  exportData() {
    const dataStr = JSON.stringify(this.columns, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async importData() {
    const alert = await this.alertController.create({
      header: 'Importar Datos',
      message: 'Esta funcionalidad requiere seleccionar un archivo. Por ahora, puedes pegar el contenido JSON directamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showStatistics() {
    const totalTasks = this.columns.reduce((sum, col) => sum + col.tasks.length, 0);
    const tasksByPriority = {
      high: 0,
      medium: 0,
      low: 0
    };

    this.columns.forEach(col => {
      col.tasks.forEach(task => {
        if (task.priority === TaskPriority.HIGH) tasksByPriority.high++;
        else if (task.priority === TaskPriority.MEDIUM) tasksByPriority.medium++;
        else tasksByPriority.low++;
      });
    });

    const alert = await this.alertController.create({
      header: 'Estadísticas',
      message: `
        <strong>Total de tareas:</strong> ${totalTasks}<br><br>
        <strong>Por estado:</strong><br>
        ${this.columns.map(col => `${col.title}: ${col.tasks.length}`).join('<br>')}<br><br>
        <strong>Por prioridad:</strong><br>
        🔴 Alta: ${tasksByPriority.high}<br>
        🟡 Media: ${tasksByPriority.medium}<br>
        🟢 Baja: ${tasksByPriority.low}
      `,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Ayuda',
      message: `
        <strong>Kanban Tasks</strong><br><br>
        • <strong>Crear tarea:</strong> Click en "Añadir tarjeta"<br>
        • <strong>Mover tarea:</strong> Arrastra entre columnas<br>
        • <strong>Editar tarea:</strong> Click en la tarjeta<br>
        • <strong>Menú de columna:</strong> Click en los 3 puntos<br>
        • <strong>Personalizar columna:</strong> Cambia nombre y color<br>
      `,
      buttons: ['Entendido']
    });

    await alert.present();
  }

  async clearAllData() {
    // Eliminar todas las tareas de todas las columnas
    for (const column of this.columns) {
      for (const task of [...column.tasks]) {
        await this.taskService.deleteTask(task.id);
      }
    }

    // Eliminar todas las columnas personalizadas (mantener las 3 principales)
    const customColumns = this.columns.filter(
      col => col.id !== TaskStatus.TODO &&
             col.id !== TaskStatus.IN_PROGRESS &&
             col.id !== TaskStatus.DONE
    );

    for (const column of customColumns) {
      await this.taskService.deleteColumn(column.id);
    }
  }
}
