import { useState } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';

import { seedDatabase } from '../../database/seedDatabase';
import {
  ProductRepository,
  CategoryRepository,
  SaleRepository,
  debugDatabase,
  resetDatabase,
} from '../../database/sql-implementation';

const TestingScreen = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [, setTestProductId] = useState<number | null>(null);
  const [, setTestCategoryId] = useState<number | null>(null);
  const [, setTestSaleId] = useState<number | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  // Product CRUD Tests
  const testProductCRUD = async () => {
    try {
      // Create
      const newId = await ProductRepository.create({
        name: 'Test Product',
        price: 99.99,
        imagePath: 'images/test.jpg',
        description: 'Test description',
        category: { id: 1, name: 'Electronics' },
      });
      setTestProductId(newId);
      addLog(`Product created: ${newId}`);

      // Read
      const product = await ProductRepository.getById(newId);
      addLog(`Product fetched: ${JSON.stringify(product)}`);

      // Update
      await ProductRepository.update({
        ...product!,
        name: 'Updated Test Product',
        price: 129.99,
      });
      addLog('Product updated');

      // Delete
      await ProductRepository.delete(newId);
      addLog('Product deleted');
      setTestProductId(null);
    } catch (error) {
      addLog(`Product CRUD error: ${error}`);
    }
  };

  // Category CRUD Tests
  const testCategoryCRUD = async () => {
    try {
      // Create
      const newId = await CategoryRepository.create('Test Category');
      setTestCategoryId(newId);
      addLog(`Category created: ${newId}`);

      // Read
      const category = await CategoryRepository.getById(newId);
      addLog(`Category fetched: ${JSON.stringify(category)}`);

      // Update
      await CategoryRepository.update({ id: newId, name: 'Updated Category' });
      addLog('Category updated');

      // Delete
      await CategoryRepository.delete(newId);
      addLog('Category deleted');
      setTestCategoryId(null);
    } catch (error) {
      addLog(`Category CRUD error: ${error}`);
    }
  };

  // Sale CRUD Tests
  const testSaleCRUD = async () => {
    try {
      //Create
      const now = new Date();
      const formattedDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-') + ' ' + [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0'),
      ].join(':');

      const newId = await SaleRepository.create({
        date: formattedDate,
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      });
      setTestSaleId(newId);
      addLog(`Sale created: ${newId}`);

      // Read
      const sale = await SaleRepository.getById(newId);
      addLog(`Sale fetched: ${JSON.stringify(sale)}`);

      // Delete
      await SaleRepository.delete(newId);
      addLog('Sale deleted');
      setTestSaleId(null);
    } catch (error) {
      addLog(`Sale CRUD error: ${error}`);
    }
  };

  // Special Cases Tests
  const testGetAllProducts = async () => {
    try {
      const products = await ProductRepository.getAll();
      addLog(`All products: ${JSON.stringify(products)}`);
    } catch (error) {
      addLog(`Get all products error: ${error}`);
    }
  };

  const testGetAllSales = async () => {
    try {
      const sales = await SaleRepository.getAll();
      addLog(`All sales: ${JSON.stringify(sales)}`);
    } catch (error) {
      addLog(`Get all sales error: ${error}`);
    }
  };

  const testGetAllCategories = async () => {
    try {
      const categories = await CategoryRepository.getAll();
      addLog(`All categories: ${JSON.stringify(categories)}`);
    } catch (error) {
      addLog(`Get all sales error: ${error}`);
    }
  };

  const handleResetDatabase = async () => {
    try {
      await resetDatabase();

      const formattedData = await debugDatabase.printAllData();

      const lines = formattedData.split('\n').reverse();
      lines.forEach(line => addLog(line));

      addLog('Database reset complete');
      setTestProductId(null);
      setTestCategoryId(null);
      setTestSaleId(null);
    } catch (error) {
      addLog(`Reset error: ${error}`);
    }
  };

  const handlePrintDatabase = async () => {
    try {
      addLog("Fetching database contents...");

      const formattedData = await debugDatabase.printAllData();

      // Split the formatted data into lines and add each one to the log
      const lines = formattedData.split('\n').reverse();
      lines.forEach(line => addLog(line));

      addLog("Finished printing database contents...");

    } catch (error) {
      addLog(`Error printing database: ${error.message}`);
    }
  };

  const handleSeedDatabase = async () => {
  try {
    addLog("🌱 Starting database seeding process...");
    addLog("====================================");

    const seedingResult = await seedDatabase();

    if (seedingResult.success) {
      addLog(seedingResult.logs);
    } else {
      addLog("Failed:", seedingResult.error);
    }

    addLog("====================================");
    addLog("🌱 Seeding Finished!!!");

  } catch (error) {
    addLog(`❌ Seeding failed: ${error.message}`);
  }
};

  const handleClearLogs = () => {
  setLogs([]);
};
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} className="bg-gray-50">
      <Text className="text-2xl font-bold text-indigo-800 mb-4">Database Testing</Text>

      {/* Product Tests */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <Text className="text-lg font-semibold text-indigo-700 mb-3">Product Tests</Text>
        <View className="space-y-2">
          <Button
            title="Test Product CRUD"
            onPress={testProductCRUD}
            color="#4f46e5"
          />
          <Button
            title="Get All Products"
            onPress={testGetAllProducts}
            color="#6366f1"
          />
        </View>
      </View>

      {/* Category Tests */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <Text className="text-lg font-semibold text-indigo-700 mb-3">Category Tests</Text>
        <View className="space-y-2">
          <Button
            title="Test Category CRUD"
            onPress={testCategoryCRUD}
            color="#4f46e5"
          />
          <Button
            title="Get All Categories"
            onPress={testGetAllCategories}
            color="#6366f1"
          />
        </View>
      </View>

      {/* Sale Tests */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <Text className="text-lg font-semibold text-indigo-700 mb-3">Sale Tests</Text>
        <View className="space-y-2">
          <Button
            title="Test Sale CRUD"
            onPress={testSaleCRUD}
            color="#4f46e5"
          />
          <Button
            title="Get All Sales"
            onPress={testGetAllSales}
            color="#6366f1"
          />
        </View>
      </View>

      {/* Utilities */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <Text className="text-lg font-semibold text-indigo-700 mb-3">Utilities</Text>
        <View className="space-y-2">
          <Button
            title="Seed Database"
            onPress={handleSeedDatabase}
            color="#7c3aed"
          />
          <Button
            title="Reset Database"
            onPress={handleResetDatabase}
            color="#8b5cf6"
          />
          <Button
            title="Print Database"
            onPress={handlePrintDatabase}
            color="#a78bfa"
          />
        </View>
      </View>

      {/* Logs */}
      <View className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-indigo-700">Logs:</Text>
          <TouchableOpacity
            onPress={handleClearLogs}
            className="px-3 py-1 bg-indigo-100 rounded-md"
          >
            <Text className="text-indigo-600 text-sm font-medium">Clear</Text>
          </TouchableOpacity>
        </View>
        <View className="space-y-1">
          {logs.map((log, index) => (
            <Text key={index} className="text-xs text-gray-600 font-mono">
              {log}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default TestingScreen;
