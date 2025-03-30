import { View } from 'react-native';

export default function BlankHeader({ children }: { children?: React.ReactNode }) {
  return (
    <View className="flex-row justify-between border-b border-gray-400 bg-white px-4 py-2 shadow">
      {children}
    </View>
  );
}
