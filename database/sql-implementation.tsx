import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { openDatabaseSync, SQLTransaction, SQLResultSet } from 'expo-sqlite';

type SQLTransactionCallback = (tx: SQLTransaction) => void;

/**
 * Database connection instance
 * Uses expo-sqlite to create/open a SQLite database file named 'sales-drive.db'
 */
let db = openDatabaseSync('sales-drive.db');

/**
 * Completely resets the database by:
 * 1. Closing current connection
 * 2. Deleting the database file
 * 3. Recreating the database
 * 4. Clearing the seeding flag
 */
export const resetDatabase = async () => {
  try {
    // Close existing connection
    await db.closeAsync();

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
  db.execSync(`
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
    const { name, price, imagePath, description, category } = product;
    const result = await db.runAsync(
      'INSERT INTO Products (name, price, imagePath, description, categoryId) VALUES (?, ?, ?, ?, ?)',
      [name, price, imagePath, description, category.id]
    );
    return result.lastInsertRowId as number;
  },

  getById: async (id: number): Promise<Product | null> => {
    const result = await db.getFirstAsync(
      `SELECT p.*, c.id as categoryId, c.name as categoryName
       FROM Products p
       JOIN Categories c ON p.categoryId = c.id
       WHERE p.id = ?`,
      [id]
    );
    return result ? mapProduct(result) : null;
  },

  getAll: async (): Promise<Product[]> => {
    const results = await db.getAllAsync(
      `SELECT p.*, c.id as categoryId, c.name as categoryName
       FROM Products p
       JOIN Categories c ON p.categoryId = c.id`
    );
    return results.map(mapProduct);
  },

  update: async (product: Product): Promise<void> => {
    const { id, name, price, imagePath, description, category } = product;
    await db.runAsync(
      'UPDATE Products SET name = ?, price = ?, imagePath = ?, description = ?, categoryId = ? WHERE id = ?',
      [name, price, imagePath, description, category.id, id]
    );
  },

  delete: async (id: number): Promise<void> => {
    await db.runAsync('DELETE FROM Products WHERE id = ?', [id]);
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
    const result = await db.runAsync('INSERT INTO Categories (name) VALUES (?)', [name]);
    return result.lastInsertRowId as number;
  },

  getById: async (id: number): Promise<Category | null> => {
    const result = await db.getFirstAsync('SELECT * FROM Categories WHERE id = ?', [id]);
    return result ? { id: result.id, name: result.name } : null;
  },

  getAll: async (): Promise<Category[]> => {
    return await db.getAllAsync('SELECT * FROM Categories');
  },

  update: async (category: Category): Promise<void> => {
    await db.runAsync('UPDATE Categories SET name = ? WHERE id = ?', [category.name, category.id]);
  },

  delete: async (id: number): Promise<void> => {
    await db.runAsync('DELETE FROM Categories WHERE id = ?', [id]);
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
    let saleId: number;

    try {
      await db.withTransactionAsync(async () => {
        const saleResult = await db.runAsync('INSERT INTO Sales (date) VALUES (?)', [
          saleData.date,
        ]);
        saleId = saleResult.lastInsertRowId as number;

        for (const item of saleData.items) {
          if (!(await ProductRepository.getById(item.productId))) {
            throw new Error(`Invalid product ID: ${item.productId}`);
          }

          await db.runAsync(
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
    try {
      const saleResult = await db.getFirstAsync('SELECT * FROM Sales WHERE id = ?', [id]);
      if (!saleResult) return null;

      const items = await db.getAllAsync(
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
    try {
      const sales = await db.getAllAsync('SELECT * FROM Sales ORDER BY date DESC');

      return Promise.all(
        sales.map(async (sale) => {
          const items = await db.getAllAsync(
            `SELECT ps.productId, ps.quantity, p.name, p.price
             FROM ProductSale ps
             JOIN Products p ON ps.productId = p.id
             WHERE ps.saleId = ?`,
            [sale.id]
          );

          return {
            id: sale.id,
            date: sale.date,
            items: items.map((item) => ({
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
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM ProductSale WHERE saleId = ?', [id]);
        await db.runAsync('DELETE FROM Sales WHERE id = ?', [id]);
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
 * Type representing a sale with full product details
 */
type SaleWithProducts = {
  id: number;
  date: string;
  items: {
    productId: number;
    quantity: number;
    productName: string;
    productPrice: number;
  }[];
};

/**
 * Debug tools for database inspection
 * Methods:
 * - printAllData: Logs complete database contents to console
 */
export const debugDatabase = {
  printAllData: async () => {
    try {
      const data = {
        categories: await db.getAllAsync('SELECT * FROM Categories'),
        products: await db.getAllAsync(`
          SELECT p.*, c.name as categoryName
          FROM Products p
          JOIN Categories c ON p.categoryId = c.id
        `),
        sales: await db.getAllAsync(`
          SELECT s.*,
          GROUP_CONCAT(ps.productId || ':' || ps.quantity, '; ') as items
          FROM Sales s
          LEFT JOIN ProductSale ps ON s.id = ps.saleId
          GROUP BY s.id
        `),
        productSales: await db.getAllAsync(`
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
