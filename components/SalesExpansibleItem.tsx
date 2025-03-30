import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { SaleRepository } from '~/database/sql-implementation'; // Update import path

interface ExpandableSaleItem {
  id: number;
  title: string;
  content: string;
  total: number;
}

const RecentSalesList = () => {
  const [sales, setSales] = useState<ExpandableSaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const allSales = await SaleRepository.getAll();
        // Sort by date descending and take last 5
        const recentSales = allSales
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        // Transform to ExpandableSaleItem format
        const formattedSales = recentSales.map(sale => ({
          id: sale.id,
          title: `Sale on ${new Date(sale.date).toLocaleDateString()} - ${sale.items.length} items`,
          content: sale.items.map(item =>
            `${item.productName} x${item.quantity} - $${(item.productPrice * item.quantity).toFixed(2)}`
          ).join('\n'),
          total: sale.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0)
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
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {sales.map((sale, index) => (
        <View key={sale.id.toString()} style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => handleToggle(index)}
            activeOpacity={0.8}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{sale.title}</Text>
              <Text style={styles.total}>Total: ${sale.total.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>

          <Collapsible collapsed={expandedIndex !== index}>
            <View style={styles.content}>
              <Text style={styles.contentText}>{sale.content}</Text>
            </View>
          </Collapsible>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  total: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
    marginLeft: 10,
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    padding: 20,
    textAlign: 'center',
  },
});

export default RecentSalesList;
