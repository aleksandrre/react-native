import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { PageLayout, ScreenWrapper, Header, CustomButton, InfoModal } from '../components';
import { colors, typography } from '../theme';

type RouteParams = {
    BookingDetails: {
        courtNumber: string;
        date: string;
        time: string;
        status: 'Confirmed' | 'Failed' | 'Completed' | 'Cancelled' | 'Rescheduled';
        bookingId: string;
        isPast: boolean;
    };
};

type BookingDetailsRouteProp = RouteProp<RouteParams, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<BookingDetailsRouteProp>();

    const { courtNumber, date, time, status, bookingId, isPast } = route.params;

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleAddToCalendar = () => {
        console.log('Add to calendar');
        // TODO: Add to calendar functionality
    };

    const handleMakeNewBooking = () => {
        console.log('Make new booking');
        navigation.navigate('Book' as never);
    };

    const handleRescheduleBooking = () => {
        navigation.navigate('Reschedule', { bookingId });
    };

    const handleCancelBooking = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false);
        // TODO: API call to cancel booking
        setShowSuccessModal(true);
    };

    const handleCancelModalClose = () => {
        setShowCancelModal(false);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigation.goBack();
    };

    return (
        <PageLayout>
            <Header title="Go Back" />
            <ScreenWrapper>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Booking Confirmation */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.subtitle}>Your booking is confirmed:</Text>

                        {/* Booking Info */}
                        <View style={styles.bookingInfo}>
                            <Text style={styles.bookingText}>Court {courtNumber}</Text>
                            <Text style={styles.bookingOn}>at</Text>
                            <Text style={styles.bookingText}>{time}</Text>
                            <Text style={styles.bookingOn}>on</Text>
                            <Text style={styles.bookingText}>{date}</Text>
                        </View>

                        {/* Status */}
                        <Text style={styles.statusText}>Status: {status}</Text>

                        {/* Booking ID */}
                        <Text style={styles.bookingId}>Booking ID: {`{${bookingId}}`}</Text>
                    </View>
                </ScrollView>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {isPast || status === 'Cancelled' || status === 'Rescheduled' ? (
                        // Past booking or cancelled/rescheduled - only Make new booking
                        <CustomButton
                            title="Make a new booking"
                            onPress={handleMakeNewBooking}
                        />
                    ) : (
                        // Upcoming booking - all buttons
                        <>
                            <CustomButton
                                title="Add to calendar"
                                onPress={handleAddToCalendar}
                                variant="primary"
                            />
                            <CustomButton
                                title="Make a new booking"
                                onPress={handleMakeNewBooking}
                            />
                            <CustomButton
                                title="Reschedule booking"
                                onPress={handleRescheduleBooking}
                                variant="secondary"
                            />
                            <CustomButton
                                title="Cancel booking"
                                onPress={handleCancelBooking}
                                variant="secondary"
                            />
                        </>
                    )}
                </View>
            </ScreenWrapper>

            {/* Cancel Confirmation Modal */}
            <InfoModal
                visible={showCancelModal}
                title="Are you sure you want to cancel your booking?"
                primaryButtonText="Yes, cancel booking"
                secondaryButtonText="No, keep booking"
                onPrimaryPress={handleConfirmCancel}
                onSecondaryPress={handleCancelModalClose}
            />

            {/* Success Modal */}
            <InfoModal
                visible={showSuccessModal}
                title={`Your booking on ${date} at ${time} on Court ${courtNumber} has been cancelled and you have gained 1 credit.`}
                primaryButtonText="Ok"
                onPrimaryPress={handleSuccessModalClose}
                singleButton={true}
            />
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    contentContainer: {
        paddingVertical: 20,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamily,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 20,
    },
    bookingInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bookingText: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        textAlign: 'center',
    },
    bookingOn: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: typography.fontFamily,
        color: colors.lightGray,
        textAlign: 'center',
        marginVertical: 4,
    },
    statusText: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        textAlign: 'left',
        marginBottom: 16,
    },
    bookingId: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        textAlign: 'left',
        marginBottom: 24,
    },
    buttonContainer: {
        marginBottom: 0,
    },
});
