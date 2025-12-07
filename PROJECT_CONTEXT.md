# Kanban Tasks - Contexto del Proyecto

## Descripción
Aplicación Kanban móvil/web desarrollada con Ionic + Angular para gestión de tareas con sistema de tableros múltiples, prioridades, y notificaciones.

## Stack Tecnológico
- **Framework**: Ionic 8 + Angular 20
- **Lenguaje**: TypeScript
- **Almacenamiento**: @ionic/storage-angular (LocalForage)
- **Internacionalización**: @ngx-translate/core v17.0.0
- **Drag & Drop**: @angular/cdk/drag-drop
- **Notificaciones**: @capacitor/local-notifications
- **Platform**: Capacitor

## Estructura del Proyecto

```
src/app/
├── models/
│   ├── task.model.ts       # Task, Column, TaskStatus, TaskPriority
│   └── board.model.ts      # Board, CreateBoardDto
├── services/
│   ├── task.service.ts     # Gestión de tareas y columnas
│   ├── board.service.ts    # Gestión de tableros múltiples
│   ├── notification.service.ts  # Notificaciones locales
│   └── language.service.ts # Gestión de idiomas
├── home/
│   ├── home.page.ts        # Página principal del Kanban
│   ├── home.page.html
│   ├── home.page.scss
│   ├── column-menu-popover.component.ts
│   └── settings-menu-popover.component.ts
└── app.module.ts

src/assets/i18n/
├── es.json                 # Traducciones español
└── en.json                 # Traducciones inglés
```

## Características Implementadas

### 1. Sistema de Tableros Múltiples (Multi-Board)
- ✅ Crear, editar y eliminar tableros
- ✅ Cambiar entre tableros mediante menú desplegable
- ✅ Cada tablero tiene sus propias columnas y tareas independientes
- ✅ Tablero por defecto creado automáticamente en primer uso
- ✅ Nombre del tablero activo mostrado en header
- ✅ Protección: no se puede eliminar el último tablero

### 2. Gestión de Tareas
- ✅ Crear tareas con título, descripción y prioridad
- ✅ Editar información de tareas existentes
- ✅ Eliminar tareas
- ✅ Mover tareas entre columnas (drag & drop)
- ✅ Prioridades: Alta (🔴), Media (🟡), Baja (🟢)
- ✅ Indicador visual de prioridad en cada tarjeta
- ✅ **Archivar/desarchivar tareas** (no se eliminan, se ocultan)
- ✅ Modal de tareas archivadas con contador en header
- ✅ Restaurar tareas archivadas

### 3. Gestión de Columnas
- ✅ Crear columnas personalizadas
- ✅ Editar nombre de columnas
- ✅ Cambiar color de fondo de columnas (7 colores disponibles)
- ✅ Reordenar columnas (drag & drop horizontal)
- ✅ Archivar todas las tareas de una columna
- ✅ Vaciar columna (eliminar todas las tareas)
- ✅ Eliminar columna
- ✅ Contador de tareas activas por columna (excluye archivadas)

### 4. Internacionalización (i18n)
- ✅ Soporte para Español e Inglés
- ✅ Selector de idioma en menú de configuración
- ✅ Preferencia de idioma guardada en Ionic Storage
- ✅ Traducciones completas para toda la interfaz
- ✅ Integración con @ngx-translate/core v17

### 5. Notificaciones
- ✅ Notificaciones locales para tareas con fecha límite
- ✅ Capacitor Local Notifications

### 6. UI/UX Avanzado

#### Efecto "Load Before Move" (Drag & Drop)
- ✅ Delay de 700ms antes de activar drag & drop
- ✅ Indicador visual de carga (0-300ms: delay, 300-700ms: animación)
- ✅ Velo blanquecino que se llena de izquierda a derecha
- ✅ Animación CSS con `scaleX` y `animation-delay: 0.3s`
- ✅ Aplicado tanto a tarjetas como a columnas
- ✅ Prevención de propagación de eventos (tarjeta no activa columna)
- ✅ Velo estático permanece durante el arrastre

