import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookScreen } from '../screens/BookScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BottomTabBar } from '../components/navigation';

export type MainTabParamList = {
  Book: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        freezeOnBlur: false,
      }}
    >
      <Tab.Screen name="Book" component={BookScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

