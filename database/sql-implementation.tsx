import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

import { Product, Category, CartItem, SaleWithProducts } from '../types/types';

// Define types for database result objects
interface CategoryResult {
  id: number;
  name: string;
}

interface SaleResult {
  id: number;
  date: string;
}

interface ProductSaleResult {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

/**
 * Database connection instance
 */
let db: SQLiteDatabase | null = null;

/**
 * Opens database connection if not already open
 * @returns SQLiteDatabase instance
 */
export const openDatabase = (): SQLiteDatabase => {
  if (!db) {
    db = openDatabaseSync('sales-drive.db');
  }
  return db;
};

/**
 * Completely resets the database by:
 * 1. Closing current connection
 * 2. Deleting the database file
 * 3. Recreating the database
 * 4. Clearing the seeding flag
 */
export const resetDatabase = async () => {
  try {
    // Close existing connection if open
    if (db) {
      await db.closeAsync();
      db = null;
    }

    // Delete database file
    const dbPath = `${FileSystem.documentDirectory}SQLite/sales-drive.db`;
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath);
    }

    // Reinitialize database
    db = openDatabaseSync('sales-drive.db');
    initDatabase();

    // Clear seeding flag
    await AsyncStorage.removeItem('databaseSeeded');
  } catch (error) {
    throw error;
  }
};

/**
 * Initializes database tables (Categories, Products, Sales, ProductSale)
 * Runs the SQL commands to create tables if they don't exist
 */
export const initDatabase = () => {
  const database = openDatabase();
  database.execSync(`
    CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS Products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      imagePath TEXT,
      description TEXT,
      categoryId INTEGER,
      FOREIGN KEY (categoryId) REFERENCES Categories(id)
    );

    CREATE TABLE IF NOT EXISTS Sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ProductSale (
      saleId INTEGER,
      productId INTEGER,
      quantity INTEGER NOT NULL,
      PRIMARY KEY (saleId, productId),
      FOREIGN KEY (saleId) REFERENCES Sales(id),
      FOREIGN KEY (productId) REFERENCES Products(id)
    );
  `);
};

/**
 * Product Repository - Handles all Product-related database operations
 * Methods:
 * - create: Adds a new product
 * - getById: Fetches single product by ID
 * - getAll: Gets all products with category info
 * - update: Modifies existing product
 * - delete: Removes product by ID
 */

export const ProductRepository = {
  create: async (product: Omit<Product, 'id'>): Promise<number> => {
    const database = openDatabase();
    const { name, price, imagePath, description, category } = product;
    const result = await database.runAsync(
      'INSERT INTO Products (name, price, imagePath, description, categoryId) VALUES (?, ?, ?, ?, ?)',
      [name, price, imagePath, description, category.id]
    );
    return result.lastInsertRowId as number;
  },

  getById: async (id: number): Promise<Product | null> => {
    const database = openDatabase();
    const result = await database.getFirstAsync(
      `SELECT p.*, c.id as categoryId, c.name as categoryName
       FROM Products p
       JOIN Categories c ON p.categoryId = c.id
       WHERE p.id = ?`,
      [id]
    );
    return result ? mapProduct(result) : null;
  },

  // Get count of products by category
  getCountByCategoryId: async (categoryId: number): Promise<number> => {
    const database = openDatabase();
    const result = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM Products WHERE categoryId = ?',
      [categoryId]
    );
    return result ? result.count : 0;
  },

  getAll: async (): Promise<Product[]> => {
    const database = openDatabase();
    const results = await database.getAllAsync(
      `SELECT p.*, c.id as categoryId, c.name as categoryName
       FROM Products p
       JOIN Categories c ON p.categoryId = c.id`
    );
    return results.map(mapProduct);
  },

  update: async (product: Product): Promise<void> => {
    const database = openDatabase();
    const { id, name, price, imagePath, description, category } = product;
    await database.runAsync(
      'UPDATE Products SET name = ?, price = ?, imagePath = ?, description = ?, categoryId = ? WHERE id = ?',
      [name, price, imagePath, description, category.id, id]
    );
  },

  delete: async (id: number): Promise<void> => {
    const database = openDatabase();
    await database.runAsync('DELETE FROM Products WHERE id = ?', [id]);
  },
};

/**
 * Category Repository - Handles all Category-related database operations
 * Methods:
 * - create: Adds new category
 * - getById: Gets single category by ID
 * - getAll: Lists all categories
 * - update: Modifies category name
 * - delete: Removes category
 */

export const CategoryRepository = {
  create: async (name: string): Promise<number> => {
    const database = openDatabase();
    const result = await database.runAsync('INSERT INTO Categories (name) VALUES (?)', [name]);
    return result.lastInsertRowId as number;
  },

  getById: async (id: number): Promise<Category | null> => {
    const database = openDatabase();
    const result = await database.getFirstAsync<CategoryResult>(
      'SELECT * FROM Categories WHERE id = ?',
      [id]
    );
    return result ? { id: result.id, name: result.name } : null;
  },

  getAll: async (): Promise<Category[]> => {
    const database = openDatabase();
    return await database.getAllAsync('SELECT * FROM Categories');
  },

  update: async (category: Category): Promise<void> => {
    const database = openDatabase();
    await database.runAsync('UPDATE Categories SET name = ? WHERE id = ?', [
      category.name,
      category.id,
    ]);
  },

  delete: async (id: number): Promise<void> => {
    const database = openDatabase();
    await database.runAsync('DELETE FROM Categories WHERE id = ?', [id]);
  },
};

