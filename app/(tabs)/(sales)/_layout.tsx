import { Stack } from 'expo-router';

export default function SalesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sales' }} />
      <Stack.Screen name="[saleId]" options={{ title: 'Sale' }} />
    </Stack>
  );
}
