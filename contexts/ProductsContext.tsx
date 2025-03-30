import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProductsContextType {
  editMode: boolean;
  isAdminMode: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  setAdminMode: (value: boolean) => void;
  toggleAdminMode: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);
  const toggleAdminMode = () => setIsAdminMode(!isAdminMode);

  return (
    <ProductsContext.Provider
      value={{
        editMode,
        isAdminMode,
        setEditMode,
        toggleEditMode,
        setAdminMode: setIsAdminMode,
        toggleAdminMode,
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
