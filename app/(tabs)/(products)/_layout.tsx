import { AntDesign } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useCallback, useMemo } from 'react';
import { Text, View, Pressable } from 'react-native';

import BlankHeader from '~/components/BlankHeader';
import CartButton from '~/components/CartButton';
import { ProductHeader } from '~/components/ProductHeader';
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
