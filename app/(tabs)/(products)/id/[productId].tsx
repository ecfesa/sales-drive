import { AntDesign } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import CategorySelectModal from '../../../../components/CategorySelectModal';
import DescriptionEditModal from '../../../../components/DescriptionEditModal';
import mockImageMap from '../../../../mock/images';
import { Product, Category } from '../../../../types/types';

import { useDatabase } from '~/contexts/DatabaseContext';
import { useProducts } from '~/contexts/ProductsContext';

const placeholderImage = require('../../../../assets/placeholder_product.jpg');

export default function ProductDetail() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const {
    editMode,
    loading,
    updateProduct,
    deleteProduct,
    categories,
    products,
    refreshCategories,
  } = useProducts();

  const { categories: categoriesRepository } = useDatabase();

  let product: Product | null = null;

  // Get product from state
  if (productId) {
    product = products.find((p) => p.id === Number(productId)) || null;
  }

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
    return <Redirect href="../" withAnchor />;
  }

  // Determine image source using mock image logic
  let imageSource = placeholderImage;
  if (product.imagePath) {
    if (product.imagePath.startsWith('mock/')) {
      imageSource = mockImageMap[product.imagePath] || placeholderImage;
    } else {
      imageSource = { uri: product.imagePath };
    }
  }

  const addToCart = () => {};

  const handleDeleteProduct = () => {
    if (product) {
      deleteProduct(product.id);
    }
  };

  const saveProductName = () => {
    if (product) {
      // Update the product
      const updatedProduct = { ...product, name: editedName };
      updateProduct(updatedProduct);
      setIsEditingName(false);
    }
  };

  const saveProductPrice = () => {
    if (product) {
      const numericPrice = parseFloat(editedPrice);
      if (!isNaN(numericPrice)) {
        // Update the product
        const updatedProduct = { ...product, price: numericPrice };
        updateProduct(updatedProduct);
      }
      setIsEditingPrice(false);
    }
  };

  const saveProductDescription = (newDescription: string) => {
    if (product) {
      // Update the product
      const updatedProduct = { ...product, description: newDescription };
      updateProduct(updatedProduct);
      setIsEditingDescription(false);
    }
  };

  const saveProductCategory = async (categoryOrName: Category | string) => {
    if (product) {
      try {
        let updatedProduct: Product;

        if (typeof categoryOrName === 'string') {
          // Use the create category function from the database context
          const newCategoryId = await categoriesRepository.create(categoryOrName);

          // Refresh categories from the database to update the state
          await refreshCategories();

          const newCategory: Category = {
            id: newCategoryId,
            name: categoryOrName,
          };

          // Create updated product object
          updatedProduct = {
            ...product,
            category: newCategory,
          };
        } else {
          // Create updated product object with existing category
          updatedProduct = {
            ...product,
            category: categoryOrName,
          };
        }

        await updateProduct(updatedProduct);
        setIsEditingCategory(false);
      } catch (error) {
        console.error('Error updating product category:', error);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: product?.name || 'Product' }} />
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Product Image - top half */}
          <View className="h-1/2 w-full">
            <Image source={imageSource} className="h-full w-full" resizeMode="cover" />
            {editMode && (
              <TouchableOpacity
                className="absolute inset-0 flex items-center justify-center"
                onPress={() => console.log('Edit image')}>
                <View className="absolute right-4 top-4 rounded-full bg-blue-500 p-2">
                  <AntDesign name="edit" size={20} color="white" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Category Bar */}
          <View className="h-8 w-full items-center justify-center border-y border-blue-200 bg-blue-100">
            {editMode ? (
              <TouchableOpacity onPress={() => setIsEditingCategory(true)}>
                <Text className="text-sm font-medium text-blue-800">
                  {product.category.name}
                  <View style={{ position: 'relative' }}>
                    <AntDesign name="edit" size={14} color="#1e40af" />
                  </View>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-sm font-medium text-blue-800">{product.category.name}</Text>
            )}
          </View>

          {/* Category Modal */}
          <CategorySelectModal
            visible={isEditingCategory}
            categories={categories}
            initialCategory={product?.category}
            onClose={() => setIsEditingCategory(false)}
            onSave={saveProductCategory}
          />

          {/* Product Info */}
          <View className="p-4">
            {/* Title and Price card*/}
            <View className="mb-4 h-32 flex-row items-stretch">
              <View className="flex flex-1 flex-col items-stretch rounded-l-xl border border-blue-300 bg-blue-50 p-4">
                {editMode ? (
                  isEditingName ? (
                    <TextInput
                      className="flex-1 text-2xl font-bold text-blue-800"
                      value={editedName}
                      onChangeText={setEditedName}
                      autoFocus
                      onSubmitEditing={saveProductName}
                      submitBehavior="blurAndSubmit"
                    />
                  ) : (
                    <TouchableOpacity
                      className="relative flex-1"
                      onPress={() => {
                        setEditedName(product.name);
                        setIsEditingName(true);
                      }}>
                      <Text
                        className="flex-1 text-2xl font-bold text-blue-800"
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        maxFontSizeMultiplier={2}
                        minimumFontScale={0.3}>
                        {product.name}
                        <View style={{ position: 'relative' }}>
                          <AntDesign name="edit" size={16} color="#1e40af" />
                        </View>
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <Text
                    className="flex-1 text-2xl font-bold text-blue-800"
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    maxFontSizeMultiplier={2}
                    minimumFontScale={0.3}>
                    {product.name}
                  </Text>
                )}

                {editMode ? (
                  isEditingPrice ? (
                    <View className="mt-1 flex-row items-center">
                      <Text className="text-2xl font-semibold text-green-700">$</Text>
                      <TextInput
                        className="flex-1 text-2xl font-semibold text-green-700"
                        value={editedPrice}
                        onChangeText={setEditedPrice}
                        keyboardType="decimal-pad"
                        autoFocus
                        onSubmitEditing={saveProductPrice}
                        submitBehavior="blurAndSubmit"
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setEditedPrice(product.price.toFixed(2));
                        setIsEditingPrice(true);
                      }}>
                      <Text className="mt-1 text-2xl font-semibold text-green-700">
                        ${product.price.toFixed(2)}
                        <View style={{ position: 'relative' }}>
                          <AntDesign name="edit" size={16} color="#047857" />
                        </View>
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <Text className="mt-1 text-2xl font-semibold text-green-700">
                    ${product.price.toFixed(2)}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                // Button gets disabled when edit mode is on
                className={`w-32 justify-center rounded-r-xl border-b border-r border-t ${
                  editMode ? 'border-red-300 bg-red-100' : 'border-blue-300 bg-blue-100'
                }`}
                onPress={editMode ? handleDeleteProduct : addToCart}
                disabled={false}>
                {editMode ? (
                  <AntDesign
                    name="delete"
                    size={40}
                    color="#b91c1c"
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
            <DescriptionEditModal
              visible={isEditingDescription}
              initialDescription={product.description}
              onClose={() => setIsEditingDescription(false)}
              onSave={saveProductDescription}
            />

            {editMode ? (
              <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                <Text className="mb-2 border-b border-gray-300 text-lg font-medium">
                  Product Description
                  <View style={{ position: 'relative' }}>
                    <AntDesign name="edit" size={16} color="#4b5563" />
                  </View>
                </Text>
                <ScrollView className="max-h-60">
                  <Text className="text-base text-gray-700">{product.description}</Text>
                </ScrollView>
              </TouchableOpacity>
            ) : (
              <>
                <Text className="mb-2 border-b border-gray-300 text-lg font-medium">
                  Product Description
                </Text>
                <ScrollView className="max-h-60">
                  <Text className="text-base text-gray-700">{product.description}</Text>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
