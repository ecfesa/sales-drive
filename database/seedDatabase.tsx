import { CategoryRepository, ProductRepository, SaleRepository } from './sql-implementation';

// ======================
// Database Seeding Module
// ======================

/**
 * Populates the database with initial sample data including:
 * - Categories
 * - Products
 * - Sales records
 *
 * @throws {Error} If any seeding operation fails
 * @returns {Promise<void>} Resolves when seeding completes
 */
export const seedDatabase = async () => {
  try {
    // ======================
    // 1. Category Seeding
    // ======================
    const electronicsId = await CategoryRepository.create('Electronics');
    const clothingId = await CategoryRepository.create('Clothing');
    const homeId = await CategoryRepository.create('Home & Kitchen');

    // ======================
    // 2. Product Seeding
    // ======================
    const productIds = await Promise.all([
      // Electronics Products
      ProductRepository.create({
        name: 'Smartphone X',
        price: 699.99,
        imagePath: 'images/phone.jpg',
        description: 'Latest model smartphone with AI camera',
        category: { id: electronicsId, name: 'Electronics' },
      }),
      ProductRepository.create({
        name: 'Wireless Headphones',
        price: 149.99,
        imagePath: 'images/headphones.jpg',
        description: 'Noise-cancelling Bluetooth headphones',
        category: { id: electronicsId, name: 'Electronics' },
      }),

      // Clothing Products
      ProductRepository.create({
        name: 'Cotton T-Shirt',
        price: 24.99,
        imagePath: 'images/tshirt.jpg',
        description: '100% Cotton crew neck t-shirt',
        category: { id: clothingId, name: 'Clothing' },
      }),

      // Home & Kitchen Products
      ProductRepository.create({
        name: 'Ceramic Cookware Set',
        price: 89.99,
        imagePath: 'images/cookware.jpg',
        description: 'Non-stick ceramic coating cookware set',
        category: { id: homeId, name: 'Home & Kitchen' },
      }),
    ]);

    // Validate product creation
    if (productIds.some((id) => typeof id !== 'number')) {
      throw new Error('Invalid product IDs generated');
    }

    // ======================
    // 3. Sales Seeding
    // ======================
    // Electronics Sale
    const sale1Id = await SaleRepository.create({
      date: '2024-01-15',
      items: [
        { productId: productIds[0], quantity: 2 }, // Smartphone X
        { productId: productIds[1], quantity: 1 }, // Wireless Headphones
      ],
    });

    // Clothing & Home Sale
    const sale2Id = await SaleRepository.create({
      date: '2024-01-16',
      items: [
        { productId: productIds[2], quantity: 5 }, // Cotton T-Shirt
        { productId: productIds[3], quantity: 2 }, // Ceramic Cookware
      ],
    });

    // Validate sales creation
    if (typeof sale1Id !== 'number' || typeof sale2Id !== 'number') {
      throw new Error('Sales creation failed');
    }

    // ======================
    // 4. Completion
    // ======================
    console.log('Database seeded successfully!');
    console.log('Sample Sales IDs:', { sale1Id, sale2Id });
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};
