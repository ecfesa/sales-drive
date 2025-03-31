import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import mockImageMap from '../mock/images';
import { Product, CartItem } from '../types';

const placeholderImage = require('../assets/placeholder_product.jpg');

type CartCardProps = {
  item: CartItem;
  product: Product;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
};

export function CartCard({ item, product, onRemove, onUpdateQuantity }: CartCardProps) {
  const { productId, quantity } = item;
  const { name, price, imagePath } = product;

  // Use local placeholder image if image doesn't exist or is still loading
  let imageSource = placeholderImage;

  if (imagePath) {
    if (imagePath.startsWith('mock/')) {
      imageSource = mockImageMap[imagePath] || placeholderImage;
    } else {
      imageSource = { uri: imagePath };
    }
  }

  const handleIncrement = () => {
    onUpdateQuantity(productId, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(productId, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(productId);
  };

  return (
    <View className="mb-2 flex-row items-stretch rounded-lg bg-white shadow-sm">
      {/* Product Image */}
      <Image
        source={imageSource}
        className="h-full w-28 rounded-l-md"
        resizeMode="cover"
        defaultSource={placeholderImage}
      />

      {/* Product Info */}
      <View className="ml-3 flex-1 justify-center">
        <View className="flex-row items-center">
          <Text className="text-base font-medium" numberOfLines={1}>
            {name}
          </Text>
          <TouchableOpacity onPress={handleRemove} className="ml-2 flex-row items-center">
            <AntDesign name="delete" size={16} color="#FF3B30" />
            <Text className="ml-1 text-xs text-[#FF3B30]">Remove</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-sm text-gray-700">${price.toFixed(2)}</Text>
          <Text className="ml-1 text-xs italic text-gray-400">x{quantity}</Text>
        </View>
      </View>

      {/* Quantity Controls */}
      <View className="my-2 mr-4 items-center">
        <TouchableOpacity
          onPress={handleIncrement}
          className="mb-1 h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <AntDesign name="plus" size={14} color="#444" />
        </TouchableOpacity>

        <Text className="my-1 text-center text-sm font-semibold">{quantity}</Text>

        <TouchableOpacity
          onPress={handleDecrement}
          className="mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <AntDesign name="minus" size={14} color="#444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
