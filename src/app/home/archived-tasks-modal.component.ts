import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ActionSheetController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Task, TaskPriority } from '../models/task.model';

@Component({
  selector: 'app-archived-tasks-modal',
  imports: [CommonModule, IonicModule, TranslateModule],
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ 'ARCHIVED.TITLE' | translate }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="archived-container">
        <div *ngIf="archivedTasks.length === 0" class="empty-state">
          <ion-icon name="archive-outline" class="empty-icon"></ion-icon>
          <h2>{{ 'ARCHIVED.EMPTY_TITLE' | translate }}</h2>
          <p>{{ 'ARCHIVED.EMPTY_MESSAGE' | translate }}</p>
        </div>

        <ion-list *ngIf="archivedTasks.length > 0">
          <ion-item-sliding *ngFor="let task of archivedTasks">
            <ion-item button (click)="showTaskOptions(task)">
              <div class="task-priority-indicator" [style.background-color]="getPriorityColor(task.priority)" slot="start"></div>
              <ion-label>
                <h3>{{ task.title }}</h3>
                <p *ngIf="task.description">{{ task.description }}</p>
                <p class="archived-date" *ngIf="task.archivedAt">
                  <ion-icon name="calendar-outline" size="small"></ion-icon>
                  {{ 'ARCHIVED.ARCHIVED_ON' | translate }}: {{ formatDate(task.archivedAt) }}
                </p>
              </ion-label>
              <ion-badge slot="end" [color]="getPriorityBadgeColor(task.priority)">
                {{ ('TASK.PRIORITY.' + task.priority.toUpperCase()) | translate }}
              </ion-badge>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="success" (click)="unarchiveTask(task)">
                <ion-icon slot="icon-only" name="arrow-undo-outline"></ion-icon>
              </ion-item-option>
              <ion-item-option color="danger" (click)="deleteTask(task)">
                <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </div>
    </ion-content>
  `,
  styles: [`
    .archived-container {
      padding: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--ion-color-medium);
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      font-size: 24px;
      margin-bottom: 10px;
      color: var(--ion-text-color);
    }

    .empty-state p {
      font-size: 16px;
      margin: 0;
    }

    .task-priority-indicator {
      width: 4px;
      height: 100%;
      border-radius: 2px;
      margin-right: 12px;
    }

    .archived-date {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    ion-item {
      --padding-start: 8px;
    }

    ion-badge {
      font-size: 11px;
      padding: 4px 8px;
    }
  `]
})
export class ArchivedTasksModalComponent {
  @Input() archivedTasks: Task[] = [];

  constructor(
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async showTaskOptions(task: Task) {
    const actionSheet = await this.actionSheetController.create({
      header: task.title,
      buttons: [
        {
          text: this.translate.instant('ARCHIVED.UNARCHIVE'),
          icon: 'arrow-undo-outline',
          handler: () => {
            this.unarchiveTask(task);
          }
        },
        {
          text: this.translate.instant('TASK.ACTIONS.DELETE'),
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.deleteTask(task);
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

  unarchiveTask(task: Task) {
    this.modalController.dismiss({
      action: 'unarchive',
      taskId: task.id
    });
  }

  deleteTask(task: Task) {
    this.modalController.dismiss({
      action: 'delete',
      taskId: task.id
    });
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

  getPriorityBadgeColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'danger';
      case TaskPriority.MEDIUM:
        return 'warning';
      case TaskPriority.LOW:
        return 'success';
      default:
        return 'medium';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
