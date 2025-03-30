import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SectionList, Text, View, FlatList, SafeAreaView, RefreshControl } from 'react-native';

import { ProductCard } from '~/components/ProductCard';
import { useProducts } from '~/contexts/ProductsContext';
import { Product } from '~/types/types';

export default function Home() {
  const router = useRouter();
  const { editMode, productsByCategory, loading, deleteProduct, refresh } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // This render each product card
  const renderProduct = ({ item }: { item: Product }) => (
    <View className="m-1 w-[48%]">
      <ProductCard
        id={item.id.toString()}
        name={item.name}
        price={item.price}
        image={item.imagePath}
        onPressCard={() => handlePressProduct(item)}
        onPressButton={() => handleProductButtonPress(item)}
        editMode={editMode}
      />
    </View>
  );

  const handlePressProduct = (product: Product) => {
    router.push(`/id/${product.id.toString()}`);
  };

  const addToCart = (product: Product) => {
    console.log('Add to cart:', product.id);
  };

  const handleProductButtonPress = (product: Product) => {
    if (editMode) {
      console.log('Delete product:', product.id);
      deleteProduct(product.id);
    } else {
      addToCart(product);
    }
  };

  // Show loading state if data is still being fetched
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-4xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <SectionList
        className="flex-1 p-4"
        contentContainerClassName="gap-2.5"
        sections={productsByCategory}
        keyExtractor={(item) => item[0]?.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <FlatList
            data={item}
            renderItem={renderProduct}
            keyExtractor={(product) => product.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerClassName="pb-2.5"
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="mb-1 mt-1 rounded-lg border border-dashed border-blue-500 bg-blue-100 p-2.5 text-center text-4xl font-bold">
            {title}
          </Text>
        )}
        ListFooterComponent={() => (
          <Text className="mb-4 mt-6 text-center italic text-gray-500">
            You have reached the end :)
          </Text>
        )}
      />
    </SafeAreaView>
  );
}
