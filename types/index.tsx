/**
 * Type representing a product
 */
export type Product = {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  description: string;
  category: Category;
};

/**
 * Type representing a sale
 */
export type Sale = {
  id: number;
  productId: number;
  quantity: number;
  date: string;
};

/**
 * Type representing a cart item
 */
export type CartItem = {
  productId: number;
  quantity: number;
};

/**
 * Type representing a cart
 */
export type Cart = {
  items: CartItem[];
};

/**
 * Type representing a category
 */
export type Category = {
  id: number;
  name: string;
};

/**
 * Type representing a sale with full product details
 */
export type SaleWithProducts = {
  id: number;
  date: string;
  items: {
    productId: number;
    quantity: number;
    productName: string;
    productPrice: number;
  }[];
};
