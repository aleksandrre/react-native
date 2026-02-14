import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { PageLayout, ScreenWrapper, Header, CustomButton, ReservationTimer, CourtCard } from '../components';
import { colors, typography } from '../theme';
import { format } from 'date-fns';

type RouteParams = {
    RescheduleSummary: {
        bookingId: string;
        oldBooking: {
            courtNumber: string;
            date: string; // e.g., "17th Dec 2025"
            time: string; // e.g., "10:00"
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

    // Default/fallback values if params are missing during dev/testing
    const { bookingId, oldBooking, newBooking } = route.params || {
        bookingId: '123',
        oldBooking: { courtNumber: '3', date: 'Fri, 17 Dec 2025', time: '10:00' },
        newBooking: { courtNumber: '3', date: 'Fri, 17 Dec 2025', time: '11:00' }
    };

    const handleReschedule = () => {
        // TODO: Call API to reschedule
        console.log('Rescheduling booking ID:', bookingId);
        // Navigate to success or bookings
        navigation.navigate('Success', {
            bookings: [], // Mock
            bookingId: bookingId,
            isSingleBooking: true
        }); // Assuming Success screen exists and can handle this or just go back for now
    };

    return (
        <PageLayout>
            <Header title="Go Back" />
            <ScreenWrapper>
                <ReservationTimer />

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>Summary</Text>

                    <Text style={styles.label}>Booking to change:</Text>
                    <View style={styles.cardContainer}>
                        <CourtCard
                            courtNumber={oldBooking?.courtNumber || '3'}
                            date={oldBooking?.date || 'Date'}
                            time={oldBooking?.time || 'Time'}
                            cancelled={true}
                        />
                    </View>

                    <Text style={styles.label}>New booking time:</Text>
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
                        title="Reschedule to this time"
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
