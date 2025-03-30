import { useRouter } from 'expo-router';
import { useEffect , useState } from 'react';
import { SectionList, Text, View, FlatList, SafeAreaView } from 'react-native';

import { ProductCard } from '~/components/ProductCard';
import { useDatabase } from '~/contexts/DatabaseContext';
import { useProducts } from '~/contexts/ProductsContext';
import { Category, Product } from '~/types/types';

export default function Home() {
  const router = useRouter();
  const { editMode } = useProducts();
  const { products: productsRepository, categories: categoriesRepository } = useDatabase();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await productsRepository.getAll();
      setProducts(products);
    };

    const fetchCategories = async () => {
      const categories = await categoriesRepository.getAll();
      setCategories(categories);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Group products by category
  const productsByCategory = categories.map((category) => {
    return {
      title: category.name,
      data: [products.filter((product) => product.category.id === category.id)],
    };
  });

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
    } else {
      addToCart(product);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SectionList
        className="flex-1 p-4"
        contentContainerClassName="gap-2.5"
        sections={productsByCategory}
        keyExtractor={(item) => item[0].id.toString()}
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
