import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertController, ModalController, PopoverController, ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TaskService } from '../services/task.service';
import { LanguageService } from '../services/language.service';
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
    private popoverController: PopoverController,
    private translate: TranslateService,
    private languageService: LanguageService
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
      header: this.translate.instant('TASK.NEW_TASK'),
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.translate.instant('TASK.TITLE')
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: this.translate.instant('TASK.DESCRIPTION_OPTIONAL')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('BUTTONS.NEXT'),
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
      header: this.translate.instant('TASK.SELECT_PRIORITY'),
      cssClass: 'priority-action-sheet',
      buttons: [
        {
          text: '🔴 ' + this.translate.instant('TASK.PRIORITY.HIGH'),
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
          text: '🟡 ' + this.translate.instant('TASK.PRIORITY.MEDIUM'),
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
          text: '🟢 ' + this.translate.instant('TASK.PRIORITY.LOW'),
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
          text: this.translate.instant('BUTTONS.CANCEL'),
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
          text: this.translate.instant('TASK.ACTIONS.EDIT_INFO'),
          icon: 'create-outline',
          handler: async () => {
            await this.editTaskDetails(task);
          }
        },
        {
          text: this.translate.instant('TASK.ACTIONS.CHANGE_PRIORITY'),
          icon: 'flag-outline',
          handler: async () => {
            await this.changeTaskPriority(task);
          }
        },
        {
          text: this.translate.instant('TASK.ACTIONS.DELETE'),
          icon: 'trash-outline',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
          }
        },
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async editTaskDetails(task: Task) {
    const alert = await this.alertController.create({
      header: this.translate.instant('TASK.EDIT_TASK'),
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.translate.instant('TASK.TITLE'),
          value: task.title
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: this.translate.instant('TASK.DESCRIPTION'),
          value: task.description
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('BUTTONS.SAVE'),
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
      header: this.translate.instant('TASK.ACTIONS.CHANGE_PRIORITY'),
      buttons: [
        {
          text: '🔴 ' + this.translate.instant('TASK.PRIORITY.HIGH') + (task.priority === TaskPriority.HIGH ? ' ✓' : ''),
          handler: async () => {
            await this.taskService.updateTask(task.id, {
              priority: TaskPriority.HIGH
            });
          }
        },
        {
          text: '🟡 ' + this.translate.instant('TASK.PRIORITY.MEDIUM') + (task.priority === TaskPriority.MEDIUM ? ' ✓' : ''),
          handler: async () => {
            await this.taskService.updateTask(task.id, {
              priority: TaskPriority.MEDIUM
            });
          }
        },
        {
          text: '🟢 ' + this.translate.instant('TASK.PRIORITY.LOW') + (task.priority === TaskPriority.LOW ? ' ✓' : ''),
          handler: async () => {
            await this.taskService.updateTask(task.id, {
              priority: TaskPriority.LOW
            });
          }
        },
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
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
      header: this.translate.instant('COLUMN.NEW_COLUMN'),
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.translate.instant('COLUMN.NAME')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('BUTTONS.CREATE'),
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
      header: this.translate.instant('COLUMN.EDIT_COLUMN'),
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.translate.instant('COLUMN.NAME'),
          value: column.title
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('COLUMN.DELETE_COLUMN'),
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteColumn(column.id);
          }
        },
        {
          text: this.translate.instant('BUTTONS.SAVE'),
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
            header: this.translate.instant('COLUMN.DELETE_CONFIRM'),
            message: `${this.translate.instant('COLUMN.DELETE_MESSAGE')} "${column.title}"`,
            buttons: [
              {
                text: this.translate.instant('BUTTONS.CANCEL'),
                role: 'cancel'
              },
              {
                text: this.translate.instant('TASK.ACTIONS.DELETE'),
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
      header: this.translate.instant('COLUMN.COLORS.SELECT'),
      buttons: [
        {
          text: '🔵 ' + this.translate.instant('COLUMN.COLORS.LIGHT_BLUE'),
          handler: async () => {
            await this.updateColumnBackground(column, '#e3f2fd');
          }
        },
        {
          text: '🟢 ' + this.translate.instant('COLUMN.COLORS.LIGHT_GREEN'),
          handler: async () => {
            await this.updateColumnBackground(column, '#e8f5e9');
          }
        },
        {
          text: '🟡 ' + this.translate.instant('COLUMN.COLORS.LIGHT_YELLOW'),
          handler: async () => {
            await this.updateColumnBackground(column, '#fff9c4');
          }
        },
        {
          text: '🟠 ' + this.translate.instant('COLUMN.COLORS.LIGHT_ORANGE'),
          handler: async () => {
            await this.updateColumnBackground(column, '#ffe0b2');
          }
        },
        {
          text: '🔴 ' + this.translate.instant('COLUMN.COLORS.LIGHT_RED'),
          handler: async () => {
            await this.updateColumnBackground(column, '#ffebee');
          }
        },
        {
          text: '🟣 ' + this.translate.instant('COLUMN.COLORS.LIGHT_PURPLE'),
          handler: async () => {
            await this.updateColumnBackground(column, '#f3e5f5');
          }
        },
        {
          text: '⚪ ' + this.translate.instant('COLUMN.COLORS.GRAY_DEFAULT'),
          handler: async () => {
            await this.updateColumnBackground(column, '#f4f5f8');
          }
        },
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
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
      header: this.translate.instant('COLUMN.ARCHIVE.TITLE'),
      message: `${this.translate.instant('COLUMN.ARCHIVE.MESSAGE')} "${column.title}" ${this.translate.instant('COLUMN.ARCHIVE.TO_COMPLETED')}`,
      buttons: [
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('COLUMN.ARCHIVE.BUTTON'),
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
      header: this.translate.instant('COLUMN.CLEAR.TITLE'),
      message: `${this.translate.instant('COLUMN.CLEAR.MESSAGE')} "${column.title}"?`,
      buttons: [
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('COLUMN.CLEAR.BUTTON'),
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
        case 'changeLanguage':
          this.changeLanguage();
          break;
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
            header: this.translate.instant('SETTINGS.CLEAR_ALL_CONFIRM'),
            message: this.translate.instant('SETTINGS.CLEAR_ALL_MESSAGE'),
            buttons: [
              {
                text: this.translate.instant('BUTTONS.CANCEL'),
                role: 'cancel'
              },
              {
                text: this.translate.instant('BUTTONS.CLEAR'),
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
      header: this.translate.instant('IMPORT.TITLE'),
      message: this.translate.instant('IMPORT.MESSAGE'),
      buttons: [this.translate.instant('BUTTONS.OK')]
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
      header: this.translate.instant('STATISTICS.TITLE'),
      message: `
        <strong>${this.translate.instant('STATISTICS.TOTAL_TASKS')}:</strong> ${totalTasks}<br><br>
        <strong>${this.translate.instant('STATISTICS.BY_STATUS')}:</strong><br>
        ${this.columns.map(col => `${col.title}: ${col.tasks.length}`).join('<br>')}<br><br>
        <strong>${this.translate.instant('STATISTICS.BY_PRIORITY')}:</strong><br>
        🔴 ${this.translate.instant('TASK.PRIORITY.HIGH')}: ${tasksByPriority.high}<br>
        🟡 ${this.translate.instant('TASK.PRIORITY.MEDIUM')}: ${tasksByPriority.medium}<br>
        🟢 ${this.translate.instant('TASK.PRIORITY.LOW')}: ${tasksByPriority.low}
      `,
      buttons: [this.translate.instant('BUTTONS.CLOSE')]
    });

    await alert.present();
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: this.translate.instant('HELP.TITLE'),
      message: `
        <strong>${this.translate.instant('APP.TITLE')}</strong><br><br>
        • <strong>${this.translate.instant('HELP.CREATE_TASK')}</strong> ${this.translate.instant('HELP.CREATE_TASK_DESC')}<br>
        • <strong>${this.translate.instant('HELP.MOVE_TASK')}</strong> ${this.translate.instant('HELP.MOVE_TASK_DESC')}<br>
        • <strong>${this.translate.instant('HELP.EDIT_TASK')}</strong> ${this.translate.instant('HELP.EDIT_TASK_DESC')}<br>
        • <strong>${this.translate.instant('HELP.COLUMN_MENU')}</strong> ${this.translate.instant('HELP.COLUMN_MENU_DESC')}<br>
        • <strong>${this.translate.instant('HELP.CUSTOMIZE_COLUMN')}</strong> ${this.translate.instant('HELP.CUSTOMIZE_COLUMN_DESC')}<br>
      `,
      buttons: [this.translate.instant('BUTTONS.UNDERSTOOD')]
    });

    await alert.present();
  }

  async changeLanguage() {
    const languages = this.languageService.getAvailableLanguages();
    const currentLang = this.languageService.getCurrentLanguage();

    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant('SETTINGS.LANGUAGE'),
      buttons: [
        ...languages.map(lang => ({
          text: this.languageService.getLanguageName(lang) + (currentLang === lang ? ' ✓' : ''),
          handler: async () => {
            await this.languageService.setLanguage(lang);
          }
        })),
        {
          text: this.translate.instant('BUTTONS.CANCEL'),
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
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
