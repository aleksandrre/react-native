import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CourtCardList, PageLayout, ScreenWrapper, ImageHeader, CustomButton } from '../components';
import { Booking } from '../types';
import { colors, typography } from '../theme';
import cover from '../../assets/cover.png';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BookingsStackParamList } from '../navigation/MainNavigator';
import { useAuthStore } from '../store/authStore';

export const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<BookingsStackParamList>>();
  const { t } = useTranslation();
  
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

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
    const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();

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
    const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();

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
    navigation.navigate('Book' as never);
  };

  return (
    <PageLayout>
      <ImageHeader
        title={t('bookings.title')}
        imageSource={cover}
      />
      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {!isAuthenticated ? (
            <>
              <Text style={styles.sectionTitle}>{t('bookings.becomeMember')}</Text>
              <Text style={styles.emptyText}>
                {t('bookings.pleaseLogIn')}
              </Text>

              <CustomButton
                style={{ marginBottom: 10 }}
                title={t('bookings.logIn')}
                onPress={() => {
                  navigation.getParent()?.navigate('Auth', { screen: 'Login' });
                }}
              />

              <CustomButton
                title={t('bookings.register')}
                variant="secondary"
                onPress={() => {
                  navigation.getParent()?.navigate('Auth', { screen: 'Register' });
                }}
              />
            </>
          ) : (
            <>
              {upcomingBookings.length > 0 ? (
                <CourtCardList title={t('bookings.upcoming')} bookings={upcomingBookings} onBookingPress={handleUpcomingBookingPress} />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {t('bookings.noUpcoming')}
                  </Text>
                </View>
              )}

              {pastBookings.length > 0 && (
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title={t('bookings.makeNewBooking')}
                    onPress={handleMakeNewBooking}
                  />
                </View>
              )}

              {pastBookings.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{t('bookings.past')}</Text>
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
              title={t('bookings.makeNewBooking')}
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
