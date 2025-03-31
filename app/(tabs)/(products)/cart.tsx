import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { CartCard } from '~/components/CartCard';
import { useProducts } from '~/contexts/ProductsContext';
import { useSalesDrive } from '~/contexts/SalesDriveContext';

export default function Cart() {
  const { cart, removeFromCart, addToCart, removeOneFromCart, clearCart, confirmPurchase } =
    useProducts();
  const { products } = useSalesDrive();
  const router = useRouter();

  // Find product details for each cart item
  const getProductById = useCallback(
    (productId: number) => {
      return products.find((product) => product.id === productId);
    },
    [products]
  );

  // Handle removing a product from cart
  const handleRemoveFromCart = (productId: number) => {
    const product = getProductById(productId);
    if (product) {
      removeFromCart(product);
    }
  };

  // Handle updating the quantity of a product in cart
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    const product = getProductById(productId);
    if (!product) return;

    // Get current quantity
    const cartItem = cart.items.find((item) => item.productId === productId);
    const currentQuantity = cartItem?.quantity || 0;

    if (newQuantity > currentQuantity) {
      // Add to cart
      addToCart(product);
    } else if (newQuantity < currentQuantity) {
      // Remove one from cart
      removeOneFromCart(product);
    }
  };

  // Handle purchase confirmation
  const handleConfirmPurchase = () => {
    confirmPurchase();
    // Clear cart
    clearCart();
    // Alert user
    Alert.alert(
      'Purchase confirmed',
      'Your purchase has been confirmed with a total of $' + totalPrice.toFixed(2),
      [
        {
          text: 'Go to sales',
          onPress: () => router.navigate('/(tabs)/(sales)'),
        },
        {
          text: 'Go to products',
          onPress: () => router.replace('/', { withAnchor: true }),
        },
      ]
    );
  };

  // Calculate total price of all items in cart
  const totalPrice = cart.items.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  // Sort cart items alphabetically by product name
  const sortedCartItems = useMemo(() => {
    return [...cart.items].sort((a, b) => {
      const productA = getProductById(a.productId);
      const productB = getProductById(b.productId);

      if (!productA?.name) return 1;
      if (!productB?.name) return -1;

      return productA.name.localeCompare(productB.name);
    });
  }, [cart.items, getProductById]);

  // Check if cart is empty
  const isCartEmpty = cart.items.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
          <Text className="text-xl font-bold">Your Cart</Text>
          {!isCartEmpty && (
            <TouchableOpacity onPress={clearCart} className="flex-row items-center">
              <AntDesign name="delete" size={16} color="#FF3B30" />
              <Text className="ml-1 text-[#FF3B30]">Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {isCartEmpty ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-lg text-gray-500">Your cart is empty</Text>
          </View>
        ) : (
          <ScrollView className="flex-1 p-4">
            {sortedCartItems.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <View key={item.productId} className="mb-8 h-24">
                  <CartCard
                    item={item}
                    product={product}
                    onRemove={handleRemoveFromCart}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}

        {!isCartEmpty && (
          <View className="p-4">
            <TouchableOpacity
              onPress={handleConfirmPurchase}
              className="flex-row items-center justify-center rounded-lg bg-green-600 py-4">
              <Text className="mr-2 text-center text-2xl font-bold text-white">
                Confirm Purchase
              </Text>
              <Text className="font-bold text-white">${totalPrice.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
