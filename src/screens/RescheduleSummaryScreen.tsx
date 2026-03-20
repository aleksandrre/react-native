import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PageLayout, ScreenWrapper, Header, CustomButton, ReservationTimer, CourtCard } from '../components';
import { colors, typography } from '../theme';
import { useRescheduleBooking, useReservationTimer } from '../hooks';

type RouteParams = {
    RescheduleSummary: {
        bookingId: string;
        oldBooking: { courtNumber: string; date: string; time: string };
        newBooking: { courtNumber: string; date: string; time: string };
        newCourtId: number;
        newDateForApi: string;
    };
};

type RescheduleSummaryRouteProp = RouteProp<RouteParams, 'RescheduleSummary'>;

export const RescheduleSummaryScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RescheduleSummaryRouteProp>();
    const { t } = useTranslation();

    const { bookingId, oldBooking, newBooking, newCourtId, newDateForApi } = route.params;

    const { formatted: reservationTime, isExpired } = useReservationTimer(5 * 60);
    const { mutate: reschedule, isPending } = useRescheduleBooking();

    const handleReschedule = () => {
        if (isExpired) return;

        reschedule(
            {
                bookingId,
                court_id: newCourtId,
                date: newDateForApi,
                time: newBooking.time,
                use_credit: false,
            },
            {
                onSuccess: (data) => {
                    const newBookingId = String(data.booking_id);
                    navigation.navigate('Success', {
                        bookings: [{
                            courtNumber: newBooking.courtNumber,
                            date: newBooking.date,
                            time: newBooking.time,
                        }],
                        bookingId: newBookingId,
                        bookingIds: [newBookingId],
                        isSingleBooking: true,
                    });
                },
                onError: () => {
                    Alert.alert(t('common.error'), t('rescheduleSummary.rescheduleError'));
                },
            }
        );
    };

    return (
        <PageLayout>
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                {!isExpired && <ReservationTimer formattedTime={reservationTime} />}

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>{t('rescheduleSummary.summary')}</Text>

                    <Text style={styles.label}>{t('rescheduleSummary.bookingToChange')}</Text>
                    <View style={styles.cardContainer}>
                        <CourtCard
                            courtNumber={oldBooking.courtNumber}
                            date={oldBooking.date}
                            time={oldBooking.time}
                            cancelled={true}
                        />
                    </View>

                    <Text style={styles.label}>{t('rescheduleSummary.newBookingTime')}</Text>
                    <View style={styles.cardContainer}>
                        <CourtCard
                            courtNumber={newBooking.courtNumber}
                            date={newBooking.date}
                            time={newBooking.time}
                        />
                    </View>

                    {isExpired && (
                        <Text style={styles.expiredText}>{t('summary.reservationExpired')}</Text>
                    )}
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title={t('rescheduleSummary.rescheduleToThisTime')}
                        onPress={handleReschedule}
                        disabled={isPending || isExpired}
                        variant="primary"
                    />
                </View>
            </ScreenWrapper>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        marginBottom: 10,
    },
    cardContainer: {
        marginBottom: 20,
    },
    expiredText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: '#FF4444',
        textAlign: 'center',
        marginTop: 8,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
});
