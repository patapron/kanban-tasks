import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';
  private availableLanguages = ['es', 'en'];
  private defaultLanguage = 'es';

  constructor(private translate: TranslateService) {
    // Configuración síncrona inicial
    this.translate.addLangs(this.availableLanguages);
    this.translate.setDefaultLang(this.defaultLanguage);

    // Usar el idioma del navegador o español por defecto
    const browserLang = this.translate.getBrowserLang();
    const initialLang = browserLang && this.availableLanguages.includes(browserLang)
      ? browserLang
      : this.defaultLanguage;
    this.translate.use(initialLang);

    // Cargar idioma guardado de forma asíncrona
    this.loadSavedLanguage();
  }

  private async loadSavedLanguage() {
    const savedLanguage = await this.getSavedLanguage();
    if (savedLanguage && this.availableLanguages.includes(savedLanguage)) {
      this.translate.use(savedLanguage);
    }
  }

  async getSavedLanguage(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.LANGUAGE_KEY });
    return value;
  }

  async setLanguage(lang: string) {
    if (this.availableLanguages.includes(lang)) {
      this.translate.use(lang);
      await Preferences.set({
        key: this.LANGUAGE_KEY,
        value: lang
      });
    }
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.defaultLanguage;
  }

  getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  getLanguageName(code: string): string {
    const names: { [key: string]: string } = {
      'es': 'Español',
      'en': 'English'
    };
    return names[code] || code;
  }
}
