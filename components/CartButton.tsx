import FontAwesome from '@expo/vector-icons/FontAwesome';
import { forwardRef } from 'react';
import { Pressable, View, Text } from 'react-native';

type PressableRef = React.ElementRef<typeof Pressable>;

export const CartButton = forwardRef<PressableRef, { onPress?: () => void; itemCount?: number }>(
  ({ onPress, itemCount = 0 }, ref) => {
    return (
      <Pressable onPress={onPress} ref={ref}>
        {({ pressed }) => (
          <View className="relative">
            <FontAwesome
              name="shopping-cart"
              size={25}
              color="gray"
              style={{
                marginRight: 15,
                opacity: pressed ? 0.5 : 1,
              }}
            />
            {itemCount > 0 && (
              <View className="absolute -top-1.5 right-2 h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF3B30] px-[3px]">
                <Text className="text-center text-xs font-bold text-white">{itemCount}</Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  }
);

export default CartButton;
