# Inicio Rápido

## Problema Actual

Tu versión de Node.js (v16.20.2) es incompatible con este proyecto. Necesitas Node.js >= 20.0.0.

## Solución Rápida

### 1. Actualizar Node.js

```bash
# Opción A: Usando nvm (Recomendado)
nvm install 20
nvm use 20
nvm alias default 20

# Opción B: Descarga desde https://nodejs.org/
```

### 2. Verificar la instalación

```bash
node --version  # Debe mostrar v20.x.x o superior
```

### 3. Probar la aplicación en el navegador

```bash
cd kanban-tasks
ionic serve
```

Abre tu navegador en http://localhost:8100

### 4. Añadir plataforma Android (después de actualizar Node.js)

```bash
npx cap add android
npx cap sync
npx cap open android
```

## Archivos Importantes

- `README.md` - Documentación completa del proyecto
- `WIDGET_GUIDE.md` - Guía detallada para crear el widget de Android
- `src/app/models/task.model.ts` - Modelos de datos
- `src/app/services/task.service.ts` - Lógica de tareas
- `src/app/services/notification.service.ts` - Lógica de notificaciones
- `src/app/home/` - Componente principal del Kanban

## Características Implementadas

✅ Tablero Kanban con 3 columnas
✅ Drag & Drop entre columnas
✅ Persistencia local de datos
✅ Notificaciones locales
✅ Sistema de prioridades
✅ Diseño responsive

## Próximos Pasos

1. Actualiza Node.js a v20+
2. Ejecuta `ionic serve` para probar la app
3. Añade la plataforma Android con `npx cap add android`
4. Sigue la guía `WIDGET_GUIDE.md` para crear el widget nativo
5. Genera el APK desde Android Studio

## Soporte

Si tienes problemas:
- Revisa `README.md` para troubleshooting
- Verifica que tengas las herramientas necesarias instaladas
- Asegúrate de que Node.js esté actualizado

---

Proyecto creado con Ionic + Angular + Capacitor
