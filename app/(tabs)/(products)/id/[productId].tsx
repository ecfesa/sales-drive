import { AntDesign } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';

import products from '../../../../mock/products';
import { Product } from '../../../../types/types';

import { useProducts } from '~/contexts/ProductsContext';

const placeholderImage = require('../../../../assets/placeholder_product.jpg');

export default function ProductDetail() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { editMode } = useProducts();

  useEffect(() => {
    // Find the product in the mock data
    if (productId) {
      const foundProduct = products.find((p) => p.id === Number(productId));
      setProduct(foundProduct || null);
    }
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-4xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    // Redirect to the products page if the product is not found
    // Happens when the product gets deleted
    return <Redirect href="../products" withAnchor />;
  }

  const imagePath = product.imagePath !== '' ? product.imagePath : placeholderImage;

  const addToCart = () => {
    console.log('Add to cart');
  };

  const editProduct = () => {
    console.log('Edit product:', product?.id);
  };

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Product Image - top half */}
          <View className="h-1/2 w-full">
            <Image source={imagePath} className="h-full w-full" resizeMode="cover" />
            {editMode && (
              <TouchableOpacity
                className="absolute right-4 top-4 rounded-full bg-blue-500 p-2"
                onPress={() => console.log('Edit image')}>
                <AntDesign name="edit" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Product Info */}
          <View className="p-4">
            {/* Title and Price card*/}
            <View className="mb-4 h-32 flex-row items-stretch">
              <View className="flex flex-1 flex-col items-stretch rounded-l-xl border border-blue-300 bg-blue-50 p-4">
                <Text
                  className="flex-1 text-2xl font-bold text-blue-800"
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  maxFontSizeMultiplier={2}
                  minimumFontScale={0.3}>
                  {product.name}
                  {editMode && (
                    <TouchableOpacity onPress={() => console.log('Edit name')}>
                      <AntDesign name="edit" size={16} color="#1e40af" />
                    </TouchableOpacity>
                  )}
                </Text>
                <Text className="mt-1 text-2xl font-semibold text-green-700">
                  ${product.price.toFixed(2)}
                  {editMode && (
                    <TouchableOpacity onPress={() => console.log('Edit price')}>
                      <AntDesign name="edit" size={16} color="#047857" />
                    </TouchableOpacity>
                  )}
                </Text>
              </View>
              <TouchableOpacity
                // Button gets disabled when edit mode is on
                className="w-32 justify-center rounded-r-xl border-b border-r border-t border-blue-300 bg-blue-100 disabled:opacity-50"
                onPress={editMode ? editProduct : addToCart}
                disabled={editMode}>
                {editMode ? (
                  <AntDesign
                    name="edit"
                    size={40}
                    color="#1e40af"
                    style={{ alignSelf: 'center' }}
                  />
                ) : (
                  <FontAwesome
                    name="shopping-cart"
                    size={40}
                    color="#1e40af"
                    style={{ alignSelf: 'center' }}
                  />
                )}
              </TouchableOpacity>
            </View>
            {/* Description with scrolling */}
            <Text className="mb-2 border-b border-gray-300 text-lg font-medium">
              Product Description
              {editMode && (
                <TouchableOpacity onPress={() => console.log('Edit description')}>
                  <AntDesign name="edit" size={16} color="#4b5563" />
                </TouchableOpacity>
              )}
            </Text>
            <ScrollView className="max-h-60">
              <Text className="text-base text-gray-700">{product.description}</Text>

              {/* Category info */}
              <View className="mb-2 mt-4">
                <Text className="text-sm font-medium text-gray-500">
                  Category: {product.category.name}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
