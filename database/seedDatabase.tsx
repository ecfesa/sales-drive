import { CategoryRepository, ProductRepository, SaleRepository } from './sql-implementation';

import productsToCreate from '~/mock/seedProducts';
import salesToCreate from '~/mock/seedSales';

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
    await CategoryRepository.create('Bread');
    await CategoryRepository.create('Pastry');
    await CategoryRepository.create('Dessert');

    // ======================
    // 2. Product Creation
    // ======================
    const productIds: number[] = [];

    // Create products one by one
    console.log('Starting product creation...');
    for (const [index, product] of productsToCreate.entries()) {
      try {
        const id = await ProductRepository.create(product);
        productIds.push(id);
        console.log(
          `Created product [${index + 1}/${productsToCreate.length}]: ${product.name} (ID: ${id})`
        );
      } catch (error) {
        console.error(`Failed to create product "${product.name}":`, error);
        throw new Error(`Product creation failed at ${product.name}. Aborting seeding.`);
      }
    }

    // Validate product IDs
    if (productIds.length !== productsToCreate.length) {
      throw new Error(
        `Product creation incomplete. Expected ${productsToCreate.length} products, got ${productIds.length}`
      );
    }

    // ======================
    // 3. Sales Creation
    // ======================
    const saleIds: number[] = [];

    // Create sales one by one
    console.log('\nStarting sales creation...');
    for (const [index, sale] of salesToCreate.entries()) {
      try {
        // Validate product IDs exist before creating sale
        for (const item of sale.items) {
          if (!productIds.includes(item.productId)) {
            throw new Error(`Invalid product ID ${item.productId} in sale for ${sale.date}`);
          }
        }

        const id = await SaleRepository.create(sale);
        saleIds.push(id);
        console.log(
          `Created sale [${index + 1}/${salesToCreate.length}] for ${sale.date} (ID: ${id})`
        );
      } catch (error) {
        console.error(`Failed to create sale for ${sale.date}:`, error);
        throw new Error(`Sale creation failed at ${sale.date}. Aborting seeding.`);
      }
    }

    // Final validation and summary
    if (saleIds.length === salesToCreate.length) {
      console.log('\nSeeding completed successfully!');
      console.log(`- Products created: ${productIds.length}`);
      console.log(`- Sales created: ${saleIds.length}`);
      console.log(`- First product ID: ${productIds[0]}`);
      console.log(`- Last sale ID: ${saleIds[saleIds.length - 1]}`);
    } else {
      throw new Error(
        `Seeding incomplete. Expected ${salesToCreate.length} sales, got ${saleIds.length}`
      );
    }

    // ======================
    // 4. Completion
    // ======================
    console.log('Bakery database seeded successfully!');
  } catch (error) {
    console.error('Bakery database seeding failed:', error);
    throw error;
  }
};
