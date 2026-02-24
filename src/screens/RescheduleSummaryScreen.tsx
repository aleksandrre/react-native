import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PageLayout, ScreenWrapper, Header, CustomButton, ReservationTimer, CourtCard } from '../components';
import { colors, typography } from '../theme';
import { format } from 'date-fns';

type RouteParams = {
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
};

type RescheduleSummaryRouteProp = RouteProp<RouteParams, 'RescheduleSummary'>;

export const RescheduleSummaryScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RescheduleSummaryRouteProp>();
    const { t } = useTranslation();

    const { bookingId, oldBooking, newBooking } = route.params || {
        bookingId: '123',
        oldBooking: { courtNumber: '3', date: 'Fri, 17 Dec 2025', time: '10:00' },
        newBooking: { courtNumber: '3', date: 'Fri, 17 Dec 2025', time: '11:00' }
    };

    const handleReschedule = () => {
        console.log('Rescheduling booking ID:', bookingId);
        navigation.navigate('Success', {
            bookings: [{
                courtNumber: newBooking.courtNumber,
                date: newBooking.date,
                time: newBooking.time
            }],
            bookingId: bookingId,
            isSingleBooking: true
        });
    };

    return (
        <PageLayout>
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                <ReservationTimer />

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>{t('rescheduleSummary.summary')}</Text>

                    <Text style={styles.label}>{t('rescheduleSummary.bookingToChange')}</Text>
                    <View style={styles.cardContainer}>
                        <CourtCard
                            courtNumber={oldBooking?.courtNumber || '3'}
                            date={oldBooking?.date || 'Date'}
                            time={oldBooking?.time || 'Time'}
                            cancelled={true}
                        />
                    </View>

                    <Text style={styles.label}>{t('rescheduleSummary.newBookingTime')}</Text>
                    <View style={styles.cardContainer}>
                        <CourtCard
                            courtNumber={newBooking?.courtNumber || '3'}
                            date={newBooking?.date || 'Date'}
                            time={newBooking?.time || 'Time'}
                        />
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title={t('rescheduleSummary.rescheduleToThisTime')}
                        onPress={handleReschedule}
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
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
});
