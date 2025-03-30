import { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { SalesGraph } from '~/components/SalesGraph';
import RecentSalesList from '~/components/SalesExpansibleItem';
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

        setLabels(dailySales.slice(dailySales.length-7, dailySales.length).map((item) => {
            const [year, month, day] = item.date.split('-');
            return `${day}/${month}`;
        }));

        setData(dailySales.map((item) => item.count));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <SafeAreaView className="flex-1 mt-6">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Loading sales data...</Text>
        </View>
      ) : (
        <SalesGraph labels={labels} datasets={data} />
      )}

      <RecentSalesList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
