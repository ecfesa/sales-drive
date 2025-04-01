import { CategoryRepository, ProductRepository, SaleRepository, resetDatabase } from './sql-implementation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import productsToCreate from '~/mock/seedProducts';
import salesToCreate from '~/mock/seedSales';

// ======================
// Database Seeding Module
// ======================

var logOutput = ""; // This will accumulate all log messages

const addToLog = (message: string) => {
    logOutput += `${message}\n`; // Add to our return string
  };

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
    addToLog("📁 Seeding categories...");
    const categoryNames = ['Bread', 'Pastry', 'Dessert'];
    const categoryIds = [];

    for (const name of categoryNames) {
      const id = await CategoryRepository.create(name);
      categoryIds.push(id);
      addToLog(`   ✔ Created category: ${name} (ID: ${id})`);
    }
    addToLog(`✅ Successfully created ${categoryIds.length} categories\n`);

    // ======================
    // 2. Product Creation
    // ======================
    addToLog("🍞 Seeding products...");
    const productIds: number[] = [];

    for (const [index, product] of productsToCreate.entries()) {
      try {
        const id = await ProductRepository.create(product);
        productIds.push(id);
        addToLog(`   ✔ [${index + 1}/${productsToCreate.length}] ${product.name} (ID: ${id})`);
      } catch (error) {
        addToLog(`   ❌ Failed to create product "${product.name}": ${error.message}`);
        throw new Error(`Product creation failed at ${product.name}`);
      }
    }

    if (productIds.length !== productsToCreate.length) {
      throw new Error(`Expected ${productsToCreate.length} products, got ${productIds.length}`);
    }
    addToLog(`✅ Successfully created ${productIds.length} products\n`);

    // ======================
    // 3. Sales Creation
    // ======================
    addToLog("💰 Seeding sales...");
    const saleIds: number[] = [];

    for (const [index, sale] of salesToCreate.entries()) {
      try {
        // Validate product IDs
        for (const item of sale.items) {
          if (!productIds.includes(item.productId)) {
            throw new Error(`Invalid product ID ${item.productId}`);
          }
        }

        const id = await SaleRepository.create(sale);
        saleIds.push(id);

        // Format sale items for display
        const itemsFormatted = sale.items.map(item => {
          const product = productsToCreate.find(p => p.id === item.productId);
          return `${product?.name || 'Unknown'} (Qty: ${item.quantity})`;
        }).join(', ');

        addToLog(`   ✔ [${index + 1}/${salesToCreate.length}] ${sale.date} (ID: ${id})`);
        addToLog(`      Items: ${itemsFormatted}`);
      } catch (error) {
        addToLog(`   ❌ Failed to create sale for ${sale.date}: ${error.message}`);
        throw new Error(`Sale creation failed at ${sale.date}`);
      }
    }

    // ======================
    // 4. Completion
    // ======================
    addToLog("\n🎉 Database seeding completed successfully!");
    addToLog("====================================");
    addToLog(`📊 Summary:`);
    addToLog(`   - Categories: ${categoryIds.length}`);
    addToLog(`   - Products: ${productIds.length}`);
    addToLog(`   - Sales: ${saleIds.length}`);
    addToLog(`   - First product ID: ${productIds[0]}`);
    addToLog(`   - Last sale ID: ${saleIds[saleIds.length - 1]}`);
    addToLog("====================================\n");

    // Mark as seeded in async storage
    await AsyncStorage.setItem('databaseSeeded', 'true');

    return {
      success: true,
      logs: logOutput,
      counts: {
        categories: categoryIds.length,
        products: productIds.length,
        sales: saleIds.length
      }
    };
  } catch (error) {
    addToLog("\n🔥 Seeding failed - rolling back changes...");
    await resetDatabase();

    return {
      success: false,
      logs: logOutput,
      error: error.message
    };
  }
};
