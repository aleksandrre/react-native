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
  const isLogedIn = false

  // Mock data - სანამ API არ გვაქვს
  const upcomingBookings: Booking[] = [
    {
      courtNumber: '5',
      date: 'Wed, 15 Oct 2026',
      time: '18:00',
      cancelled: true,
      rescheduled: false,
    },
    {
      courtNumber: '2',
      date: 'Sat, 25 Oct 2026',
      time: '14:00',
      cancelled: false,
      rescheduled: false,
    },
  ];

  const pastBookings: Booking[] = [
    {
      courtNumber: '8',
      date: 'Thu, 1 Oct 2025',
      time: '21:00',
      cancelled: true,
      rescheduled: false,
    },
    {
      courtNumber: '3',
      date: 'Fri, 17 Dec 2025',
      time: '10:00',
      cancelled: false,
      rescheduled: false,
    },
  ];

  const handleUpcomingBookingPress = (booking: Booking) => {
    // Generate mock booking ID
    const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();

    // Determine status based on booking state
    let status: 'Confirmed' | 'Cancelled' | 'Rescheduled' = 'Confirmed';
    if (booking.cancelled) {
      status = 'Cancelled';
    } else if (booking.rescheduled) {
      status = 'Rescheduled';
    }

    navigation.navigate('BookingDetails', {
      courtNumber: booking.courtNumber,
      date: booking.date,
      time: booking.time,
      status: status,
      bookingId: bookingId,
      isPast: false,
    });
  };

  const handlePastBookingPress = (booking: Booking) => {
    // Generate mock booking ID
    const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();

    // Determine status based on booking state
    let status: 'Completed' | 'Cancelled' | 'Rescheduled' = 'Completed';
    if (booking.cancelled) {
      status = 'Cancelled';
    } else if (booking.rescheduled) {
      status = 'Rescheduled';
    }

    navigation.navigate('BookingDetails', {
      courtNumber: booking.courtNumber,
      date: booking.date,
      time: booking.time,
      status: status,
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

          {!isLogedIn ? (
            <>
              <Text style={styles.sectionTitle}>Become a member</Text>
              <Text style={styles.emptyText}>
                Please log in to see your upcoming and past bookings!
              </Text>

              {/* ღილაკების კონტეინერი */}
              <CustomButton
                style={{ marginBottom: 10 }}
                title="Log In"
                onPress={() => {
                  // გადავდივართ Auth სთექის Login გვერდზე
                  navigation.getParent()?.navigate('Auth', { screen: 'Login' });
                }}
              />

              <CustomButton
                title="Register"
                variant="secondary" // მეორე ღილაკი იყოს განსხვავებული სტილის
                onPress={() => {
                  // გადავდივართ Auth სთექის Register გვერდზე
                  navigation.getParent()?.navigate('Auth', { screen: 'Register' });
                }}
              />
            </>
          ) : (
            <>
              {/* Upcoming Section */}
              {upcomingBookings.length > 0 ? (
                <CourtCardList title="Upcoming" bookings={upcomingBookings} onBookingPress={handleUpcomingBookingPress} />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    You have no upcoming bookings. Reserve a court now and enjoy some Padel!
                  </Text>
                </View>
              )}

              {/* Make a new booking button - shown in scroll when there are past bookings */}
              {pastBookings.length > 0 && (
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="Make a new booking"
                    onPress={handleMakeNewBooking}
                  />
                </View>
              )}

              {/* Past Section */}

              {pastBookings.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Past</Text>

                  <CourtCardList title="" bookings={pastBookings} onBookingPress={handlePastBookingPress} />

                </>
              )}
            </>
          )

          }

        </ScrollView>

        {pastBookings.length === 0 && (
          <View style={styles.fixedButtonContainer}>
            <CustomButton
              title="Make a new booking"
              onPress={handleMakeNewBooking}
            />
          </View>
        )}
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
    lineHeight: 23,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.white,
    marginBottom: 10,
  },
  emptyContainer: {
  },
  emptyText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: typography.fontFamily,
    color: colors.white,
    textAlign: 'left',
    marginBottom: 10,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  }
});

