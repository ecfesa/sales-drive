import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProductsContextType {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <ProductsContext.Provider
      value={{
        editMode,
        setEditMode,
        toggleEditMode,
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