/**
 * Sale Repository - Handles all Sale-related database operations
 * Methods:
 * - create: Records new sale (with transaction)
 * - getById: Gets sale details with products
 * - getAll: Lists all sales with products
 * - delete: Removes sale and related records
 */
export const SaleRepository = {
  create: async (saleData: { date: string; items: CartItem[] }): Promise<number> => {
    const database = openDatabase();
    let saleId = 0; // Initialize with a default value

    try {
      await database.withTransactionAsync(async () => {
        const saleResult = await database.runAsync('INSERT INTO Sales (date) VALUES (?)', [
          saleData.date,
        ]);
        saleId = saleResult.lastInsertRowId as number;

        for (const item of saleData.items) {
          if (!(await ProductRepository.getById(item.productId))) {
            throw new Error(`Invalid product ID: ${item.productId}`);
          }

          await database.runAsync(
            'INSERT INTO ProductSale (saleId, productId, quantity) VALUES (?, ?, ?)',
            [saleId, item.productId, item.quantity]
          );
        }
      });
      return saleId;
    } catch (error) {
      throw error; // Or handle the error as needed
    }
  },

  getById: async (id: number): Promise<SaleWithProducts | null> => {
    const database = openDatabase();
    try {
      const saleResult = await database.getFirstAsync<SaleResult>(
        'SELECT * FROM Sales WHERE id = ?',
        [id]
      );
      if (!saleResult) return null;

      const items = await database.getAllAsync<ProductSaleResult>(
        `SELECT ps.productId, ps.quantity, p.name, p.price
         FROM ProductSale ps
         JOIN Products p ON ps.productId = p.id
         WHERE ps.saleId = ?`,
        [id]
      );

      return {
        id: saleResult.id,
        date: saleResult.date,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.name,
          productPrice: item.price,
        })),
      };
    } catch (error) {
      throw error;
    }
  },
  getAll: async (): Promise<SaleWithProducts[]> => {
    const database = openDatabase();
    try {
      const sales = await database.getAllAsync('SELECT * FROM Sales ORDER BY date DESC');

      return Promise.all(
        sales.map(async (sale: any) => {
          const items = await database.getAllAsync(
            `SELECT ps.productId, ps.quantity, p.name, p.price
             FROM ProductSale ps
             JOIN Products p ON ps.productId = p.id
             WHERE ps.saleId = ?`,
            [sale.id]
          );

          return {
            id: sale.id,
            date: sale.date,
            items: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              productName: item.name,
              productPrice: item.price,
            })),
          };
        })
      );
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    const database = openDatabase();
    try {
      await database.withTransactionAsync(async () => {
        await database.runAsync('DELETE FROM ProductSale WHERE saleId = ?', [id]);
        await database.runAsync('DELETE FROM Sales WHERE id = ?', [id]);
      });
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Maps raw database result to Product type
 * @param result Raw database row
 * @returns Properly formatted Product object
 */
const mapProduct = (result: any): Product => ({
  id: result.id,
  name: result.name,
  price: result.price,
  imagePath: result.imagePath,
  description: result.description,
  category: {
    id: result.categoryId,
    name: result.categoryName,
  },
});

/**
 * Debug tools for database inspection
 * Methods:
 * - printAllData: Logs complete database contents to console
 */
export const debugDatabase = {
  printAllData: async () => {
    const database = openDatabase();
    try {
      const data = {
        categories: await database.getAllAsync('SELECT * FROM Categories'),
        products: await database.getAllAsync(`
          SELECT p.*, c.name as categoryName
          FROM Products p
          JOIN Categories c ON p.categoryId = c.id
        `),
        sales: await database.getAllAsync(`
          SELECT s.*,
          GROUP_CONCAT(ps.productId || ':' || ps.quantity, '; ') as items
          FROM Sales s
          LEFT JOIN ProductSale ps ON s.id = ps.saleId
          GROUP BY s.id
        `),
        productSales: await database.getAllAsync(`
          SELECT ps.*, p.name as productName
          FROM ProductSale ps
          JOIN Products p ON ps.productId = p.id
        `),
      };

      console.log('DATABASE CONTENTS:');
      console.log('Categories:', JSON.stringify(data.categories, null, 2));
      console.log('Products:', JSON.stringify(data.products, null, 2));
      console.log('Sales:', JSON.stringify(data.sales, null, 2));
      console.log('Product Sales:', JSON.stringify(data.productSales, null, 2));
    } catch (error) {
      console.log('Failed to print database contents:', error);
    }
  },
};

// Export all public types
export type { SaleWithProducts };
