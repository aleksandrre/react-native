import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { CourtCard } from './CourtCard';
import { Booking } from '../../types';
import { colors, typography } from '../../theme';

interface CourtCardListProps {
  title: string;
  bookings: Booking[];
  style?: ViewStyle;
  onBookingPress?: (booking: Booking, index: number) => void;
}

export const CourtCardList: React.FC<CourtCardListProps> = ({ title, bookings, style, onBookingPress }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.cardsContainer}>
        {bookings.map((booking, index) => (
          <CourtCard
            key={index}
            courtNumber={booking.courtNumber}
            date={booking.date}
            time={booking.time}
            onPress={onBookingPress ? () => onBookingPress(booking, index) : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
    fontFamily: typography.fontFamilyBold,
  },
  cardsContainer: {
    width: '100%',
    gap: 12,
  },
});


