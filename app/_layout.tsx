import '../global.css';

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* <Stack.Screen name="home/index" options={{ headerShown: false }} /> */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1b1a1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        name="settings/index"
      />
      <Stack.Screen
        name="settings/models"
        options={{
          title: 'Models',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1b1a1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="settings/history"
        options={{
          title: 'Chat History',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1b1a1b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
