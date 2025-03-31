import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Collapsible from 'react-native-collapsible';

import { SaleRepository } from '~/database/sql-implementation';

interface SaleExpansibleItemType {
  id: number;
  title: string;
  content: string;
  total: number;
}

function formatDateToExtended(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const SaleExpansibleItemList = ({ scrollEnabled = true }) => {
  const [sales, setSales] = useState<SaleExpansibleItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const allSales = await SaleRepository.getAll();
        // Sort by date descending and take last 5
        const recentSales = allSales
        .sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });

        // Transform to SaleExpansibleItemType format
        const formattedSales = recentSales.map((sale) => ({
          id: sale.id,
          title: `Sale on ${formatDateToExtended(sale.date)} - ${sale.items.length} items`,
          content: sale.items
            .map(
              (item) =>
                `${item.productName} $${item.productPrice}x${item.quantity} - $${(item.productPrice * item.quantity).toFixed(2)}`
            )
            .join('\n'),
          total: sale.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
        }));

        setSales(formattedSales);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sales');
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-5" />;
  }

  if (error) {
    return <Text className="p-5 text-center text-red-500">Error: {error}</Text>;
  }

  const renderSaleItem = ({ item, index }: { item: SaleExpansibleItemType, index: number }) => (
    <View
      className="mb-2 overflow-hidden rounded-lg border border-gray-200">
      <TouchableOpacity
        className="bg-gray-50 p-4"
        onPress={() => handleToggle(index)}
        activeOpacity={0.8}>
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-base font-bold">{item.title}</Text>
          <Text className="ml-2 text-sm font-semibold text-emerald-500">
            Total: ${item.total.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={expandedIndex !== index}>
        <View className="bg-white p-4">
          <Text className="text-sm leading-5 text-gray-700">{item.content}</Text>
        </View>
      </Collapsible>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={sales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        scrollEnabled={scrollEnabled}
      />
    </View>
  );
};

export default SaleExpansibleItemList;
