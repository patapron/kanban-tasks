import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';
  private availableLanguages = ['es', 'en'];
  private defaultLanguage = 'es';
  private storageInitialized = false;

  constructor(
    private translate: TranslateService,
    private storage: Storage
  ) {
    // Configuración síncrona inicial
    this.translate.addLangs(this.availableLanguages);
    this.translate.setDefaultLang(this.defaultLanguage);

    // Usar el idioma del navegador o español por defecto
    const browserLang = this.translate.getBrowserLang();
    const initialLang = browserLang && this.availableLanguages.includes(browserLang)
      ? browserLang
      : this.defaultLanguage;
    this.translate.use(initialLang);

    // Inicializar storage y cargar idioma guardado
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    this.storageInitialized = true;
    await this.loadSavedLanguage();
  }

  private async loadSavedLanguage() {
    if (!this.storageInitialized) return;

    const savedLanguage = await this.getSavedLanguage();
    if (savedLanguage && this.availableLanguages.includes(savedLanguage)) {
      this.translate.use(savedLanguage);
    }
  }

  async getSavedLanguage(): Promise<string | null> {
    if (!this.storageInitialized) return null;
    return await this.storage.get(this.LANGUAGE_KEY);
  }

  async setLanguage(lang: string) {
    if (this.availableLanguages.includes(lang)) {
      this.translate.use(lang);
      if (this.storageInitialized) {
        await this.storage.set(this.LANGUAGE_KEY, lang);
      }
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
