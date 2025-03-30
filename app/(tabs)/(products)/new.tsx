import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { useSalesDrive } from '~/contexts/SalesDriveContext';
import { Product } from '~/types';

export default function NewProduct() {
  const { reloadProducts, getOrCreateCategory, newProduct } = useSalesDrive();
  const router = useRouter();

  useEffect(() => {
    const createNewProduct = async () => {
      // Set a default category
      const category = await getOrCreateCategory('Uncategorized');

      try {
        const defaultProduct: Product = {
          id: 0,
          name: 'New Product',
          price: 9.99,
          imagePath: 'mock/placeholder',
          description: 'Product description goes here.',
          category,
        };

        // Create the product
        const newProductId = await newProduct(defaultProduct);

        // Reload products to update the context
        await reloadProducts();

        // Redirect to product details page
        router.replace(`/id/${newProductId}`);
      } catch (error) {
        console.error('Error creating product:', error);
        // Redirect back to products page if there's an error
        router.replace('/');
      }
    };

    // Create the product when component mounts
    createNewProduct();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Creating new product...</Text>
    </View>
  );
}
