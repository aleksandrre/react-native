import './src/i18n';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { useAuthStore } from './src/store/authStore';
import { useLanguageStore } from './src/store/languageStore';
import { MainNavigator, AuthNavigator } from './src/navigation';
import { colors } from './src/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

function AppContent() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { initLanguage } = useLanguageStore();

  useEffect(() => {
    Promise.all([checkAuth(), initLanguage()]);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={MainNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    FiraGO_300Light: require('./assets/fonts/FiraGO-Light.ttf'),
    FiraGO_400Regular: require('./assets/fonts/FiraGO-Book.ttf'),
    FiraGO_500Medium: require('./assets/fonts/FiraGO-Medium.ttf'),
    FiraGO_600SemiBold: require('./assets/fonts/FiraGO-SemiBold.ttf'),
    FiraGO_700Bold: require('./assets/fonts/FiraGO-Bold.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.dark} />
        <AppContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
