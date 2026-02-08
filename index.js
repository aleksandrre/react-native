import { registerRootComponent } from 'expo';

import App from './App';

// Workaround for a Fabric (new architecture) crash where RNSScreen receives a string
// for a boolean prop and throws: "expected dynamic type 'boolean', but had type 'string'".
//
// IMPORTANT: React Navigation's bottom-tabs uses `require('react-native-screens')` internally.
// Using ESM `import { enableScreens } ...` can load a different build/instance, so the flag
// may not apply. We intentionally use `require` here to target the same module instance.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Screens = require('react-native-screens');
  Screens?.enableScreens?.(false);
  Screens?.enableFreeze?.(false);
  if (__DEV__) {
    // Helps confirm the workaround is active.
    // eslint-disable-next-line no-console
    console.log('[react-native-screens] screensEnabled =', Screens?.screensEnabled?.());
  }
} catch {
  // ignore
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
