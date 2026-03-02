import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/auth.context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Mitr-Regular': require('../assets/font/Mitr-Regular.ttf'),
    'Mitr-Light': require('../assets/font/Mitr-Light.ttf'),
    'Mitr-ExtraLight': require('../assets/font/Mitr-ExtraLight.ttf'),
    'Mitr-Medium': require('../assets/font/Mitr-Medium.ttf'),
    'Mitr-SemiBold': require('../assets/font/Mitr-SemiBold.ttf'),
    'Mitr-Bold': require('../assets/font/Mitr-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
<AuthProvider>
  <Stack
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "transparent" }
    }}
  />
</AuthProvider>
  );
}
