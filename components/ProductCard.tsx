import { AntDesign } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Button } from './Button';
import mockImageMap from '../mock/images';

const placeholderImage = require('../assets/placeholder_product.jpg');

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image?: string;
  editMode?: boolean;
  onPressCard?: () => void;
  onPressButton?: () => void;
};

export function ProductCard({
  id,
  name,
  price,
  image,
  editMode = false,
  onPressCard,
  onPressButton,
}: ProductCardProps) {
  const handlePress = () => {
    if (onPressCard) {
      onPressCard();
    }
  };

  // Use local placeholder image if image doesn't exist or is still loading
  let imageSource = placeholderImage;

  if (image) {
    if (image.startsWith('mock/')) {
      imageSource = mockImageMap[image] || placeholderImage;
    } else {
      imageSource = { uri: image };
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="h-80 overflow-hidden rounded-lg bg-white shadow-md">
      {editMode && (
        <View className="absolute right-2 top-2 z-20 rounded-full bg-blue-500 p-1">
          <AntDesign name="edit" size={16} color="white" />
        </View>
      )}
      <Image
        source={imageSource}
        className="h-40 w-full"
        style={{ height: 160, width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        resizeMode="cover"
        defaultSource={placeholderImage}
      />
      <View className="flex flex-1 flex-col justify-between p-4">
        <View className="flex flex-col">
          <Text
            className="flex-grow text-lg"
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.2}>
            {name}
          </Text>
          <Text className="mt-1 font-semibold text-gray-700">${price.toFixed(2)}</Text>
        </View>
        <Button
          title={editMode ? 'Delete Product' : 'Add to Cart'}
          onPress={onPressButton}
          className={`h-10 ${editMode ? 'bg-red-500' : ''}`}
        />
      </View>
    </TouchableOpacity>
  );
}
