import { registerRootComponent } from 'expo';
import * as Screens from 'react-native-screens';

import App from './App';

// Workaround for a Fabric (new architecture) crash where RNSScreen receives a string
// for a boolean prop and throws: "expected dynamic type 'boolean', but had type 'string'".
try {
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
