import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-settings-menu-popover',
  template: `
    <ion-list>
      <ion-item button (click)="changeLanguage()">
        <ion-icon name="language-outline" slot="start"></ion-icon>
        <ion-label>{{ 'SETTINGS.LANGUAGE' | translate }}</ion-label>
        <ion-note slot="end">{{ getCurrentLanguageName() }}</ion-note>
      </ion-item>
      <ion-item button (click)="changeTheme()">
        <ion-icon name="color-palette-outline" slot="start"></ion-icon>
        <ion-label>{{ 'SETTINGS.THEME' | translate }}</ion-label>
        <ion-note slot="end">{{ getCurrentThemeName() }}</ion-note>
      </ion-item>
      <ion-item button (click)="exportData()">
        <ion-icon name="download-outline" slot="start"></ion-icon>
        <ion-label>{{ 'SETTINGS.EXPORT_DATA' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="importData()">
        <ion-icon name="cloud-upload-outline" slot="start"></ion-icon>
        <ion-label>{{ 'SETTINGS.IMPORT_DATA' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="showStatistics()">
        <ion-icon name="stats-chart-outline" slot="start"></ion-icon>
        <ion-label>{{ 'SETTINGS.STATISTICS' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="showHelp()">
        <ion-icon name="help-circle-outline" slot="start"></ion-icon>
        <ion-label>{{ 'SETTINGS.HELP' | translate }}</ion-label>
      </ion-item>
      <ion-item button (click)="clearAll()">
        <ion-icon name="trash-outline" slot="start" color="danger"></ion-icon>
        <ion-label color="danger">{{ 'SETTINGS.CLEAR_ALL' | translate }}</ion-label>
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
  constructor(
    private popoverController: PopoverController,
    public translate: TranslateService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {}

  getCurrentLanguageName(): string {
    const currentLang = this.languageService.getCurrentLanguage();
    return this.languageService.getLanguageName(currentLang);
  }

  getCurrentThemeName(): string {
    const currentTheme = this.themeService.getCurrentTheme();
    const themeKey = `THEMES.${currentTheme.toUpperCase().replace(/-/g, '_')}`;
    return this.translate.instant(themeKey);
  }

  async changeLanguage() {
    await this.popoverController.dismiss({ action: 'changeLanguage' });
  }

  async changeTheme() {
    await this.popoverController.dismiss({ action: 'changeTheme' });
  }

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
