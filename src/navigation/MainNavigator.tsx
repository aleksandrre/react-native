import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookScreen } from '../screens/BookScreen';
import { CourtSelectionScreen } from '../screens/CourtSelectionScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BottomTabBar } from '../components/navigation';

export type BookStackParamList = {
  BookHome: undefined;
  CourtSelection: {
    selectedDate: Date;
    selectedSlots: string[];
  };
  Summary: {
    selectedDate: Date;
    selectedSlots: string[];
    selectedCourts: { [timeSlot: string]: string | null };
  };
};

export type MainTabParamList = {
  Book: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const BookStack = createNativeStackNavigator<BookStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const BookStackNavigator: React.FC = () => {
  return (
    <BookStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BookStack.Screen name="BookHome" component={BookScreen} />
      <BookStack.Screen name="CourtSelection" component={CourtSelectionScreen} />
      <BookStack.Screen name="Summary" component={SummaryScreen} />
    </BookStack.Navigator>
  );
};

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
      <Tab.Screen name="Book" component={BookStackNavigator} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

