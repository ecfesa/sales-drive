import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type SalesGraphProps = {
  labels: string[];
  datasets: number[];
};

export function SalesGraph({ labels, datasets }: SalesGraphProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const windowWidth = Dimensions.get('window').width;

  const handleDataPointClick = (data) => {
    setSelectedData({
      value: data.value,
      index: data.index,
      label: labels[data.index],
    });
    setModalVisible(true);
  };

  return (
    <View className="mb-4 mt-4 rounded-3xl bg-white p-4 shadow-md">
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: datasets,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={windowWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        fromZero
        withShadow={false}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '10',
            strokeWidth: '2',
            stroke: '#007AFF',
            fill: 'white',
          },
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        bezier={false}
        withDots
        withInnerLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withHorizontalLabels
        withVerticalLabels
        onDataPointClick={handleDataPointClick}
        getDotColor={(dataPoint, index) => (index === selectedData?.index ? 'red' : '#007AFF')} // Highlight selected dot
        style={{
          borderRadius: 16,
        }}
      />

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setModalVisible(false)}>
          <Pressable className="w-3/4 rounded-2xl bg-white p-6">
            {selectedData && (
              <>
                <Text className="mb-2 text-lg font-bold">Sales of this Day:</Text>
                <Text className="mb-1">Date: {selectedData.label}</Text>
                <Text className="mb-1">Value: {selectedData.value}</Text>
              </>
            )}
            <TouchableOpacity
              className="mt-4 self-end rounded-lg bg-blue-500 px-4 py-2"
              onPress={() => setModalVisible(false)}>
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
