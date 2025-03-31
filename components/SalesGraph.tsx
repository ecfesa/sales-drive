import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { LineGraph } from 'react-native-graph';
import type { GraphPoint } from 'react-native-graph';

type SalesGraphProps = {
  labels: string[];
  datasets: number[];
};

interface SelectedData {
  value: number;
  index: number;
  label: string;
}

export function SalesGraph({ labels, datasets }: SalesGraphProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [points, setPoints] = useState<GraphPoint[]>([]);

  useEffect(() => {
    // Convert datasets and labels to points format required by react-native-graph
    if (datasets.length > 0 && labels.length > 0) {
      // Create points for the graph, using timestamps to ensure proper ordering
      const now = new Date();
      const basePoints = datasets.map((value, index) => {
        // Create date objects that are N days apart to ensure proper spacing
        const dateObj = new Date(now);
        dateObj.setDate(now.getDate() - (datasets.length - 1 - index));

        return {
          value: Math.max(0.1, value), // Avoid zero values
          date: dateObj,
        };
      });

      // Create additional points to make the line appear straight
      const graphPoints: GraphPoint[] = [];
      for (let i = 0; i < basePoints.length - 1; i++) {
        const current = basePoints[i];
        const next = basePoints[i + 1];

        // Add the current point
        graphPoints.push(current);

        // Create 3 intermediate points for straight line segments
        // This works because the intermediate points follow a straight line
        const timeInterval = (next.date.getTime() - current.date.getTime()) / 4;
        const valueInterval = (next.value - current.value) / 4;

        for (let j = 1; j < 4; j++) {
          const intermediateDate = new Date(current.date.getTime() + timeInterval * j);
          const intermediateValue = current.value + valueInterval * j;

          graphPoints.push({
            value: intermediateValue,
            date: intermediateDate,
          });
        }
      }

      // Add the last base point
      if (basePoints.length > 0) {
        graphPoints.push(basePoints[basePoints.length - 1]);
      }

      setPoints(graphPoints);
    }
  }, [datasets, labels]);

  const handlePointSelected = (point: GraphPoint) => {
    // We need to find the closest original data point
    // since we've added intermediate points
    if (points.length === 0 || datasets.length === 0) return;

    // Find the point with the closest timestamp
    let closestIndex = 0;
    let minTimeDiff = Number.MAX_VALUE;

    for (let i = 0; i < points.length; i++) {
      const timeDiff = Math.abs(points[i].date.getTime() - point.date.getTime());
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestIndex = i;
      }
    }

    // Calculate the original data index
    // For each original point, we add 3 intermediate points (so 4 total per segment)
    // We need to calculate which original point this is closest to
    const segmentIndex = Math.floor(closestIndex / 4);
    const remainingPoints = closestIndex % 4;

    // If remainingPoints is 0, it's an original point
    // If it's 1, 2, or 3, it's one of the intermediate points
    // and we need to decide which original point to map it to
    let originalIndex;

    if (remainingPoints < 2) {
      // Closer to the earlier point
      originalIndex = segmentIndex;
    } else {
      // Closer to the later point
      originalIndex = segmentIndex + 1;
    }

    // Make sure the index is within bounds
    const boundedIndex = Math.min(Math.max(0, originalIndex), labels.length - 1);

    if (boundedIndex >= 0 && boundedIndex < labels.length) {
      setSelectedData({
        value: datasets[boundedIndex],
        index: boundedIndex,
        label: labels[boundedIndex],
      });
      setModalVisible(true);
    }
  };

  // Custom Axis label components
  const BottomAxisLabel = () => {
    return (
      <View style={styles.bottomAxisContainer}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.bottomAxisLabel}>
            {label}
          </Text>
        ))}
      </View>
    );
  };

  // Y-axis ticks (left side)
  const LeftAxisLabel = () => {
    // Create a simple y-axis label with min, max and middle values
    const maxValue = Math.max(...datasets, 1);
    const minValue = 0;
    const middleValue = Math.round(maxValue / 2);

    return (
      <View style={styles.leftAxisContainer}>
        <Text style={styles.leftAxisLabel}>{maxValue}</Text>
        <Text style={styles.leftAxisLabel}>{middleValue}</Text>
        <Text style={styles.leftAxisLabel}>{minValue}</Text>
      </View>
    );
  };

  if (points.length === 0) {
    return (
      <View
        className="my-4 items-center justify-center bg-white pt-4 shadow-md"
        style={{ height: 220 }}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View className="my-4 rounded-lg bg-white py-4 pt-4 shadow-md">
      <View className="p-1">
        <Text className="mb-2 text-center text-xs text-gray-500">Sales Count History</Text>
      </View>

      <View style={styles.graphContainerWithAxes}>
        <LeftAxisLabel />

        <View style={styles.graphContainer}>
          <LineGraph
            style={styles.graph}
            points={points}
            animated
            enablePanGesture
            onPointSelected={handlePointSelected}
            color="#007AFF"
          />
        </View>
      </View>

      <BottomAxisLabel />

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

const styles = StyleSheet.create({
  graphContainerWithAxes: {
    flexDirection: 'row',
    height: 200,
    marginHorizontal: 5,
  },
  graphContainer: {
    flex: 1,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  graph: {
    flex: 1,
  },
  leftAxisContainer: {
    width: 30,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  leftAxisLabel: {
    fontSize: 10,
    color: '#666',
    marginRight: 5,
  },
  bottomAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 5,
  },
  bottomAxisLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});
