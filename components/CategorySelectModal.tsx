import { AntDesign } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';

import { Category } from '../types';

interface CategorySelectModalProps {
  visible: boolean;
  categories: Category[];
  initialCategory: Category;
  onClose: () => void;
  onSave: (categoryOrName: Category | string) => void;
}

export default function CategorySelectModal({
  visible,
  categories,
  initialCategory,
  onClose,
  onSave,
}: CategorySelectModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newlyAddedCategory, setNewlyAddedCategory] = useState<string | null>(null);

  // Update internal state when initialCategory changes or modal becomes visible
  useEffect(() => {
    if (visible) {
      setSelectedCategory(initialCategory);
      setNewCategoryName('');
      setNewlyAddedCategory(null);
    }
  }, [initialCategory, visible]);

  const handleSave = () => {
    if (newlyAddedCategory) {
      onSave(newlyAddedCategory);
    } else if (selectedCategory) {
      onSave(selectedCategory);
    }
  };

  const handleAddNewCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
      // Check if category already exists
      const existingCategory = categories.find(
        (category) => category.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existingCategory) {
        // If category exists, select it instead of creating a new one
        setSelectedCategory(existingCategory);
        setNewlyAddedCategory(null);
      } else {
        // Otherwise add the new category
        setNewlyAddedCategory(trimmedName);
        setSelectedCategory(null);
      }
      setNewCategoryName('');
      setNewCategoryModalVisible(false);
    }
  };

  const renderCategoryOption = () => {
    if (newlyAddedCategory) {
      // Show the newly added category with green styling and plus icon
      return (
        <TouchableOpacity
          className="mb-2 rounded-md border border-dashed border-green-600 bg-green-100 p-3"
          onPress={() => {
            setSelectedCategory(null);
            setNewCategoryModalVisible(true);
          }}>
          <View className="flex-row items-center">
            <AntDesign name="plus" size={16} color="green" />
            <Text className="ml-2 font-medium text-green-800">{newlyAddedCategory}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Show the default "New Category" button
      return (
        <TouchableOpacity
          className="mb-2 rounded-md bg-green-500 p-3"
          onPress={() => setNewCategoryModalVisible(true)}>
          <Text className="flex-row items-center font-medium text-white">
            <AntDesign name="plus" size={16} color="white" /> New Category
          </Text>
        </TouchableOpacity>
      );
    }
  };

  // New Category Modal
  const renderNewCategoryModal = () => (
    <Modal
      transparent
      visible={newCategoryModalVisible}
      animationType="fade"
      onRequestClose={() => setNewCategoryModalVisible(false)}>
      <Pressable
        className="absolute inset-0 bg-black/50"
        onPress={() => setNewCategoryModalVisible(false)}
      />
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-[80%] rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-green-800">Add New Category</Text>

          <TextInput
            className="mb-4 rounded-md border border-gray-300 p-3 font-medium"
            placeholder="Enter new category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            autoFocus
          />

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="rounded-md bg-gray-200 px-6 py-2"
              onPress={() => setNewCategoryModalVisible(false)}>
              <Text className="font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-md px-6 py-2 ${newCategoryName.trim() ? 'bg-green-500' : 'bg-green-300'}`}
              onPress={handleAddNewCategory}
              disabled={!newCategoryName.trim()}>
              <Text className="font-medium text-white">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* Fills the entire screen with a clickable overlay */}
      <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />
      {/* Fills in the entire screen */}
      <View className="flex-1 items-center justify-center p-4">
        {/* Modal, 90% of the screen width */}
        <View className="w-[90%] rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-blue-800">Select Product Category</Text>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            className="mb-4 max-h-60"
            ListHeaderComponent={renderCategoryOption()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`mb-2 rounded-md p-3 ${
                  selectedCategory?.id === item.id && !newlyAddedCategory
                    ? 'border border-blue-500 bg-blue-100'
                    : 'bg-gray-50'
                }`}
                onPress={() => {
                  setSelectedCategory(item);
                  setNewlyAddedCategory(null);
                }}>
                <Text
                  className={`font-medium ${
                    selectedCategory?.id === item.id && !newlyAddedCategory
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View className="flex-row justify-between">
            <TouchableOpacity className="rounded-md bg-gray-200 px-6 py-2" onPress={onClose}>
              <Text className="font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-md px-6 py-2 ${
                selectedCategory || newlyAddedCategory ? 'bg-blue-500' : 'bg-blue-300'
              }`}
              onPress={handleSave}
              disabled={!selectedCategory && !newlyAddedCategory}>
              <Text className="font-medium text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {renderNewCategoryModal()}
    </Modal>
  );
}
