import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreenView from './Components/SplashScreenView'; // Import your custom splash screen

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isSplashVisible, setSplashVisible] = useState(true); // State to manage splash visibility

  // Hide splash after 3 seconds (adjust as necessary)
  useEffect(() => {
    const hideSplash = setTimeout(() => {
      setSplashVisible(false);
    }, 3000); // Display splash for 3 seconds (adjust timing here)

    return () => clearTimeout(hideSplash); // Clean up timer on unmount
  }, []);

  useEffect(() => {
    // Listener for receiving notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received!', notification);
    });

    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access notifications is required!');
      }
    };

    requestPermissions(); // Request notification permissions

    return () => subscription.remove(); // Clean up on unmount
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // If fonts are not loaded or splash is visible, show the splash screen
  if (!loaded || isSplashVisible) {
    return <SplashScreenView />; // Render your custom splash screen here
  }

  // Otherwise, render the main layout with the navigation stack
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
