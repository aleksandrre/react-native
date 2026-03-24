import React from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CourtCardList, PageLayout, ScreenWrapper, ImageHeader, CustomButton } from '../components';
import { Booking } from '../types';
import { colors, typography } from '../theme';
import cover from '../../assets/cover.png';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { BookingsStackParamList } from '../navigation/MainNavigator';
import { useAuthStore } from '../store/authStore';
import { useBookings } from '../hooks';

export const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<BookingsStackParamList>>();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { upcoming: upcomingBookings, past: pastBookings, isLoading, isError, refetch } = useBookings(isAuthenticated);

  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) refetch();
    }, [isAuthenticated])
  );

  const handleUpcomingBookingPress = (booking: Booking & { id?: string }) => {
    let status: 'Confirmed' | 'Cancelled' | 'Rescheduled' = 'Confirmed';
    if (booking.cancelled) status = 'Cancelled';
    else if (booking.rescheduled) status = 'Rescheduled';

    navigation.navigate('BookingDetails', {
      courtNumber: booking.courtNumber,
      rawDate: booking.rawDate,
      time: booking.time,
      status,
      bookingId: booking.id ?? '',
      isPast: false,
    });
  };

  const handlePastBookingPress = (booking: Booking & { id?: string }) => {
    let status: 'Completed' | 'Cancelled' | 'Rescheduled' = 'Completed';
    if (booking.cancelled) status = 'Cancelled';
    else if (booking.rescheduled) status = 'Rescheduled';

    navigation.navigate('BookingDetails', {
      courtNumber: booking.courtNumber,
      rawDate: booking.rawDate,
      time: booking.time,
      status,
      bookingId: booking.id ?? '',
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
              <Text style={styles.emptyText}>{t('bookings.pleaseLogIn')}</Text>
              <CustomButton
                style={{ marginBottom: 10 }}
                title={t('bookings.logIn')}
                onPress={() => navigation.getParent()?.navigate('Auth', { screen: 'Login', params: { fromApp: true } })}
              />
              <CustomButton
                title={t('bookings.register')}
                variant="secondary"
                onPress={() => navigation.getParent()?.navigate('Auth', { screen: 'Register', params: { fromApp: true } })}
              />
            </>
          ) : isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : isError ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('bookings.loadError')}</Text>
              <CustomButton title={t('common.retry')} onPress={() => refetch()} />
            </View>
          ) : (
            <>
              {upcomingBookings.length > 0 ? (
                <CourtCardList
                  title={t('bookings.upcoming')}
                  bookings={upcomingBookings}
                  onBookingPress={handleUpcomingBookingPress}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('bookings.noUpcoming')}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <CustomButton title={t('bookings.makeNewBooking')} onPress={handleMakeNewBooking} />
              </View>

              {pastBookings.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{t('bookings.past')}</Text>
                  <CourtCardList title="" bookings={pastBookings} onBookingPress={handlePastBookingPress} />
                </>
              )}
            </>
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
  },
  loader: {
    marginTop: 40,
  },
});
