 import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Alert } from 'react-native';
import {
  ProductRepository,
  CategoryRepository,
  SaleRepository,
  debugDatabase,
  resetDatabase
} from '../../database/sql-implementation';
import { seedDatabase } from '../../database/seedDatabase';

const TestingScreen = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [testProductId, setTestProductId] = useState<number | null>(null);
  const [testCategoryId, setTestCategoryId] = useState<number | null>(null);
  const [testSaleId, setTestSaleId] = useState<number | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
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
        category: { id: 1, name: 'Electronics' }
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
        price: 129.99
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
      // Create
      const newId = await SaleRepository.create({
        date: new Date().toISOString(),
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
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
      addLog('Database reset complete');
      setTestProductId(null);
      setTestCategoryId(null);
      setTestSaleId(null);
    } catch (error) {
      addLog(`Reset error: ${error}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Database Testing</Text>

      {/* Product Tests */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Product Tests</Text>
        <Button title="Test Product CRUD" onPress={testProductCRUD} />
        <Button title="Get All Products" onPress={testGetAllProducts} />
      </View>

      {/* Category Tests */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Category Tests</Text>
        <Button title="Test Category CRUD" onPress={testCategoryCRUD} />
        <Button title="Get All Categories" onPress={testGetAllCategories} />
      </View>

      {/* Sale Tests */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Sale Tests</Text>
        <Button title="Test Sale CRUD" onPress={testSaleCRUD} />
        <Button title="Get All Sales" onPress={testGetAllSales} />
      </View>

      {/* Utilities */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Utilities</Text>
        <Button title="Seed Database" onPress={() => seedDatabase().then(() => addLog('Database seeded'))} />
        <Button title="Reset Database" onPress={handleResetDatabase} />
        <Button title="Print Database" onPress={() => debugDatabase.printAllData()} />
      </View>

      {/* Logs */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Logs:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={{ fontSize: 10, color: '#666' }}>{log}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default TestingScreen;
