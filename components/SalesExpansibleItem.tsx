import { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Collapsible from 'react-native-collapsible';

interface SaleExpansibleItemType {
  title: string;
  total: number;
  content: string;
}

interface SaleItemProps {
  item: SaleExpansibleItemType;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const SaleItem: React.FC<SaleItemProps> = ({
  item,
  index,
  isExpanded,
  onToggle,
}) => {
  const handlePress = () => {
    onToggle(index);
  };

  return (
    <View className="mb-4 overflow-hidden rounded-xl border-2 border-amber-100 bg-white shadow-sm shadow-amber-200">
  <TouchableOpacity
    className="bg-amber-50 p-4"
    onPress={handlePress}
    activeOpacity={0.9}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        {/* Sale Icon */}
        <View className="mr-3 bg-amber-500 rounded-full p-1">
          <Text className="text-white text-xs font-bold px-1">SALE</Text>
        </View>

        <Text className="text-lg font-bold text-amber-900">{item.title}</Text>
      </View>

      <View className="flex-row items-center">
        {/* Quantity Badge */}
        <View className="bg-amber-100 rounded-full px-2 py-1 mr-3">
          <Text className="text-xs font-semibold text-amber-800">
            {item.quantity}x
          </Text>
        </View>

        {/* Total Price */}
        <Text className="text-lg font-bold text-amber-600">
          ${item.total.toFixed(2)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>

  <Collapsible collapsed={!isExpanded}>
    <View className="bg-amber-50 p-4 border-t-2 border-amber-100">
      <Text className="text-base leading-6 text-amber-900 opacity-90">
        {item.content}
      </Text>

      {/* Additional bakery details */}
      <View className="mt-3 flex-row items-center">
        <View className="bg-amber-200 rounded-full p-1 mr-2">
          {/* Replace with your actual icon component */}
          <Text className="text-amber-800">🍞</Text>
        </View>
        <Text className="text-sm text-amber-700">
          Freshly baked | {item.category}
        </Text>
      </View>
    </View>
  </Collapsible>
</View>
  );
};

export default memo(SaleItem);
