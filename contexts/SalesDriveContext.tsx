import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

import { CategoryRepository, ProductRepository } from '~/database/sql-implementation';
import { Product, Category } from '~/types';

type SalesDriveContextType = {
  products: Product[];
  loading: boolean;
  isAdminMode: boolean;

  newProduct: (product: Product) => Promise<number>;
  updateProduct: (product: Product) => void;
  updateProductWithNewCategory: (product: Product, categoryName: string) => void;
  getOrCreateCategory: (categoryName: string) => Promise<Category>;
  deleteProduct: (product: Product) => void;
  reloadProducts: () => void;
  adminClickReceived: () => void;
};

const SalesDriveContext = createContext<SalesDriveContextType | undefined>(undefined);

type SalesDriveProviderProps = {
  children: ReactNode;
};

// Provider component
export function SalesDriveProvider({ children }: SalesDriveProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  // Click counting for admin mode
  const [clicks, setClicks] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from database
  useEffect(() => {
    const loadProducts = async () => {
      const products = await ProductRepository.getAll();
      setProducts(products);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // Cleanup click timer (dismount detector)
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const cleanupCategory = async (category: Category) => {
    const categoryCount = await ProductRepository.getCountByCategoryId(category.id);
    if (categoryCount === 0) {
      await CategoryRepository.delete(category.id);
    }
  };

  const newProduct = async (product: Omit<Product, 'id'>) => {
    const newProductId = await ProductRepository.create(product);
    setProducts([...products, { ...product, id: newProductId }]);
    return newProductId;
  };

  const updateProduct = async (product: Product) => {
    await ProductRepository.update(product);
    // Find the product in the products array and update it
    const updatedProducts = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updatedProducts);
    cleanupCategory(product.category);
  };

  const updateProductWithNewCategory = async (product: Product, categoryName: string) => {
    const newCategoryId = await CategoryRepository.create(categoryName);
    const newProduct = {
      ...product,
      category: {
        id: newCategoryId,
        name: categoryName,
      },
    };
    await ProductRepository.update(newProduct);
    // Find the product in the products array and update it
    const updatedProducts = products.map((p) => (p.id === newProduct.id ? newProduct : p));
    setProducts(updatedProducts);
    cleanupCategory(product.category);
  };

  const getOrCreateCategory = async (categoryName: string) => {
    const category = await CategoryRepository.getByName(categoryName);
    if (category) {
      return category;
    }

    // Create the category
    const newCategoryId = await CategoryRepository.create(categoryName);
    return {
      id: newCategoryId,
      name: categoryName,
    };
  };

  const deleteProduct = async (product: Product) => {
    await ProductRepository.delete(product.id);
    setProducts(products.filter((p) => p.id !== product.id));
    cleanupCategory(product.category);
  };

  const reloadProducts = async () => {
    const products = await ProductRepository.getAll();
    setProducts(products);
  };

  const adminClickReceived = () => {
    const newClickCount = clicks + 1;

    // Reset the timeout on each click
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // Set timeout to reset clicks if not clicked again quickly
    clickTimerRef.current = setTimeout(() => {
      setClicks(0);
    }, 500);

    if (newClickCount >= 5) {
      const newAdminMode = !isAdminMode;
      setIsAdminMode(newAdminMode);

      // Show toast message
      if (newAdminMode) {
        Alert.alert('You are now an admin!', 'You can now edit the products', [
          { text: 'Nice!', onPress: () => {} },
        ]);
      } else {
        Alert.alert('Disabled admin mode', 'You can no longer edit the products', [
          { text: 'OK', onPress: () => {} },
        ]);
      }

      setClicks(0);

      // Clear the timeout as I already handled the clicks
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
    } else {
      // Update click count for clicks < 5
      setClicks(newClickCount);
    }
  };

  const value = {
    /* Expose read-only variables */
    products,
    loading,
    isAdminMode,

    /* Expose product actions */
    newProduct,
    updateProduct,
    updateProductWithNewCategory,
    getOrCreateCategory,
    deleteProduct,
    reloadProducts,

    /* Expose admin click handling */
    adminClickReceived,
  };

  return <SalesDriveContext.Provider value={value}>{children}</SalesDriveContext.Provider>;
}

// Custom hook to use the context
export function useSalesDrive(): SalesDriveContextType {
  const context = useContext(SalesDriveContext);
  if (!context) {
    throw new Error('useSalesDrive must be used within a SalesDriveProvider');
  }
  return context;
}
