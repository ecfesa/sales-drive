import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function SalesModal() {
  return (
    <>
      <ScreenContent path="app/sales-modal.tsx" title="Sales Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
