export type Product = {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  description: string;
  category: Category;
};

export type Sale = {
  id: number;
  productId: number;
  quantity: number;
  date: string;
};

export type CartItem = {
  productId: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type Category = {
  id: number;
  name: string;
};
