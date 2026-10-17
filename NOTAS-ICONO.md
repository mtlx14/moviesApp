# Ícono de la app: Liquid Glass (iOS 26+)

## Estado actual

La app usa el ícono hecho en **Icon Composer**: `ios/moviesApp/moviesApp.icon`.

- En Xcode está agregado como recurso del target y `ASSETCATALOG_COMPILER_APPICON_NAME = moviesApp`
  (Debug y Release, en `project.pbxproj`).
- En iOS 26+ se ve con Liquid Glass; en iOS anteriores Xcode genera solo una versión plana desde el mismo `.icon`.
- El original editable está en `~/Desktop/moviesApp.icon`. Si se edita, volver a copiarlo a `ios/moviesApp/`.
- Tiene capas ocultas (`movies-top 2`, `movies-strips 3`, `movies-bg2`) que no se dibujan.

**Pendiente:** `app.json` todavía apunta a `./assets/icon.png`. Si se corre `expo prebuild`, se pierde el `.icon`
y vuelve el PNG. Para dejarlo permanente: copiar el `.icon` a `assets/` y poner `"ios": { "icon": "./assets/moviesApp.icon" }`.

## Respaldo: ícono anterior sin glass

Popcorn rosado con borde blanco tipo sticker, fondo degradado rosado claro, 1024×1024 PNG.

- `assets/icon.png` (el que usa `app.json`)
- `assets/icono-backup/icon-sin-glass-1024.png` (copia)
- `assets/icono-backup/AppIcon.appiconset/` (copia del set de Xcode)
- `ios/moviesApp/Images.xcassets/AppIcon.appiconset/` sigue en el proyecto, sin borrar.

### Volver al ícono anterior

1. Xcode → Target **moviesApp** → General → App Icons → cambiar `moviesApp` por `AppIcon`
   (o en `project.pbxproj`: `ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;` en los dos lugares).
2. Si `AppIcon.appiconset` ya no está en `Images.xcassets`, copiarlo desde `assets/icono-backup/`.
3. Clean Build Folder (⇧⌘K) y reinstalar la app (iOS cachea el ícono).
