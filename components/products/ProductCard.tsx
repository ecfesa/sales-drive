import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  onPress?: () => void;
};

export function ProductCard({ id, name, price, image, onPress }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="m-2 overflow-hidden rounded-lg bg-white shadow-md">
      <Image source={{ uri: image }} className="h-40 w-full rounded-t-lg" />
      <View className="p-4">
        <Text className="text-lg font-bold">{name}</Text>
        <Text className="mt-1 font-semibold text-gray-700">${price.toFixed(2)}</Text>
        <TouchableOpacity
          className="mt-3 rounded-full bg-indigo-500 px-4 py-2"
          onPress={() => console.log('Add to cart:', id)}>
          <Text className="text-center font-semibold text-white">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
