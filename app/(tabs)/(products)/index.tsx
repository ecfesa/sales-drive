import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  SectionList,
  Text,
  View,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Pressable,
} from 'react-native';

import OptionSelector from '~/components/OptionSelector';
import { ProductCard } from '~/components/ProductCard';
import { useProducts } from '~/contexts/ProductsContext';
import { useSalesDrive } from '~/contexts/SalesDriveContext';
import { Product } from '~/types';

// Define the section type for clarity
type ProductSection = {
  title: string;
  data: Product[][];
};

export default function Products() {
  const router = useRouter();
  const { editMode, addToCart } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const { products, loading: initialLoading, deleteProduct, reloadProducts } = useSalesDrive();
  const [productsByCategory, setProductsByCategory] = useState<ProductSection[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const onRefresh = async () => {
    setRefreshing(true);
    await reloadProducts();
    setRefreshing(false);
  };

  // Compute products by category
  useEffect(() => {
    const groupedProducts = products.reduce(
      (acc, product) => {
        const categoryName = product.category.name;
        acc[categoryName] = [...(acc[categoryName] || []), product];
        return acc;
      },
      {} as Record<string, Product[]>
    );

    // Transform into array format for SectionList
    const sections = Object.entries(groupedProducts).map(([title, data]) => ({
      title,
      data: [data], // Wrap in array for our FlatList rendering approach
    }));

    // Sort sections alphabetically with "Uncategorized" at the top
    sections.sort((a, b) => {
      if (a.title === 'Uncategorized') return -1;
      if (b.title === 'Uncategorized') return 1;
      return a.title.localeCompare(b.title);
    });

    setProductsByCategory(sections);
    setCategories(Object.keys(groupedProducts));
  }, [products]);

  // This renders each product card
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

  const handleProductButtonPress = (product: Product) => {
    if (editMode) {
      deleteProduct(product);
    } else {
      addToCart(product);
    }
  };

  const handleCreateFirstProduct = () => {
    router.push('/new');
  };

  // Show "Create first product" button when no products exist
  if (products.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-4">
        <Text className="mb-6 text-center text-2xl">No products found</Text>
        <Pressable
          onPress={handleCreateFirstProduct}
          className="flex-row items-center gap-2 rounded-full border-2 border-green-600 bg-green-100 px-5 py-3 transition-opacity active:opacity-50">
          <AntDesign name="plus" size={20} color="green" />
          <Text className="text-lg font-medium text-green-700">Create first product</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Show loading state if data is still being fetched
  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-4xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <OptionSelector
        options={categories.map((category) => ({ label: category, value: category }))}
        selectedValues={selectedCategories}
        onChange={setSelectedCategories}
        placeholder="Select categories"
        searchPlaceholder="Search categories"
      />
      <SectionList
        className="flex-1 p-4"
        contentContainerClassName="gap-2.5"
        sections={productsByCategory.filter(
          (section) => selectedCategories.length === 0 || selectedCategories.includes(section.title)
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <FlatList
            data={item}
            renderItem={renderProduct}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerClassName="pb-2.5"
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text className="mb-1 mt-1 rounded-lg border border-dashed border-blue-500 bg-blue-100 p-2.5 text-center text-4xl font-bold">
            {section.title}
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
