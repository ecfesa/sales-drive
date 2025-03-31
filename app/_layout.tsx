import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SalesDriveProvider } from '~/contexts/SalesDriveContext';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SalesDriveProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cart-modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="sales-modal" options={{ presentation: 'modal' }} />
        </Stack>
      </SalesDriveProvider>
    </GestureHandlerRootView>
  );
}
