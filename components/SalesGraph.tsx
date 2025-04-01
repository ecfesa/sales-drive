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
        <Text className="mb-2 font-bold text-center text-xl text-gray-500">Sales Count History</Text>
      </View>

      <View style={styles.graphContainerWithAxes}>
        <LeftAxisLabel />

        <View style={styles.graphContainer}>
          <LineGraph
            style={styles.graph}
            points={points}
            animated
            enablePanGesture
            color="#007AFF"
          />
        </View>
      </View>

      <BottomAxisLabel />

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
