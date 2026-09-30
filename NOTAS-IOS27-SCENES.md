# iOS 27: crash al abrir la app en Release (UIScene)

## Problema

En iOS 27 la app compilada en Release se cerraba apenas se abría. El crash report del iPhone mostraba:

```
EXC_BREAKPOINT (SIGTRAP)
_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption_block_invoke
```

Causa: iOS 27 exige que las apps usen el ciclo de vida de **UIScene**. La plantilla nativa de Expo 57
(incluida la más nueva, `expo-template-bare-minimum@57.0.28`) genera la app sin scenes:

- `Info.plist` sin `UIApplicationSceneManifest`.
- `AppDelegate.swift` crea la ventana a mano (`UIWindow(frame: UIScreen.main.bounds)`).

El bundle de JS no tenía nada que ver (`expo export` compila sin errores).

## Solución aplicada

Expo 57 ya incluye `ExpoAppSceneDelegate` (`node_modules/expo/ios/AppDelegates/ExpoAppSceneDelegate.swift`),
que crea la ventana y arranca React Native desde la escena. Solo hay que activarlo:

1. `ios/moviesApp/Info.plist`: se agregó `UIApplicationSceneManifest` con
   `UISceneDelegateClassName = EXExpoAppSceneDelegate`.
2. `ios/moviesApp/AppDelegate.swift`: el `AppDelegate` ahora conforma a `ExpoReactNativeFactoryProvider`
   y ya no crea la ventana ni llama a `startReactNative`.

Como `npx expo prebuild --clean` regenera la carpeta `ios` y borra esos cambios, se agregó el config plugin
`plugins/withSceneLifecycle.js` (registrado en `app.json`) que los vuelve a aplicar en cada prebuild.
Si el `AppDelegate` generado no tiene la forma esperada, el prebuild falla con un error en vez de dejar
la app con el crash.

**Pendiente:** el plugin todavía no se ha probado corriendo `npx expo prebuild --clean --platform ios`.

## Al pasar a Expo SDK 58

La plantilla de SDK 58 (`expo-template-bare-minimum@58.0.8`) ya trae soporte para scenes
(`SceneDelegate.swift` + `UIApplicationSceneManifest`). Al actualizar:

1. Borrar `plugins/withSceneLifecycle.js`.
2. Quitar `"./plugins/withSceneLifecycle"` de `plugins` en `app.json`.
3. Correr `npx expo prebuild --clean` y confirmar que el `Info.plist` tenga `UIApplicationSceneManifest`.

## Cómo ver crash reports del iPhone desde la terminal

```sh
xcrun devicectl list devices
xcrun devicectl device copy from --device <UDID> --domain-type systemCrashLogs --source / --destination ./crash
```

Los archivos `moviesApp-*.ips` son los de la app.
