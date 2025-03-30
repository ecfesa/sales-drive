import { CategoryRepository, ProductRepository, SaleRepository } from './sql-implementation';

// ======================
// Database Seeding Module
// ======================

/**
 * Populates the database with initial sample data including:
 * - Bakery Categories
 * - Bakery Products
 * - Bakery Sales records
 *
 * @throws {Error} If any seeding operation fails
 * @returns {Promise<void>} Resolves when seeding completes
 */
export const seedDatabase = async () => {
  try {
    // ======================
    // 1. Category Seeding
    // ======================
    const breadId = await CategoryRepository.create('Bread');
    const pastryId = await CategoryRepository.create('Pastry');
    const dessertId = await CategoryRepository.create('Dessert');

    // ======================
    // 2. Product Seeding
    // ======================
    const productIds = await Promise.all([
      // Bread Products
      ProductRepository.create({
        name: 'Sourdough Loaf',
        price: 6.99,
        imagePath: 'mock/sourdough',
        description: 'Artisan sourdough with crispy crust',
        category: { id: breadId, name: 'Bread' },
      }),
      ProductRepository.create({
        name: 'Whole Grain Bread',
        price: 5.49,
        imagePath: 'mock/whole_grain_bread',
        description: 'Healthy whole grain bread with seeds',
        category: { id: breadId, name: 'Bread' },
      }),

      // Pastry Products
      ProductRepository.create({
        name: 'Croissant',
        price: 2.99,
        imagePath: 'mock/croissant',
        description: 'Buttery French croissant with flaky layers',
        category: { id: pastryId, name: 'Pastry' },
      }),
      ProductRepository.create({
        name: 'Pain au Chocolat',
        price: 3.49,
        imagePath: 'mock/pain_au_chocolat',
        description: 'Flaky pastry with rich chocolate filling',
        category: { id: pastryId, name: 'Pastry' },
      }),
      ProductRepository.create({
        name: 'Apple Turnover',
        price: 3.25,
        imagePath: 'mock/apple_turnover',
        description: 'Puff pastry filled with spiced apple filling',
        category: { id: pastryId, name: 'Pastry' },
      }),

      // Dessert Products
      ProductRepository.create({
        name: 'Chocolate Eclair',
        price: 3.99,
        imagePath: 'mock/chocolate_eclair',
        description: 'Cream-filled pastry with chocolate glaze',
        category: { id: dessertId, name: 'Dessert' },
      }),
      ProductRepository.create({
        name: 'Tiramisu',
        price: 5.99,
        imagePath: 'mock/tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers',
        category: { id: dessertId, name: 'Dessert' },
      }),
      ProductRepository.create({
        name: 'Red Velvet Cupcake',
        price: 3.75,
        imagePath: 'mock/red_velvet_cupcake',
        description: 'Moist red velvet cake with cream cheese frosting',
        category: { id: dessertId, name: 'Dessert' },
      }),

      // Additional Bread Products
      ProductRepository.create({
        name: 'Baguette',
        price: 3.49,
        imagePath: 'mock/baguette',
        description: 'Traditional French baguette with crisp crust',
        category: { id: breadId, name: 'Bread' },
      }),
      ProductRepository.create({
        name: 'Cinnamon Raisin Bread',
        price: 6.99,
        imagePath: 'mock/cinnamon_raisin_bread',
        description: 'Sweet bread with cinnamon swirls and plump raisins',
        category: { id: breadId, name: 'Bread' },
      }),
    ]);

    // Validate product creation
    if (productIds.some((id) => typeof id !== 'number')) {
      throw new Error('Invalid product IDs generated');
    }

    // ======================
    // 3. Sales Seeding
    // ======================
    // Morning Bakery Sale
    const sale1Id = await SaleRepository.create({
      date: '2024-01-15',
      items: [
        { productId: productIds[0], quantity: 3 }, // Sourdough Loaf
        { productId: productIds[2], quantity: 5 }, // Croissant
      ],
    });

    // Afternoon Bakery Sale
    const sale2Id = await SaleRepository.create({
      date: '2024-01-16',
      items: [
        { productId: productIds[1], quantity: 2 }, // Whole Grain Bread
        { productId: productIds[3], quantity: 4 }, // Chocolate Eclair
      ],
    });

    // Validate sales creation
    if (typeof sale1Id !== 'number' || typeof sale2Id !== 'number') {
      throw new Error('Sales creation failed');
    }

    // ======================
    // 4. Completion
    // ======================
    console.log('Bakery database seeded successfully!');
    console.log('Sample Sales IDs:', { sale1Id, sale2Id });
  } catch (error) {
    console.error('Bakery database seeding failed:', error);
    throw error;
  }
};
