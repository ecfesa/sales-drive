import { Stack } from 'expo-router';

import { SalesProvider } from '~/contexts/SalesContext';

export default function SalesLayout() {
  return (
    <SalesProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Sales' }} />
      </Stack>
    </SalesProvider>
  );
}
