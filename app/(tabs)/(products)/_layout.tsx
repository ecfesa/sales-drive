import { AntDesign } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';

import BlankHeader from '~/components/BlankHeader';
import CartButton from '~/components/CartButton';
import { ProductsProvider, useProducts } from '~/contexts/ProductsContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

function Header() {
  const { editMode, toggleEditMode, isAdminMode, setAdminMode } = useProducts();
  const [clicks, setClicks] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTitlePress = () => {
    const newClickCount = clicks + 1;

    // Reset the timeout on each click
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // Set timeout to reset clicks if not clicked again quickly
    clickTimerRef.current = setTimeout(() => {
      setClicks(0);
    }, 500);

    if (newClickCount >= 5) {
      const newAdminMode = !isAdminMode;
      setAdminMode(newAdminMode);

      if (editMode && !newAdminMode) {
        toggleEditMode();
      }

      // Show toast message
      if (newAdminMode) {
        Alert.alert('You are now an admin!', 'You can now edit the products', [
          { text: 'Nice!', onPress: () => {} },
        ]);
      } else {
        Alert.alert('Disabled admin mode', 'You can no longer edit the products', [
          { text: 'OK', onPress: () => {} },
        ]);
      }

      setClicks(0);

      // Clear the timeout as I already handled the clicks
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
    } else {
      // Update click count for clicks < 5
      setClicks(newClickCount);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return (
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
