# Guía para Implementar Widget de Android

Esta guía detalla cómo crear un widget nativo de Android para mostrar las tareas del Kanban.

## Requisitos

- Android Studio instalado
- Proyecto Android añadido con `npx cap add android`
- Conocimientos básicos de Java/Kotlin

## Paso 1: Configurar el Widget Provider

Crea el archivo `android/app/src/main/java/io/ionic/starter/TaskWidgetProvider.java`:

```java
package io.ionic.starter;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TaskWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.task_widget);

        // Leer tareas del almacenamiento de Capacitor
        String tasksData = getTasksFromStorage(context);
        String[] tasksList = parseTasksData(tasksData);

        // Actualizar el contenido del widget
        if (tasksList != null && tasksList.length > 0) {
            views.setTextViewText(R.id.widget_task_count, String.valueOf(tasksList.length) + " tareas");
            views.setTextViewText(R.id.widget_task_1, tasksList.length > 0 ? tasksList[0] : "");
            views.setTextViewText(R.id.widget_task_2, tasksList.length > 1 ? tasksList[1] : "");
            views.setTextViewText(R.id.widget_task_3, tasksList.length > 2 ? tasksList[2] : "");
        } else {
            views.setTextViewText(R.id.widget_task_count, "No hay tareas");
        }

        // Configurar intento para abrir la app al tocar el widget
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        // Actualizar el widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private String getTasksFromStorage(Context context) {
        // Capacitor usa SharedPreferences con un prefijo específico
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        // La clave es "kanban_tasks" según nuestro código
        return prefs.getString("kanban_tasks", "[]");
    }

    private String[] parseTasksData(String jsonData) {
        try {
            JSONArray columns = new JSONArray(jsonData);
            java.util.ArrayList<String> todoTasks = new java.util.ArrayList<>();

            // Buscar la columna "todo" y extraer títulos de tareas
            for (int i = 0; i < columns.length(); i++) {
                JSONObject column = columns.getJSONObject(i);
                if ("todo".equals(column.getString("id"))) {
                    JSONArray tasks = column.getJSONArray("tasks");
                    for (int j = 0; j < Math.min(tasks.length(), 3); j++) {
                        JSONObject task = tasks.getJSONObject(j);
                        todoTasks.add(task.getString("title"));
                    }
                    break;
                }
            }

            return todoTasks.toArray(new String[0]);
        } catch (JSONException e) {
            e.printStackTrace();
            return new String[0];
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Widget habilitado por primera vez
    }

    @Override
    public void onDisabled(Context context) {
        // Último widget removido
    }
}
```

## Paso 2: Crear el Layout del Widget

Crea el archivo `android/app/src/main/res/layout/task_widget.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@drawable/widget_background">

    <TextView
        android:id="@+id/widget_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Kanban Tasks"
        android:textSize="18sp"
        android:textStyle="bold"
        android:textColor="#FFFFFF"
        android:paddingBottom="8dp" />

    <TextView
        android:id="@+id/widget_task_count"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="0 tareas"
        android:textSize="14sp"
        android:textColor="#CCCCCC"
        android:paddingBottom="12dp" />

    <View
        android:layout_width="match_parent"
        android:layout_height="1dp"
        android:background="#444444"
        android:layout_marginBottom="12dp" />

    <TextView
        android:id="@+id/widget_task_1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text=""
        android:textSize="14sp"
        android:textColor="#FFFFFF"
        android:paddingBottom="8dp"
        android:ellipsize="end"
        android:maxLines="1"
        android:visibility="visible" />

    <TextView
        android:id="@+id/widget_task_2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text=""
        android:textSize="14sp"
        android:textColor="#FFFFFF"
        android:paddingBottom="8dp"
        android:ellipsize="end"
        android:maxLines="1"
        android:visibility="visible" />

    <TextView
        android:id="@+id/widget_task_3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text=""
        android:textSize="14sp"
        android:textColor="#FFFFFF"
        android:ellipsize="end"
        android:maxLines="1"
        android:visibility="visible" />

</LinearLayout>
```

## Paso 3: Crear el Background del Widget

