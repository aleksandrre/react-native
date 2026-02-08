import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CourtCard } from './CourtCard';
import { Booking } from '../../types';
import { colors, typography } from '../../theme';

interface CourtCardListProps {
  title: string;
  bookings: Booking[];
}

export const CourtCardList: React.FC<CourtCardListProps> = ({ title, bookings }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.cardsContainer}>
        {bookings.map((booking, index) => (
          <CourtCard
            key={index}
            courtNumber={booking.courtNumber}
            date={booking.date}
            time={booking.time}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
    fontFamily: typography.fontFamilyBold,
  },
  cardsContainer: {
    width: '100%',
    gap: 12,
  },
});


