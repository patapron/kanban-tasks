# Configuración del Entorno de Desarrollo - Kanban Tasks

## Estado Actual

### Completado
- Proyecto clonado en `C:\Users\pronick\Documents\proyectos\kanban-tasks`
- Dependencias npm instaladas (1326 paquetes, 0 vulnerabilidades)
- Plataforma Android configurada

### Verificaciones Necesarias

#### 1. Node.js y npm

El proyecto requiere **Node.js >= 20.0.0**

**Verificar versión:**
```bash
node --version
npm --version
```

**Si necesitas actualizar Node.js:**

**Opción A: Usando nvm (recomendado)**
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reiniciar terminal y luego:
nvm install 20
nvm use 20
nvm alias default 20
```

**Opción B: Descarga directa**
Descarga Node.js LTS (v20+) desde: https://nodejs.org/

**Verificar después de instalar:**
```bash
node --version  # Debe mostrar v20.x.x o superior
npm --version   # Debe mostrar 9.x.x o superior
```

#### 2. Ionic CLI (Opcional pero Recomendado)

```bash
# Instalar Ionic CLI globalmente
npm install -g @ionic/cli

# Verificar instalación
ionic --version
```

#### 3. Visual Studio Code (Ya instalado)

**Extensiones Recomendadas:**
- Angular Language Service
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Ionic Preview
- Path Intellisense

**Instalar extensiones:**
```bash
# Desde terminal en VS Code
code --install-extension angular.ng-template
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

#### 4. Android Studio (Para desarrollo móvil)

**Descargar desde:** https://developer.android.com/studio

**Componentes necesarios:**
- Android SDK 33 o superior
- Android SDK Build-Tools
- Android Emulator
- Android SDK Platform-Tools

**Variables de entorno (Windows):**
```
ANDROID_HOME = C:\Users\pronick\AppData\Local\Android\Sdk
Path += %ANDROID_HOME%\platform-tools
Path += %ANDROID_HOME%\tools
```

**Verificar:**
```bash
# En terminal (CMD o PowerShell)
adb --version
```

#### 5. JDK 17 (Para builds Android)

**Descargar desde:** https://adoptium.net/

**Variable de entorno:**
```
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x.x
```

**Verificar:**
```bash
java -version  # Debe mostrar version 17.x.x
```

## Comandos para Iniciar el Proyecto

### Desarrollo Web (Navegador)

```bash
# Opción 1: Usando Ionic CLI
cd C:\Users\pronick\Documents\proyectos\kanban-tasks
ionic serve

# Opción 2: Usando npm
npm start

# Se abrirá automáticamente en http://localhost:8100
```

### Desarrollo Android

```bash
# 1. Build del proyecto web
npm run build

# 2. Sincronizar con plataforma Android
npx cap sync

# 3. Abrir en Android Studio
npx cap open android

# 4. Desde Android Studio:
#    - Seleccionar emulador o dispositivo
#    - Click en Run (▶)
```

## Estructura de Carpetas VSCode

**Configuración recomendada (.vscode/settings.json):**

El proyecto ya incluye configuración de VSCode en `.vscode/`:
- `settings.json` - Configuración del editor
- `extensions.json` - Extensiones recomendadas
- `launch.json` - Configuraciones de debug

## Scripts Disponibles (package.json)

```bash
# Servidor de desarrollo
npm start

# Build de producción
npm run build

# Build con watch
npm run watch

# Tests
npm test

# Linting
npm run lint
```

## Workflow Diario Recomendado

### Para desarrollo web:
1. Abrir terminal en VS Code
2. Ejecutar `ionic serve` o `npm start`
3. Desarrollar con hot-reload activo
4. Ver cambios en tiempo real en http://localhost:8100

### Para testing Android:
1. Hacer cambios en el código
2. `npm run build` - Compilar proyecto
3. `npx cap sync` - Sincronizar con Android
4. `npx cap open android` - Abrir Android Studio
5. Run en emulador o dispositivo

## Solución de Problemas Comunes

### "node: command not found" en WSL

Si estás usando WSL y quieres ejecutar comandos desde ahí:
```bash
# Instalar nvm en WSL
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

**Alternativa:** Usar PowerShell o CMD en Windows directamente (recomendado para proyectos en C:/)

### Error de permisos al instalar paquetes

```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Capacitor CLI no funciona

```bash
# Verificar versión de Node.js
node --version  # Debe ser >= 20.0.0

# Reinstalar Capacitor CLI localmente
npm install @capacitor/cli@latest
```

### Android Studio no detecta dispositivo

1. Habilitar opciones de desarrollador en el dispositivo Android
2. Activar "Depuración USB"
3. Conectar vía USB y aceptar la autorización
4. Verificar con `adb devices`

## Configuración Git (Opcional)

```bash
# Configurar usuario
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Ver configuración actual
git config --list
```

## Próximos Pasos

### 1. Verificar el entorno
```bash
node --version    # >= 20.0.0
npm --version     # >= 9.0.0
ionic --version   # (si instalaste Ionic CLI)
```

### 2. Probar la app en navegador
```bash
cd C:\Users\pronick\Documents\proyectos\kanban-tasks
ionic serve
```

### 3. Explorar el código
Abrir el proyecto en VS Code:
```bash
code C:\Users\pronick\Documents\proyectos\kanban-tasks
```

Archivos clave:
- `src/app/home/home.page.ts` - Componente principal
- `src/app/services/task.service.ts` - Lógica de tareas
- `src/app/models/task.model.ts` - Modelos de datos

### 4. Implementar mejoras
Ver sugerencias en `RESUMEN_PROYECTO.md` sección "Pendiente"

### 5. Crear widget Android (opcional)
Seguir la guía detallada en `WIDGET_GUIDE.md`

## Recursos de Aprendizaje

### Documentación Oficial
- [Ionic Framework](https://ionicframework.com/docs)
- [Angular](https://angular.dev/)
- [Capacitor](https://capacitorjs.com/docs)
- [Angular CDK](https://material.angular.io/cdk/categories)

### Tutoriales Recomendados
- [Ionic Angular Tutorial](https://ionicframework.com/docs/angular/overview)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Angular Drag and Drop](https://material.angular.io/cdk/drag-drop/overview)

## Checklist de Configuración

- [ ] Node.js >= 20.0.0 instalado
- [ ] npm >= 9.0.0 instalado
- [ ] Ionic CLI instalado (opcional)
- [ ] VS Code con extensiones recomendadas
- [ ] Android Studio instalado (para desarrollo móvil)
- [ ] Android SDK 33+ configurado
- [ ] JDK 17 instalado
- [ ] Variables de entorno configuradas (ANDROID_HOME, JAVA_HOME)
- [ ] Proyecto ejecutándose en navegador (`ionic serve`)
- [ ] Git configurado

## Soporte

Si encuentras problemas:
1. Revisa `README.md` para documentación completa
2. Consulta `RESUMEN_PROYECTO.md` para arquitectura del proyecto
3. Verifica que todas las dependencias estén instaladas correctamente

---

**Última actualización:** 2025-12-04
**Generado por:** Claude Code
