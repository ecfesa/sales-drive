import { useEffect, useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';

import SaleExpansibleItemList from '~/components/SaleExpansibleItemList';
import { SalesGraph } from '~/components/SalesGraph';
import { SaleRepository } from '~/database/sql-implementation';

interface DailySalesData {
  date: string;
  count: number;
}

export default function Sales() {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const dailySales: DailySalesData[] = await SaleRepository.getDailySalesCount();

        setLabels(
          dailySales.slice(dailySales.length - 7, dailySales.length).map((item) => {
            const [, month, day] = item.date.split('-');
            return `${day}/${month}`;
          })
        );

        setData(dailySales.map((item) => item.count));
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        if(data){
          setLoading(false);
        }
      }
    };

    fetchSalesData();
  }, []);

  return (
    <SafeAreaView className="ml-2 mr-2 flex-1">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text>Loading sales data...</Text>
        </View>
      ) : (
        <SalesGraph labels={labels} datasets={data} />
      )}

      <Text className="mb-1 mt-1 rounded-lg border border-dashed border-blue-500 bg-blue-100 p-2.5 text-center text-4xl font-bold">
        Last Sales
      </Text>

      <SaleExpansibleItemList />
    </SafeAreaView>
  );
}
