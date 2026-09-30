// iOS 27 cierra la app al abrir si no usa el ciclo de vida de UIScene, y la plantilla de Expo 57
// todavía no lo trae. Este plugin aplica el cambio en cada prebuild usando EXExpoAppSceneDelegate,
// que ya viene en Expo 57. Se puede borrar al pasar a SDK 58 (su plantilla ya lo incluye).
const { withInfoPlist, withAppDelegate } = require('expo/config-plugins');

const WINDOW_SETUP = /#if os\(iOS\) \|\| os\(tvOS\)\s*\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)[\s\S]*?#endif\n/;

const withSceneInfoPlist = (config) =>
  withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: 'EXExpoAppSceneDelegate',
          },
        ],
      },
    };
    return config;
  });

const withSceneAppDelegate = (config) =>
  withAppDelegate(config, (config) => {
    let contents = config.modResults.contents;
    if (contents.includes('ExpoReactNativeFactoryProvider')) {
      return config;
    }
    if (!contents.includes('class AppDelegate: ExpoAppDelegate {') || !WINDOW_SETUP.test(contents)) {
      throw new Error('withSceneLifecycle: el AppDelegate generado no tiene la forma esperada, revisar el plugin.');
    }
    contents = contents.replace('class AppDelegate: ExpoAppDelegate {', 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {');
    contents = contents.replace(
      WINDOW_SETUP,
      '    // The window is created and React Native is started by ExpoAppSceneDelegate (scene life cycle, required by iOS 27).\n'
    );
    config.modResults.contents = contents;
    return config;
  });

module.exports = (config) => withSceneAppDelegate(withSceneInfoPlist(config));
