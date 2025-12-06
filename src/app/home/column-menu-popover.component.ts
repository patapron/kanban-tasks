import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Column } from '../models/task.model';

@Component({
  selector: 'app-column-menu-popover',
  template: `
    <ion-list>
      <ion-item button (click)="editColumnName()">
        <ion-icon name="create-outline" slot="start"></ion-icon>
        <ion-label>{{ 'COLUMN.MENU.CHANGE_NAME' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="changeColor()">
        <ion-icon name="color-palette-outline" slot="start"></ion-icon>
        <ion-label>{{ 'COLUMN.MENU.CHANGE_COLOR' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="archiveTasks()">
        <ion-icon name="archive-outline" slot="start"></ion-icon>
        <ion-label>{{ 'COLUMN.MENU.ARCHIVE_TASKS' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="clearColumn()">
        <ion-icon name="trash-outline" slot="start" color="danger"></ion-icon>
        <ion-label color="danger">{{ 'COLUMN.MENU.CLEAR_COLUMN' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="deleteColumn()">
        <ion-icon name="close-circle-outline" slot="start" color="danger"></ion-icon>
        <ion-label color="danger">{{ 'COLUMN.MENU.DELETE_COLUMN' | translate }}</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    ion-list {
      padding: 0;
      min-width: 220px;
    }
    ion-item {
      --padding-start: 12px;
      --inner-padding-end: 12px;
      font-size: 14px;
    }
  `],
  standalone: false
})
export class ColumnMenuPopoverComponent implements OnInit {
  column!: Column;

  constructor(
    private popoverController: PopoverController,
    private alertController: AlertController,
    public translate: TranslateService
  ) {}

  ngOnInit() {}

  async editColumnName() {
    await this.popoverController.dismiss({ action: 'editName' });
  }

  async changeColor() {
    await this.popoverController.dismiss({ action: 'changeColor' });
  }

  async archiveTasks() {
    await this.popoverController.dismiss({ action: 'archiveTasks' });
  }

  async clearColumn() {
    await this.popoverController.dismiss({ action: 'clearColumn' });
  }

  async deleteColumn() {
    await this.popoverController.dismiss({ action: 'deleteColumn' });
  }
}