Crea el archivo `android/app/src/main/res/drawable/widget_background.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#3880ff" />
    <corners android:radius="16dp" />
    <padding
        android:left="16dp"
        android:top="16dp"
        android:right="16dp"
        android:bottom="16dp" />
</shape>
```

## Paso 4: Configurar Widget Info

Crea el directorio `android/app/src/main/res/xml/` (si no existe) y el archivo `task_widget_info.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="180dp"
    android:updatePeriodMillis="1800000"
    android:previewImage="@drawable/ic_launcher_foreground"
    android:initialLayout="@layout/task_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:description="@string/widget_description" />
```

## Paso 5: Añadir String Resources

Edita `android/app/src/main/res/values/strings.xml` y añade:

```xml
<resources>
    <!-- ... otros strings ... -->
    <string name="widget_description">Muestra tus tareas pendientes del Kanban</string>
</resources>
```

## Paso 6: Registrar el Widget en AndroidManifest.xml

Edita `android/app/src/main/AndroidManifest.xml` y añade dentro de `<application>`:

```xml
<receiver
    android:name=".TaskWidgetProvider"
    android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/task_widget_info" />
</receiver>
```

## Paso 7: Actualizar el Widget desde la App

Para que el widget se actualice cuando cambien las tareas, necesitas crear un método nativo en tu app.

### Opción A: Crear un Plugin de Capacitor

Crea un plugin personalizado de Capacitor para actualizar el widget:

1. Crea `android/app/src/main/java/io/ionic/starter/WidgetPlugin.java`:

```java
package io.ionic.starter;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Widget")
public class WidgetPlugin extends Plugin {

    @PluginMethod
    public void updateWidget(PluginCall call) {
        Context context = getContext();
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, TaskWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(componentName);

        TaskWidgetProvider widgetProvider = new TaskWidgetProvider();
        widgetProvider.onUpdate(context, appWidgetManager, appWidgetIds);

        call.resolve();
    }
}
```

2. Registra el plugin en `MainActivity.java`:

```java
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(WidgetPlugin.class);
    }
}
```

3. Usa el plugin desde tu servicio de tareas en TypeScript:

```typescript
import { Plugins } from '@capacitor/core';

// Añadir después de guardar tareas
async saveTasks(): Promise<void> {
  try {
    const columns = this.columnsSubject.value;
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(columns)
    });

    // Actualizar widget
    if (Capacitor.isNativePlatform()) {
      const { Widget } = Plugins;
      await Widget.updateWidget();
    }
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}
```

## Paso 8: Probar el Widget

1. Compila y ejecuta la app en un dispositivo o emulador Android
2. Mantén presionado en la pantalla de inicio
3. Busca "Widgets" en el menú
4. Encuentra "Kanban Tasks" y arrástralo a la pantalla de inicio
5. El widget debería mostrar las primeras 3 tareas de la columna "Por hacer"

## Troubleshooting

### El widget no aparece en la lista
- Verifica que el `<receiver>` esté correctamente registrado en AndroidManifest.xml
- Asegúrate de que `android:exported="true"` esté configurado
- Reconstruye completamente el proyecto

### El widget muestra datos antiguos
- Verifica que estés llamando a `updateWidget()` después de guardar las tareas
- Revisa los logs de Android Studio para errores
- Limpia el caché de la app y reinstala

### Error de permisos
- El widget no necesita permisos especiales para leer SharedPreferences de la misma app

## Mejoras Futuras

- [ ] Mostrar tareas de todas las columnas con colores diferentes
- [ ] Añadir un botón para marcar tareas como completadas desde el widget
- [ ] Configuración del widget (qué columna mostrar)
- [ ] Widget más pequeño (1x1) que solo muestra el contador
- [ ] Widget scrollable para mostrar más de 3 tareas

## Referencias

- [Android Widgets Documentation](https://developer.android.com/guide/topics/appwidgets)
- [Capacitor Android Platform](https://capacitorjs.com/docs/android)
- [Creating Capacitor Plugins](https://capacitorjs.com/docs/plugins/creating-plugins)