#### Tema Oscuro Personalizado
- ✅ **Toolbar**: `#1F1F21` con texto/iconos `#A9ABAF`
- ✅ **Board background**: `#5C6266`
- ✅ **Columnas**: `#101204` con texto `#B6B8BA`
- ✅ **Tarjetas**: `#242528` con texto `#B6B8BA`
- ✅ **Barra de prioridad**: 8px de altura
- ✅ Colores de prioridad: Rojo (#eb445a), Amarillo (#ffc409), Verde (#2dd36f)
- ✅ Hover desactivado en tarjetas (evita confusión con drag)

### 7. Otras Funcionalidades
- ✅ Exportar datos en formato JSON
- ✅ Estadísticas de tareas (total, por estado, por prioridad)
- ✅ Sistema de ayuda integrado
- ✅ Limpiar todos los datos
- ✅ Persistencia automática en LocalStorage

## Arquitectura de Servicios

### BoardService
**Responsabilidad**: Gestión de tableros múltiples

```typescript
- boards$: Observable<Board[]>           // Lista de todos los tableros
- activeBoard$: Observable<Board | null> // Tablero actualmente activo

Métodos principales:
- createBoard(dto: CreateBoardDto): Promise<Board>
- updateBoard(boardId: string, updates: Partial<Board>): Promise<void>
- deleteBoard(boardId: string): Promise<void>
- setActiveBoard(boardId: string): Promise<void>
- updateActiveBoardColumns(columns: Column[]): Promise<void>
```

**Almacenamiento**:
- Key `kanban_boards`: Array de todos los tableros
- Key `active_board_id`: ID del tablero activo

### TaskService
**Responsabilidad**: Gestión de tareas y columnas dentro del tablero activo

```typescript
- columns$: Observable<Column[]>  // Columnas del tablero activo

Métodos principales:
- addTask(task: Partial<Task>): Promise<void>
- updateTask(taskId: string, updates: Partial<Task>): Promise<void>
- deleteTask(taskId: string): Promise<void>
- moveTask(taskId, fromStatus, toStatus, newIndex): Promise<void>
- addColumn(title: string): Promise<void>
- deleteColumn(columnId): Promise<void>
- updateColumnTitle(columnId, newTitle): Promise<void>
- reorderColumns(columns: Column[]): Promise<void>
```

**Integración**: TaskService ahora guarda todos los cambios a través de `BoardService.updateActiveBoardColumns()`

### LanguageService
**Responsabilidad**: Gestión del idioma de la aplicación

```typescript
Métodos principales:
- setLanguage(lang: string): Promise<void>
- getCurrentLanguage(): string
- getAvailableLanguages(): string[]
- getLanguageName(lang: string): string
```

**Almacenamiento**: Ionic Storage con key `app_language`

## Modelos de Datos

### Board
```typescript
interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}
```

### Column
```typescript
interface Column {
  id: string | TaskStatus;
  title: string;
  tasks: Task[];
  backgroundColor?: string;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  notificationEnabled?: boolean;
  archived?: boolean;      // Nueva: indica si está archivada
  archivedAt?: Date;       // Nueva: fecha de archivado
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}
```

## Flujo de Datos

1. **Inicialización**:
   - `BoardService.initStorage()` → Carga tableros del storage
   - Si no hay tableros → Crea tablero por defecto "Mi Tablero"
   - Establece tablero activo (último usado o primero disponible)

2. **Cambio de Tablero Activo**:
   - Usuario selecciona tablero → `BoardService.setActiveBoard(id)`
   - `activeBoard$` emite nuevo tablero
   - `TaskService` escucha `activeBoard$` y actualiza `columns$`
   - UI se actualiza reactivamente

3. **Modificación de Tareas**:
   - Usuario modifica tarea → `TaskService.updateTask()`
   - TaskService actualiza columnas localmente
   - Llama a `BoardService.updateActiveBoardColumns()`
   - BoardService guarda en storage

## Configuración de Traducciones

### ngx-translate v17
- Archivo de configuración: `app.module.ts`
- Provider: `provideTranslateHttpLoader()`
- Ruta de archivos: `./assets/i18n/{lang}.json`

### Estructura de Traducciones
```json
{
  "APP": { "TITLE": "..." },
  "HOME": { ... },
  "TASK": { ... },
  "COLUMN": { ... },
  "BOARD": {
    "MY_BOARDS": "Mis Tableros",
    "NEW_BOARD": "Nuevo Tablero",
    ...
  },
  "SETTINGS": { ... },
  "BUTTONS": { ... }
}
```

## UI/UX Destacado

### Header
- Botón izquierdo (📊): Menú de tableros
- Título: Nombre del tablero activo
- Botón derecho (⚙️): Menú de configuración

### Menú de Tableros
- Lista de todos los tableros (checkmark en el activo)
- Opción "Crear Nuevo Tablero"
- Cambio instantáneo al seleccionar

### Menú de Columnas
- Cambiar nombre
- Cambiar color de fondo (7 opciones)
- Archivar todas las tareas
- Vaciar columna
- Eliminar columna

### Drag & Drop
- Horizontal: Reordenar columnas
- Vertical: Mover tareas dentro de columna
- Entre columnas: Cambiar estado de tareas

## Historial de Desarrollo

### Fase 1: Multilenguaje
- Instalación de @ngx-translate/core y http-loader v17
- Creación de archivos de traducción (es.json, en.json)
- Implementación de LanguageService
- Integración con Ionic Storage
- Actualización de toda la UI con pipes de traducción

### Fase 2: Multi-tablero
- Creación de BoardService con gestión de tableros
- Refactorización de TaskService para trabajar con tableros
- Implementación de UI para cambiar/crear tableros
- Tablero por defecto en primer uso
- Persistencia de tablero activo

### Fase 3: Rechazada - Modo Mobile Vertical
- Usuario solicitó vista carousel con swipe entre columnas
- Usuario rechazó la implementación: "deshaz los cambios"
- Código revertido completamente

## Comandos Útiles

```bash
# Desarrollo
npm start                    # Inicia servidor de desarrollo (puerto 4200)
ng serve --port 4201        # Puerto alternativo

# Build
npm run build               # Build de producción
ng build --configuration development  # Build de desarrollo

# Capacitor
ionic capacitor build android
ionic capacitor run android
```

## Notas Importantes

1. **Storage**: Toda la persistencia usa Ionic Storage (LocalForage), NO Capacitor Preferences
2. **Traducción v17**: Usar `provideTranslateHttpLoader()` en lugar del factory pattern antiguo
3. **Sincronización**: TaskService y BoardService trabajan juntos - TaskService SIEMPRE guarda a través de BoardService
4. **Protecciones**: No se puede eliminar el último tablero (validación en BoardService)

## Historial de Desarrollo

### Sesión 2025-12-07: UI/UX, Archivado y Build Android

#### Funcionalidades Implementadas
1. **Sistema de Archivado de Tareas**
   - Agregados campos `archived` y `archivedAt` al modelo Task
   - Métodos `archiveTask()`, `unarchiveTask()`, `getArchivedTasks()` en TaskService
   - Componente standalone `ArchivedTasksModalComponent` para ver/gestionar archivadas
   - Badge contador en header con número de tareas archivadas
   - Filtrado: tareas archivadas ocultas con `[hidden]="task.archived"`
   - Swipe-to-unarchive/delete en modal

2. **Efecto "Load Before Move"** (Drag & Drop mejorado)
   - Implementado delay de 700ms con `cdkDragStartDelay="700"`
   - Animación CSS de velo que se llena de izquierda a derecha
   - Timeline: 0-300ms (nada), 300-700ms (animación), 700ms (drag activo)
   - Variables de estado: `loadBeforeMoveTaskId`, `loadBeforeMoveColumnId`
   - Event handlers: `onTaskPointerDown()`, `onColumnPointerDown()`, `onPointerUp()`, `onDragStarted()`
   - Prevención de propagación: click en tarjeta no activa efecto en columna
   - Velo estático permanece durante el arrastre (transform resetted)

3. **Tema Oscuro Personalizado**
   - Colores aplicados en `home.page.scss`:
     - Toolbar: `#1F1F21` / texto: `#A9ABAF`
     - Board: `#5C6266`
     - Columnas: `#101204` / texto: `#B6B8BA`
     - Tarjetas: `#242528` / texto: `#B6B8BA`
   - Barra de prioridad aumentada de 4px a 8px
   - Hover desactivado en tarjetas para evitar confusión

4. **Build y Despliegue Android**
   - Ajustado budget CSS en `angular.json` (4kb → 6kb)
   - Build de producción exitoso (`npm run build`)
   - Sincronización con Capacitor (`npx cap sync android`)
   - Instalación de Java JDK 25 LTS (Adoptium/Temurin)
   - Configuración de Android SDK Command Line Tools
   - Variables de entorno: `JAVA_HOME`, `ANDROID_HOME`
   - Archivo `local.properties` creado con ruta del SDK
   - APK generado exitosamente: `app-debug.apk`
   - **✅ Aplicación instalada y funcionando en móvil Android**

#### Archivos Modificados
- `src/app/models/task.model.ts` - Agregados campos archived/archivedAt
- `src/app/services/task.service.ts` - Métodos de archivado
- `src/app/home/archived-tasks-modal.component.ts` - Nuevo componente standalone
- `src/app/home/home.page.ts` - Lógica load-before-move y archivado
- `src/app/home/home.page.html` - Event handlers y binding de estados
- `src/app/home/home.page.scss` - Tema oscuro y animaciones load-before-move
- `src/assets/i18n/es.json` y `en.json` - Traducciones de archivado
- `angular.json` - Budget aumentado a 6kb
- `android/local.properties` - Configuración SDK

#### Decisiones Técnicas
- **Archivado soft-delete**: Las tareas archivadas se mantienen en el array pero ocultas con `[hidden]`
- **Animación CSS pura**: Preferida sobre JavaScript para mejor performance
- **Standalone component**: Modal de archivado usa nuevo sistema standalone de Angular
- **Event.stopPropagation()**: Evita conflictos entre eventos de tarjeta y columna
- **Java 25 LTS**: Versión más reciente compatible con Android Gradle

## Problemas Identificados

### 🔴 PENDIENTE: Barra de estado Android
**Descripción**: La barra superior de Android (status bar) se ve por encima de la barra de menú de la aplicación.

**Posibles soluciones a investigar**:
- Configurar `StatusBar` plugin de Capacitor
- Ajustar `ion-header` con `translucent` o padding-top
- Revisar configuración de `SafeArea` en Android
- Usar `StatusBar.setOverlaysWebView(false)`

## Sugerencias Pendientes

### 1. Sistema de Temas Escalable (ALTA PRIORIDAD)
**Propuesta**: Implementar sistema de temas dinámico con Variables CSS + Service

**Estructura sugerida**:
```
src/theme/
├── theme.service.ts          # Gestión de temas
├── themes/
│   ├── dark-default.theme.ts  # Tema oscuro actual
│   ├── light.theme.ts         # Tema claro
│   ├── dark-blue.theme.ts     # Variante azul oscura
│   └── custom.theme.ts        # Tema personalizable
└── variables.scss             # Variables CSS globales
```

**Ventajas**:
- ✅ Cambio de tema en runtime sin recargar
- ✅ Fácil mantenimiento y extensión
- ✅ Soporte para temas claros/oscuros/personalizados
- ✅ Persistencia en localStorage
- ✅ CSS moderno y performante

**Variables CSS propuestas**:
```scss
--toolbar-bg
--toolbar-text
--board-bg
--column-bg
--column-text
--card-bg
--card-text
--priority-high
--priority-medium
--priority-low
```

**Temas iniciales**:
1. Dark Default (actual)
2. Light (claro)
3. Dark Blue (azul oscuro)

### 2. Otras Mejoras Futuras
- [ ] Editor de temas en la app (crear temas personalizados)
- [ ] Exportar/importar temas (JSON)
- [ ] Compartir temas entre usuarios
- [ ] Sistema de etiquetas/tags para tareas
- [ ] Filtros y búsqueda de tareas
- [ ] Fechas de vencimiento con calendario
- [ ] Importar datos desde archivo
- [ ] Sincronización en la nube
- [ ] Compartir tableros

## Estado Actual
✅ **Build exitoso sin errores**
✅ **Todas las características funcionando**
✅ **APK generado e instalado en Android**
✅ **Aplicación funcional en móvil**
🔴 **Pendiente**: Solucionar barra de estado Android

---

**Última actualización**: 2025-12-07
**Versión Angular**: 20
**Versión Ionic**: 8
**Versión Java**: 25 LTS
**Android SDK**: Command Line Tools (API 34)
