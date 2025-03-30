import { AntDesign } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';

import BlankHeader from '~/components/BlankHeader';
import CartButton from '~/components/CartButton';
import { ProductsProvider, useProducts } from '~/contexts/ProductsContext';
import { useSalesDrive } from '~/contexts/SalesDriveContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

function Header() {
  const { editMode, toggleEditMode, setEditMode } = useProducts();
  const { isAdminMode, adminClickReceived } = useSalesDrive();

  // Turn off edit mode whenever admin mode is disabled
  useEffect(() => {
    if (!isAdminMode) {
      setEditMode(false);
    }
  }, [isAdminMode, setEditMode]);

  const handleTitlePress = () => {
    adminClickReceived();
  };

  return (
    <ProductsProvider>
      <BlankHeader>
        <View className="flex-row items-center gap-2">
          {router.canGoBack() && (
            <Pressable onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
          )}
          <View className="flex-row items-center">
            <Pressable onPress={handleTitlePress}>
              <Text className="text-2xl">Products</Text>
            </Pressable>
            {isAdminMode && (
              <Pressable
                onPress={toggleEditMode}
                className="ml-2 w-36 flex-row items-center gap-1 px-2 py-1">
                <AntDesign name="edit" size={16} color={editMode ? 'blue' : 'black'} />
                <Text className={editMode ? 'text-blue-500' : 'text-black'}>
                  {editMode ? 'Currently Editing' : 'Edit'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <CartButton itemCount={2} onPress={() => router.push('/cart')} />
      </BlankHeader>
    </ProductsProvider>
  );
}

export default function ProductsLayout() {
  return (
    <ProductsProvider>
      <Stack
        screenOptions={{
          header: () => <Header />,
        }}>
        <Stack.Screen name="index" options={{ title: 'Products' }} />
        <Stack.Screen name="id/[productId]" options={{ title: 'Product' }} />
        <Stack.Screen name="cart" options={{ title: 'Cart' }} />
      </Stack>
    </ProductsProvider>
  );
}
