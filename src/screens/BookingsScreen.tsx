import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { CourtCardList, PageLayout, ScreenWrapper, ImageHeader, CustomButton } from '../components';
import { Booking } from '../types';
import { colors, typography } from '../theme';
import cover from '../../assets/cover.png';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BookingsStackParamList } from '../navigation/MainNavigator';

export const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<BookingsStackParamList>>();

  // Mock data - სანამ API არ გვაქვს
  const upcomingBookings: Booking[] = [
    {
      courtNumber: '3',
      date: 'Fri, 26 Dec 2025',
      time: '12:00',
    },
    {
      courtNumber: '1',
      date: 'Tue, 4 Jan 2026',
      time: '20:00',
    },
  ];

  const pastBookings: Booking[] = [
    {
      courtNumber: '8',
      date: 'Thu, 1 Oct 2025',
      time: '21:00',
    },
    {
      courtNumber: '3',
      date: 'Fri, 17 Dec 2025',
      time: '10:00',
    },
  ];

  const handleUpcomingBookingPress = (booking: Booking) => {
    // Generate mock booking ID
    const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();
    navigation.navigate('BookingDetails', {
      courtNumber: booking.courtNumber,
      date: booking.date,
      time: booking.time,
      status: 'Confirmed',
      bookingId: bookingId,
      isPast: false,
    });
  };

  const handlePastBookingPress = (booking: Booking) => {
    // Generate mock booking ID
    const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();
    navigation.navigate('BookingDetails', {
      courtNumber: booking.courtNumber,
      date: booking.date,
      time: booking.time,
      status: 'Completed',
      bookingId: bookingId,
      isPast: true,
    });
  };

  const handleMakeNewBooking = () => {
    // Navigate to Book screen
    navigation.navigate('Book' as never);
  };

  return (
    <PageLayout>
      <ImageHeader
        title="Bookings"
        imageSource={cover}
      />
      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Upcoming Section */}

          {upcomingBookings.length > 0 ? (
            <CourtCardList style={styles.container} title="Upcoming" bookings={upcomingBookings} onBookingPress={handleUpcomingBookingPress} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You have no upcoming bookings. Reserve a court now and enjoy some Padel!
              </Text>
            </View>
          )}

          {/* Make a new booking button */}
          <View>
            <CustomButton
              style={{ marginBottom: 10 }}
              title="Make a new booking"
              onPress={handleMakeNewBooking}
            />
          </View>

          {/* Past Section */}

          {pastBookings.length > 0 && (
            <CourtCardList title="Past" bookings={pastBookings} onBookingPress={handlePastBookingPress} />
          )}
        </ScrollView>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.white,
    marginBottom: 10,
    marginTop: 10,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: typography.fontFamily,
    color: colors.lightGray,
    textAlign: 'center',
  },
});

