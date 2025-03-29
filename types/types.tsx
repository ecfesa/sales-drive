type Product = {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  description: string;
};

type Sale = {
  id: number;
  productId: number;
  quantity: number;
  date: string;
};

type CartItem = {
  productId: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
};

type Category = {
  id: number;
  name: string;
};
