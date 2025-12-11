import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

export enum Theme {
  DARK_DEFAULT = 'dark-default',
  LIGHT = 'light',
  DARK_BLUE = 'dark-blue'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected_theme';
  private currentThemeSubject = new BehaviorSubject<Theme>(Theme.DARK_DEFAULT);
  public currentTheme$: Observable<Theme> = this.currentThemeSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  private async init(): Promise<void> {
    await this.storage.create();
    await this.loadTheme();
  }

  private async loadTheme(): Promise<void> {
    const savedTheme = await this.storage.get(this.THEME_KEY);
    const theme = savedTheme || Theme.DARK_DEFAULT;
    await this.setTheme(theme);
  }

  async setTheme(theme: Theme): Promise<void> {
    // Remover todas las clases de tema
    document.body.classList.remove('theme-light', 'theme-dark-blue');

    // Añadir la clase del tema seleccionado (excepto dark-default que es el default en :root)
    if (theme === Theme.LIGHT) {
      document.body.classList.add('theme-light');
    } else if (theme === Theme.DARK_BLUE) {
      document.body.classList.add('theme-dark-blue');
    }

    // Guardar tema seleccionado
    await this.storage.set(this.THEME_KEY, theme);
    this.currentThemeSubject.next(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  getAvailableThemes(): Array<{ value: Theme; label: string; description: string }> {
    return [
      {
        value: Theme.DARK_DEFAULT,
        label: 'Oscuro (Por defecto)',
        description: 'Tema oscuro predeterminado con tonos grises'
      },
      {
        value: Theme.LIGHT,
        label: 'Claro',
        description: 'Tema claro para ambientes luminosos'
      },
      {
        value: Theme.DARK_BLUE,
        label: 'Azul Oscuro',
        description: 'Tema oscuro con tonalidades azules'
      }
    ];
  }
}
