import { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, Text, RefreshControl } from 'react-native';

import SaleExpansibleItemList from '~/components/SaleExpansibleItemList';
import { SalesGraph } from '~/components/SalesGraph';
import { useSales } from '~/contexts/SalesContext';

export default function Sales() {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, dailySalesCount, refreshSales } = useSales();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshSales();
    setRefreshing(false);
  }, [refreshSales]);

  useEffect(() => {
    console.log('Raw dailySalesCount:', dailySalesCount);

    // Process the dailySalesCount data
    if (dailySalesCount.length > 0) {
      // Reverse the order to display oldest to newest
      const reversedData = [...dailySalesCount].reverse();
      console.log('Reversed data:', reversedData);

      const newLabels = reversedData.map((item) => {
        // Extract date part (before the space) and split into components
        const [datePart] = item.date.split(' ');
        const [, month, day] = datePart.split('-');

        // Format as DD/MM (with proper padding)
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}`;
      });

      const newData = reversedData.map((item) => item.count);

      console.log('Setting labels:', newLabels);
      console.log('Setting data:', newData);

      setLabels(newLabels);
      setData(newData);
    } else {
      // If there's no data, provide some dummy data for graph visualization
      const dummyLabels = ['1/1', '2/1', '3/1', '4/1', '5/1'];
      const dummyData = [5, 10, 8, 12, 15];

      console.log('No sales data, using dummy data');
      setLabels(dummyLabels);
      setData(dummyData);
    }
  }, [dailySalesCount]);

  // Graph content
  const renderHeader = useCallback(
    () => (
      <>
        <Text className="mb-1 mt-1 rounded-lg border border-dashed border-indigo-500 bg-blue-100 p-2.5 text-center text-4xl font-bold">
          Graphical View
        </Text>

        {loading && !refreshing ? (
          <View className="h-40 items-center justify-center">
            <Text>Loading sales data...</Text>
          </View>
        ) : (
          <SalesGraph labels={labels} datasets={data} />
        )}

        <Text className="mb-3 mt-1 rounded-lg border border-dashed border-indigo-500 bg-blue-100 p-2.5 text-center text-4xl font-bold">
          Listing Sales
        </Text>
      </>
    ),
    [loading, refreshing, labels, data]
  );

  return (
    <SafeAreaView className="ml-2 mr-2 flex-1">
      <SaleExpansibleItemList
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
