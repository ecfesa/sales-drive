import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  console.log('re-rendering tab layout');
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
        translucent={false}
        backgroundColor="white"
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          headerShown: false,
        }}>
        <Tabs.Screen
          name="(products)"
          options={{
            title: 'Products',
            tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(sales)"
          options={{
            title: 'Sales',
            tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="testing"
          options={{
            title: 'Testing',
            tabBarIcon: ({ color }) => <TabBarIcon name="flask" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
