// Array with all products to be created
const productsToCreate = [
  {
    id: 1,
    name: 'Sourdough Loaf',
    price: 6.99,
    imagePath: './mock/images/sourdough.jpeg',
    description: 'Artisan sourdough with crispy crust',
    category: { id: 1, name: 'Bread' }
  },
  {
    id: 2,
    name: 'Whole Grain Bread',
    price: 5.49,
    imagePath: './mock/images/whole_grain_bread.jpeg',
    description: 'Healthy whole grain bread with seeds',
    category: { id: 1, name: 'Bread' }
  },
  {
    id: 3,
    name: 'Croissant',
    price: 2.99,
    imagePath: './mock/images/croissant.jpeg',
    description: 'Buttery French croissant with flaky layers',
    category: { id: 2, name: 'Pastry' }
  },
  {
    id: 4,
    name: 'Pain au Chocolat',
    price: 2.49,
    imagePath: './mock/images/pain_au_chocolat.jpeg',
    description: 'Flaky pastry with rich chocolate filling',
    category: { id: 2, name: 'Pastry' }
  },
  {
    id: 5,
    name: 'Apple Turnover',
    price: 2.25,
    imagePath: './mock/images/apple_turnover.jpeg',
    description: 'Puff pastry filled with spiced apple filling',
    category: { id: 2, name: 'Pastry' }
  },
  {
    id: 6,
    name: 'Chocolate Eclair',
    price: 2.99,
    imagePath: './mock/images/chocolate_eclair.jpeg',
    description: 'Cream-filled pastry with chocolate glaze',
    category: { id: 3, name: 'Dessert' }
  },
  {
    id: 7,
    name: 'Tiramisu',
    price: 5.99,
    imagePath: './mock/images/tiramisu.jpeg',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    category: { id: 3, name: 'Dessert' }
  },
  {
    id: 8,
    name: 'Red Velvet Cupcake',
    price: 2.75,
    imagePath: './mock/images/red_velvet_cupcake.jpeg',
    description: 'Moist red velvet cake with cream cheese frosting',
    category: { id: 3, name: 'Dessert' }
  },
  {
    id: 9,
    name: 'Baguette',
    price: 2.49,
    imagePath: './mock/images/baguette.jpeg',
    description: 'Traditional French baguette with crisp crust',
    category: { id: 1, name: 'Bread' }
  },
  {
    id: 10,
    name: 'Cinnamon Raisin Bread',
    price: 6.99,
    imagePath: './mock/images/cinnamon_raisin_bread.jpeg',
    description: 'Sweet bread with cinnamon swirls and plump raisins',
    category: { id: 1, name: 'Bread' }
  }
];

export default productsToCreate;
