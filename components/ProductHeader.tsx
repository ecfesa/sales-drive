import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useCallback, useMemo } from 'react';
import { Text, View, Pressable } from 'react-native';

import BlankHeader from '~/components/BlankHeader';
import CartButton from '~/components/CartButton';
import { useProducts } from '~/contexts/ProductsContext';
import { useSalesDrive } from '~/contexts/SalesDriveContext';

const ProductHeader = React.memo(() => {
  const { editMode, toggleEditMode, setEditMode, getCartItemCount } = useProducts();
  const { isAdminMode, adminClickReceived, products } = useSalesDrive();

  // Turn off edit mode whenever admin mode is disabled
  useEffect(() => {
    if (!isAdminMode) {
      setEditMode(false);
    }
  }, [isAdminMode, setEditMode]);

  // Memoize callback functions
  // This improves performance by preventing the variables from being recreated on every render
  const handleTitlePress = useCallback(() => {
    adminClickReceived();
  }, [adminClickReceived]);

  const handleAddProduct = useCallback(() => {
    router.push('/new');
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleCartPress = useCallback(() => {
    router.push('/cart');
  }, []);

  // Memoize derived values
  const hasProducts = useMemo(() => products.length > 0, [products]);
  const cartItemCount = useMemo(() => getCartItemCount(), [getCartItemCount]);

  return (
    <BlankHeader>
      <View className="flex-row items-center gap-2">
        {router.canGoBack() && (
          <Pressable onPress={handleBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
        )}
        <View className="flex-row items-center">
          <Pressable onPress={handleTitlePress}>
            <Text className="text-2xl">Products</Text>
          </Pressable>
          {isAdminMode && hasProducts && (
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

      {editMode ? (
        <Pressable
          onPress={handleAddProduct}
          className="flex-row items-center gap-2 rounded-full border-2 border-green-600 bg-green-100 px-3 py-1 transition-opacity active:opacity-50">
          <AntDesign name="plus" size={16} color="green" />
          <Text className="font-medium text-green-700">Add Product</Text>
        </Pressable>
      ) : (
        <CartButton itemCount={cartItemCount} onPress={handleCartPress} />
      )}
    </BlankHeader>
  );
});

export default ProductHeader;
