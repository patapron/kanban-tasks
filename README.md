# Kanban Tasks - Gestor de Tareas para Android

Aplicación móvil de gestión de tareas tipo Kanban desarrollada con Ionic, Angular 20 y Capacitor.

## Características

- ✅ Tablero Kanban con 3 columnas: Por hacer, En progreso, Completado
- ✅ Drag & Drop entre columnas usando Angular CDK
- ✅ Persistencia de datos local con Capacitor Preferences
- ✅ Notificaciones locales programables
- ✅ Prioridades de tareas (Alta, Media, Baja)
- ✅ Interfaz responsive y moderna

## Requisitos Previos

**IMPORTANTE:** Este proyecto requiere Node.js >= 20.0.0

Actualmente tienes Node.js v16.20.2 instalado. Debes actualizar Node.js para continuar.

### Actualizar Node.js

**Opción 1: Usando nvm (recomendado)**
```bash
# Instalar nvm si no lo tienes
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reiniciar la terminal y luego:
nvm install 20
nvm use 20
nvm alias default 20
```

**Opción 2: Descarga directa**
Descarga Node.js LTS desde: https://nodejs.org/

## Instalación

1. Navega al directorio del proyecto:
```bash
cd kanban-tasks
```

2. Las dependencias ya están instaladas. Si necesitas reinstalarlas:
```bash
npm install
```

## Desarrollo Web

Para probar la aplicación en el navegador:

```bash
ionic serve
```

O con npm:
```bash
npm start
```

La aplicación se abrirá en http://localhost:8100

## Añadir Plataforma Android

Una vez que hayas actualizado Node.js a la versión 20 o superior:

1. Sincronizar Capacitor:
```bash
npx cap sync
```

2. Añadir la plataforma Android:
```bash
npx cap add android
```

3. Abrir el proyecto en Android Studio:
```bash
npx cap open android
```

## Configurar Widget de Android (Opcional)

Para crear un widget nativo de Android, necesitas trabajar con código nativo en Java/Kotlin dentro de Android Studio.

### Pasos para crear el widget:

1. En Android Studio, crea una nueva clase para el widget en:
   `android/app/src/main/java/io/ionic/starter/TaskWidgetProvider.java`

2. Define el layout del widget en:
   `android/app/src/main/res/layout/task_widget.xml`

3. Configura el widget en:
   `android/app/src/main/res/xml/task_widget_info.xml`

4. Registra el widget en `AndroidManifest.xml`

### Ejemplo básico de Widget Provider:

```java
package io.ionic.starter;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

public class TaskWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.task_widget);

            // Aquí puedes leer las tareas del almacenamiento y mostrarlas
            views.setTextViewText(R.id.widget_title, "Mis Tareas");

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
```

### Comunicación entre Widget y App:

Para que el widget pueda leer las tareas guardadas, puedes usar:
- SharedPreferences de Android (acceder a los datos de Capacitor Preferences)
- Crear un servicio nativo que lea los datos del almacenamiento

## Generar APK

### APK de Debug:

1. Desde Android Studio:
   - Build > Build Bundle(s) / APK(s) > Build APK(s)
   - El APK se generará en: `android/app/build/outputs/apk/debug/`

2. Desde la línea de comandos:
```bash
cd android
./gradlew assembleDebug
```

### APK de Release (Firmado):

1. Crea un keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configura el signing en `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("my-release-key.keystore")
            storePassword "your-password"
            keyAlias "my-key-alias"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. Genera el APK:
```bash
cd android
./gradlew assembleRelease
```

El APK se generará en: `android/app/build/outputs/apk/release/`

## Permisos de Android

La aplicación solicita los siguientes permisos (ya configurados en el código):

- `POST_NOTIFICATIONS` - Para enviar notificaciones locales
- `SCHEDULE_EXACT_ALARM` - Para programar notificaciones en horarios específicos

## Estructura del Proyecto

```
src/
├── app/
│   ├── models/
│   │   └── task.model.ts         # Modelos de datos (Task, Column, enums)
│   ├── services/
│   │   ├── task.service.ts       # Servicio principal de tareas
│   │   └── notification.service.ts # Servicio de notificaciones
│   ├── home/
│   │   ├── home.page.ts          # Componente principal del Kanban
│   │   ├── home.page.html        # Template del tablero
│   │   └── home.page.scss        # Estilos del tablero
│   └── app.module.ts             # Módulo principal
```

## Funcionalidades

### Agregar Tarea
- Toca el botón "+" en la parte superior
- Ingresa título, descripción y prioridad
- La tarea se agregará a la columna "Por hacer"

### Editar Tarea
- Toca cualquier tarjeta de tarea
- Modifica los campos
- Puedes eliminar la tarea desde este diálogo

### Mover Tareas
- Mantén presionada una tarjeta
- Arrastra a otra columna
- Suelta para confirmar el movimiento

### Notificaciones
- Las notificaciones se programan automáticamente cuando una tarea tiene fecha de vencimiento
- Se envía una notificación 1 hora antes del vencimiento
- Las notificaciones se cancelan automáticamente si la tarea se elimina

## Próximas Mejoras

- [ ] Selector de fecha para tareas
- [ ] Toggle para habilitar/deshabilitar notificaciones por tarea
- [ ] Filtros por prioridad
- [ ] Búsqueda de tareas
- [ ] Estadísticas de productividad
- [ ] Temas oscuro/claro
- [ ] Widget nativo completamente funcional
- [ ] Sincronización con backend (Firebase, etc.)

## Tecnologías Utilizadas

- **Ionic Framework** 8.x
- **Angular** 20.3
- **Capacitor** 7.x
- **Angular CDK** 20.x - Drag & Drop
- **Capacitor Preferences** - Almacenamiento local
- **Capacitor Local Notifications** - Notificaciones locales

## Troubleshooting

### El drag & drop no funciona
- Verifica que el módulo DragDropModule esté importado en app.module.ts
- Asegúrate de que las directivas cdkDrag y cdkDropList estén correctamente aplicadas

### Las notificaciones no aparecen
- Verifica que hayas concedido permisos de notificación
- En Android, asegúrate de que la app tenga permisos en Configuración > Aplicaciones

### Error de compilación en Android
- Asegúrate de tener instalado:
  - Android Studio
  - Android SDK 33 o superior
  - Gradle 8.x
  - JDK 17

## Licencia

MIT

## Autor

Proyecto generado con Claude Code
