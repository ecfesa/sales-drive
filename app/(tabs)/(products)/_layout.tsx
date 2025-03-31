import { Stack } from 'expo-router';

import ProductHeader from '~/components/ProductHeader';
import { ProductsProvider } from '~/contexts/ProductsContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function ProductsLayout() {
  return (
    <ProductsProvider>
      <Stack
        screenOptions={{
          header: () => <ProductHeader />,
        }}>
        <Stack.Screen name="index" options={{ title: 'Products' }} />
        <Stack.Screen name="id/[productId]" options={{ title: 'Product' }} />
        <Stack.Screen name="cart" options={{ title: 'Cart' }} />
      </Stack>
    </ProductsProvider>
  );
}
