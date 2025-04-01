import { createContext, useContext, useState, ReactNode } from 'react';

import { SaleRepository } from '~/database/sql-implementation';
import { Cart, Product } from '~/types';
interface ProductsContextType {
  cart: Cart;
  editMode: boolean;
  getCartItemCount: () => number;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  addToCart: (product: Product) => void;
  removeOneFromCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  confirmPurchase: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const toggleEditMode = () => setEditMode(!editMode);

  const getCartItemCount = () => {
    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  const addToCart = (product: Product) => {
    // If already added, increment quantity
    const existingItem = cart.items.find((item) => item.productId === product.id);
    if (existingItem) {
      setCart({
        items: cart.items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      setCart({ items: [...cart.items, { productId: product.id, quantity: 1 }] });
    }
  };

  const removeOneFromCart = (product: Product) => {
    const existingItem = cart.items.find((item) => item.productId === product.id);
    if (existingItem) {
      let newQuantity = existingItem.quantity - 1;
      if (newQuantity < 1) {
        // Don't let quantity go below 1
        newQuantity = 1;
      }
      setCart({
        items: cart.items.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQuantity } : item
        ),
      });
    }
  };

  const removeFromCart = (product: Product) => {
    setCart({ items: cart.items.filter((item) => item.productId !== product.id) });
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const confirmPurchase = () => {
    if (cart.items.length > 0) {
      const now = new Date();
      const formattedDate =
        [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, '0'),
          String(now.getDate()).padStart(2, '0'),
        ].join('-') +
        ' ' +
        [
          String(now.getHours()).padStart(2, '0'),
          String(now.getMinutes()).padStart(2, '0'),
          String(now.getSeconds()).padStart(2, '0'),
        ].join(':');

      SaleRepository.create({
        date: formattedDate, // '2024-03-15 14:30:45'
        items: cart.items,
      });
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        editMode,
        cart,
        getCartItemCount,
        setEditMode,
        toggleEditMode,
        addToCart,
        removeOneFromCart,
        removeFromCart,
        clearCart,
        confirmPurchase,
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
