import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { useDatabase } from './DatabaseContext';
import { Product, Category } from '../types/types';

interface CategoryWithProducts {
  title: string;
  data: Product[][];
}

interface ProductsContextType {
  editMode: boolean;
  isAdminMode: boolean;
  products: Product[];
  categories: Category[];
  productsByCategory: CategoryWithProducts[];
  loading: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  setAdminMode: (value: boolean) => void;
  toggleAdminMode: () => void;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const { products: productsRepository, categories: categoriesRepository } = useDatabase();

  const toggleEditMode = () => setEditMode(!editMode);
  const toggleAdminMode = () => setIsAdminMode(!isAdminMode);

  // Update productsByCategory whenever products or categories change
  useEffect(() => {
    if (products.length && categories.length) {
      // Group products by category
      const groupedProducts = categories.map((category) => {
        // Find all products that belong to this category
        const categoryProducts = products.filter((product) => product.category.id === category.id);

        return {
          title: category.name,
          data: [categoryProducts], // This needs to be an array of arrays for SectionList
        };
      });

      // Filter out empty categories
      const nonEmptyCategories = groupedProducts.filter((category) => category.data[0].length > 0);

      setProductsByCategory(nonEmptyCategories);
    }
  }, [products, categories]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await productsRepository.getAll();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await categoriesRepository.getAll();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Public method to refresh all data from database
  const refresh = async () => {
    try {
      await fetchProducts();
      await fetchCategories();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Product): Promise<void> => {
    try {
      // Get the original product to find its old category ID
      const originalProduct = products.find((p) => p.id === product.id);
      if (!originalProduct) {
        throw new Error(`Product with ID ${product.id} not found`);
      }

      const oldCategoryId = originalProduct.category.id;

      // Update the product in the database
      await productsRepository.update(product);

      // Update the product in the local state
      setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? product : p)));

      // If the category was changed, check if the old category is now empty
      if (oldCategoryId !== product.category.id) {
        await deleteEmptyCategory(oldCategoryId);
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId: number): Promise<void> => {
    try {
      // Find the product to get its category ID before deletion
      const productToDelete = products.find((p) => p.id === productId);
      if (!productToDelete) return;

      const categoryId = productToDelete.category.id;

      // Delete the product
      await productsRepository.delete(productId);

      // Update local state
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));

      // Check if category is now empty and delete if it is
      await deleteEmptyCategory(categoryId);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const deleteEmptyCategory = async (categoryId: number): Promise<void> => {
    try {
      // Get count of products in this category
      const productCount = await productsRepository.getCountByCategoryId(categoryId);

      // If no products left in this category, delete it
      if (productCount === 0) {
        await categoriesRepository.delete(categoryId);
        // Update categories state
        setCategories((prevCategories) => prevCategories.filter((c) => c.id !== categoryId));
      }
    } catch (error) {
      console.error('Failed to delete empty category:', error);
    }
  };

  // Fetch products and categories on initial load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        editMode,
        isAdminMode,
        products,
        categories,
        productsByCategory,
        loading,
        setEditMode,
        toggleEditMode,
        setAdminMode: setIsAdminMode,
        toggleAdminMode,
        updateProduct,
        deleteProduct,
        refresh,
      }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }

  return context;
}
