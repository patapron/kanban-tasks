import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-settings-menu-popover',
  template: `
    <ion-list>
      <ion-item button (click)="exportData()">
        <ion-icon name="download-outline" slot="start"></ion-icon>
        <ion-label>Exportar Datos</ion-label>
      </ion-item>
      <ion-item button (click)="importData()">
        <ion-icon name="cloud-upload-outline" slot="start"></ion-icon>
        <ion-label>Importar Datos</ion-label>
      </ion-item>
      <ion-item button (click)="showStatistics()">
        <ion-icon name="stats-chart-outline" slot="start"></ion-icon>
        <ion-label>Ver Estadísticas</ion-label>
      </ion-item>
      <ion-item button (click)="showHelp()">
        <ion-icon name="help-circle-outline" slot="start"></ion-icon>
        <ion-label>Ayuda</ion-label>
      </ion-item>
      <ion-item button (click)="clearAll()">
        <ion-icon name="trash-outline" slot="start" color="danger"></ion-icon>
        <ion-label color="danger">Limpiar Todo</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    ion-list {
      padding: 0;
      min-width: 200px;
    }
    ion-item {
      --padding-start: 12px;
      --inner-padding-end: 12px;
      font-size: 14px;
    }
  `],
  standalone: false
})
export class SettingsMenuPopoverComponent {
  constructor(private popoverController: PopoverController) {}

  async exportData() {
    await this.popoverController.dismiss({ action: 'exportData' });
  }

  async importData() {
    await this.popoverController.dismiss({ action: 'importData' });
  }

  async showStatistics() {
    await this.popoverController.dismiss({ action: 'showStatistics' });
  }

  async showHelp() {
    await this.popoverController.dismiss({ action: 'showHelp' });
  }

  async clearAll() {
    await this.popoverController.dismiss({ action: 'clearAll' });
  }
}
