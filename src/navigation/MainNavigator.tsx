import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookScreen } from '../screens/BookScreen';
import { CourtSelectionScreen } from '../screens/CourtSelectionScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { BookingDetailsScreen } from '../screens/BookingDetailsScreen';
import { RescheduleScreen } from '../screens/RescheduleScreen';
import { RescheduleCourtScreen } from '../screens/RescheduleCourtScreen';
import { RescheduleSummaryScreen } from '../screens/RescheduleSummaryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BottomTabBar } from '../components/navigation';
import { Booking } from '../types';

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
  Success: {
    bookings: Booking[];
    bookingId: string;
    isSingleBooking?: boolean;
  };
  BookingDetails: {
    courtNumber: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Failed' | 'Completed' | 'Cancelled' | 'Rescheduled';
    bookingId: string;
    isPast: boolean;
  };
};

export type BookingsStackParamList = {
  BookingsHome: undefined;
  BookingDetails: {
    courtNumber: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Failed' | 'Completed' | 'Cancelled' | 'Rescheduled';
    bookingId: string;
    isPast: boolean;
  };
  Reschedule: {
    bookingId: string;
  };
  RescheduleCourt: {
    selectedDate: Date;
    selectedSlots: string[];
    bookingId: string;
  };
  RescheduleSummary: {
    bookingId: string;
    oldBooking: {
      courtNumber: string;
      date: string;
      time: string;
    };
    newBooking: {
      courtNumber: string;
      date: string;
      time: string;
    };
  };
  Success: {
    bookings: Booking[];
    bookingId: string;
    isSingleBooking?: boolean;
  };
};

export type MainTabParamList = {
  Book: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const BookStack = createNativeStackNavigator<BookStackParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();
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
      <BookStack.Screen name="Success" component={SuccessScreen} />
      <BookStack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </BookStack.Navigator>
  );
};

const BookingsStackNavigator: React.FC = () => {
  return (
    <BookingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BookingsStack.Screen name="BookingsHome" component={BookingsScreen} />
      <BookingsStack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <BookingsStack.Screen name="Reschedule" component={RescheduleScreen} />
      <BookingsStack.Screen name="RescheduleCourt" component={RescheduleCourtScreen} />
      <BookingsStack.Screen name="RescheduleSummary" component={RescheduleSummaryScreen} />
      <BookingsStack.Screen name="Success" component={SuccessScreen} />
    </BookingsStack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      //detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        //freezeOnBlur: false,
      }}
    >
      <Tab.Screen name="Book" component={BookStackNavigator} />
      <Tab.Screen name="Bookings" component={BookingsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

