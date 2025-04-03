import { useFocusEffect } from 'expo-router';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { SaleRepository } from '~/database/sql-implementation';
import { SaleWithProducts } from '~/types';

interface DailySalesData {
  date: string;
  count: number;
}

interface SalesContextType {
  sales: SaleWithProducts[];
  loading: boolean;
  dailySalesCount: DailySalesData[];
  refreshSales: () => Promise<void>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<SaleWithProducts[]>([]);
  const [dailySalesCount, setDailySalesCount] = useState<DailySalesData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sales data on component mount
  useFocusEffect(() => {
    refreshSales();
  });

  const refreshSales = async () => {
    setLoading(true);
    try {
      const salesData = await SaleRepository.getAll();
      setSales(salesData);

      // Also refresh daily sales count
      const dailySales = await SaleRepository.getDailySalesCount();
      setDailySalesCount(dailySales);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        loading,
        dailySalesCount,
        refreshSales,
      }}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales(): SalesContextType {
  const context = useContext(SalesContext);

  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }

  return context;
}
