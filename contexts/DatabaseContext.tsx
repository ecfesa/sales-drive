import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import {
  openDatabase,
  initDatabase,
  resetDatabase,
  ProductRepository,
  CategoryRepository,
  SaleRepository,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  debugDatabase,
  SaleWithProducts,
} from '../database/sql-implementation';
import { Product, Category, CartItem } from '../types/types';

// Define the context type
interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  products: {
    create: (product: Omit<Product, 'id'>) => Promise<number>;
    getById: (id: number) => Promise<Product | null>;
    getAll: () => Promise<Product[]>;
    update: (product: Product) => Promise<void>;
    delete: (id: number) => Promise<void>;
  };
  categories: {
    create: (name: string) => Promise<number>;
    getById: (id: number) => Promise<Category | null>;
    getAll: () => Promise<Category[]>;
    update: (category: Category) => Promise<void>;
    delete: (id: number) => Promise<void>;
  };
  sales: {
    create: (saleData: { date: string; items: CartItem[] }) => Promise<number>;
    getById: (id: number) => Promise<SaleWithProducts | null>;
    getAll: () => Promise<SaleWithProducts[]>;
    delete: (id: number) => Promise<void>;
  };
  resetDatabase: () => Promise<void>;
}

// Create the context with an undefined initial value
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

/**
 * Checks if the database has been initialized and initializes it if needed
 */
const ensureDatabaseInitialized = async (): Promise<void> => {
  try {
    const isInitialized = await AsyncStorage.getItem('databaseInitialized');

    if (isInitialized !== 'true') {
      // Open the database connection and initialize tables
      openDatabase();
      initDatabase();
      await AsyncStorage.setItem('databaseInitialized', 'true');
    } else {
      // Just open the connection if database was already initialized
      openDatabase();
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Context provider component
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true);
        await ensureDatabaseInitialized();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        isInitialized,
        isLoading,
        error,
        products: ProductRepository,
        categories: CategoryRepository,
        sales: SaleRepository,
        resetDatabase,
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Custom hook to use the database context
export function useDatabase() {
  const context = useContext(DatabaseContext);

  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  return context;
}
