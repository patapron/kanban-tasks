import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private lastBackPress = 0;
  private readonly BACK_BUTTON_TIMEOUT = 2000; // 2 segundos

  constructor(
    private languageService: LanguageService,
    private themeService: ThemeService,
    private platform: Platform,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    await this.setupStatusBar();
    this.setupBackButtonHandler();
  }

  private async setupStatusBar() {
    try {
      // Configurar la barra de estado para Android
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#1F1F21' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      // StatusBar no está disponible en web
      console.log('StatusBar not available:', error);
    }
  }

  private setupBackButtonHandler() {
    App.addListener('backButton', async () => {
      const currentTime = new Date().getTime();

      // Si han pasado más de 2 segundos desde la última pulsación
      if (currentTime - this.lastBackPress > this.BACK_BUTTON_TIMEOUT) {
        this.lastBackPress = currentTime;
        await this.showExitToast();
      } else {
        // Segunda pulsación en menos de 2 segundos - salir de la app
        App.exitApp();
      }
    });
  }

  private async showExitToast() {
    const message = await this.translate.get('EXIT.PRESS_AGAIN').toPromise();
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
