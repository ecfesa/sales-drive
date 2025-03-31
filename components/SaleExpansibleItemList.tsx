import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControlProps,
  ListRenderItem,
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import { useSales } from '~/contexts/SalesContext';

import SaleItem from '~/components/SalesExpansibleItem'

interface SaleExpansibleItemType {
  id: number;
  title: string;
  content: string;
  total: number;
}

interface SaleExpansibleItemListProps {
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshControl?: React.ReactElement<RefreshControlProps>;
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

export default function SaleExpansibleItemList({
  ListHeaderComponent,
  refreshControl,
}: SaleExpansibleItemListProps = {}) {
  const [formattedSales, setFormattedSales] = useState<SaleExpansibleItemType[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { sales, loading } = useSales();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {

      // Transform to SaleExpansibleItemType format
      const formattedItems = [...sales].map((sale) => ({
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

      setFormattedSales(formattedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format sales');
    }
  }, [sales]);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderSaleItem = ({ item, index }) => (
    <SaleItem
      item={item}
      index={index}
      isExpanded={expandedIndex === index}
      onToggle={handleToggle}
    />
  );

  if (loading && !refreshControl) {
    return <ActivityIndicator size="large" className="mt-5" />;
  }

  if (error) {
    return <Text className="p-5 text-center text-red-500">Error: {error}</Text>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={formattedSales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={refreshControl}
      />
    </View>
  );
}
