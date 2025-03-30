import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Sales() {
  return (
    <>
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/sales.tsx" title="Sales" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
