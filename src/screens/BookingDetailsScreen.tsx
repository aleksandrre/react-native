import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const { courtNumber, date, time, status, bookingId, isPast } = route.params;

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const isCancelledOrRescheduled = status === 'Cancelled' || status === 'Rescheduled';
    const subtitleText = isPast || isCancelledOrRescheduled
        ? t('bookingDetails.bookingWas')
        : t('bookingDetails.bookingConfirmed');

    const handleAddToCalendar = () => {
        console.log('Add to calendar');
    };

    const handleMakeNewBooking = () => {
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
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.contentContainer}>
                        <Text style={styles.subtitle}>{subtitleText}</Text>

                        <View style={styles.bookingInfo}>
                            <Text style={[styles.bookingText, isCancelledOrRescheduled && styles.strikethrough]}>
                                {t('success.court')} {courtNumber}
                            </Text>
                            <Text style={[styles.bookingOn, isCancelledOrRescheduled && styles.strikethrough]}>
                                {t('bookingDetails.at')}
                            </Text>
                            <Text style={[styles.bookingText, isCancelledOrRescheduled && styles.strikethrough]}>{time}</Text>
                            <Text style={[styles.bookingOn, isCancelledOrRescheduled && styles.strikethrough]}>
                                {t('bookingDetails.on')}
                            </Text>
                            <Text style={[styles.bookingText, isCancelledOrRescheduled && styles.strikethrough]}>{date}</Text>
                        </View>

                        <Text style={styles.statusText}>{t('bookingDetails.status')} {status}</Text>
                        <Text style={styles.bookingId}>{t('bookingDetails.bookingId')} {`{${bookingId}}`}</Text>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    {isPast || status === 'Cancelled' || status === 'Rescheduled' ? (
                        <CustomButton
                            title={t('bookingDetails.makeNewBooking')}
                            onPress={handleMakeNewBooking}
                        />
                    ) : (
                        <>
                            <CustomButton
                                style={{ marginBottom: 10 }}
                                title={t('bookingDetails.addToCalendar')}
                                onPress={handleAddToCalendar}
                                variant="primary"
                            />
                            <CustomButton
                                style={{ marginBottom: 10 }}
                                title={t('bookingDetails.makeNewBooking')}
                                onPress={handleMakeNewBooking}
                            />
                            <CustomButton
                                style={{ marginBottom: 10 }}
                                title={t('bookingDetails.rescheduleBooking')}
                                onPress={handleRescheduleBooking}
                                variant="secondary"
                            />
                            <CustomButton
                                title={t('bookingDetails.cancelBooking')}
                                onPress={handleCancelBooking}
                                variant="secondary"
                            />
                        </>
                    )}
                </View>
            </ScreenWrapper>

            <InfoModal
                visible={showCancelModal}
                title={t('bookingDetails.cancelConfirm')}
                primaryButtonText={t('bookingDetails.yesCancelBooking')}
                secondaryButtonText={t('bookingDetails.noKeepBooking')}
                onPrimaryPress={handleConfirmCancel}
                onSecondaryPress={handleCancelModalClose}
            />

            <InfoModal
                visible={showSuccessModal}
                title={t('bookingDetails.cancelSuccess', { date, time, courtNumber })}
                primaryButtonText={t('common.ok')}
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
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: typography.fontFamilyLight,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 10,
    },
    bookingInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bookingText: {
        fontSize: 20,
        lineHeight: 24,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        textAlign: 'center',
    },
    bookingOn: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: typography.fontFamilyLight,
        color: colors.white,
        textAlign: 'center',
        marginVertical: 12,
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
    strikethrough: {
        textDecorationLine: 'line-through',
        color: '#A4A4A4',
    },
});
