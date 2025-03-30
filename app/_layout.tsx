import '../global.css';
import { Stack } from 'expo-router';

import { DatabaseProvider } from '../contexts/DatabaseContext';
import { ProductsProvider } from '../contexts/ProductsContext';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <ProductsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cart-modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="sales-modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ProductsProvider>
    </DatabaseProvider>
  );
}
