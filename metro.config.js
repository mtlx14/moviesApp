// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Firebase 10 se rompe con "package exports": firebase/auth termina usando otra copia de
// @firebase/app ("Component auth has not been registered yet"). Se desactiva solo para Firebase.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('firebase/') || moduleName.startsWith('@firebase/')) {
    return context.resolveRequest({ ...context, unstable_enablePackageExports: false }, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
