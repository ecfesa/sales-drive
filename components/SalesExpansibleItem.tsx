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
    <View className="mb-4 overflow-hidden rounded-xl border-2 border-indigo-100 bg-white shadow shadow-indigo-200">
      <TouchableOpacity
        className="bg-indigo-50 p-4"
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text className="text-lg font-bold text-black">{item.title}</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-lg font-bold text-emerald-600">
              ${item.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={!isExpanded}>
        <View className="bg-indigo-50 p-4 border-t-2 border-indigo-100">
          <Text className="text-base leading-6 text-indigo-900 opacity-90">
            {item.content}
          </Text>

          <View className="mt-3 flex-row items-center">
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default memo(SaleItem);
