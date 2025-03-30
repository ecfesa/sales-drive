import { AntDesign } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DescriptionEditModalProps {
  visible: boolean;
  initialDescription: string;
  onClose: () => void;
  onSave: (description: string) => void;
}

export default function DescriptionEditModal({
  visible,
  initialDescription,
  onClose,
  onSave,
}: DescriptionEditModalProps) {
  const [description, setDescription] = useState('');

  // Update internal state when initialDescription changes or modal becomes visible
  useEffect(() => {
    if (visible) {
      setDescription(initialDescription);
    }
  }, [initialDescription, visible]);

  const handleSave = () => {
    onSave(description);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-[90%] rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-blue-800">Edit Product Description</Text>
          <TextInput
            className="mb-4 h-60 rounded-lg border border-gray-300 bg-gray-50 p-2 text-base text-gray-700"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            autoFocus
            style={{ textAlignVertical: 'top' }}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity className="rounded-md bg-gray-200 px-6 py-2" onPress={onClose}>
              <Text className="font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-md bg-blue-500 px-6 py-2" onPress={handleSave}>
              <Text className="font-medium text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
