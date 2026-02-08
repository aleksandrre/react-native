import React from 'react';
import { StyleSheet } from 'react-native';
import { CourtCardList, PageLayout, ScreenWrapper, ImageHeader } from '../components';
import { Booking } from '../types';
import cover from '../../assets/cover.png';

export const BookingsScreen: React.FC = () => {
  const bookings: Booking[] = [
    {
      courtNumber: '3',
      date: 'Fri, 17 Dec 2025',
      time: '10:00',
    },
    {
      courtNumber: '5',
      date: 'Sat, 18 Dec 2025',
      time: '14:30',
    },
  ];

  return (
    <PageLayout>
      <ImageHeader
        title="Bookings"
        imageSource={cover}
      />
      <ScreenWrapper>
        <CourtCardList title="My Bookings" bookings={bookings} />
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({});

