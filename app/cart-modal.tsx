import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function CartModal() {
  return (
    <>
      <ScreenContent path="app/cart-modal.tsx" title="Cart" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
