import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useCreateBooking, useReservationTimer } from '../hooks';
import { PageLayout, ScreenWrapper, Header, CustomButton, CourtCardList, ReservationTimer, Text } from '../components';
import { InputField } from '../components/ui/InputField';
import { colors, typography } from '../theme';
import { Booking } from '../types';
import { BookStackParamList } from '../navigation/MainNavigator';
import { useAuthStore } from '../store/authStore';
import { bookingApi } from '../api/bookingApi';

type RouteParams = {
    Summary: {
        selectedDate: Date;
        selectedSlots: string[];
        selectedCourts: { [timeSlot: string]: string[] };
        selectedCourtIds: { [timeSlot: string]: number[] };
        courtPriceMap: { [courtId: number]: number };
    };
};

type SummaryRouteProp = RouteProp<RouteParams, 'Summary'>;

const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const SummaryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<BookStackParamList>>();
    const route = useRoute<SummaryRouteProp>();
    const { t } = useTranslation();
    const [promoCode, setPromoCode] = useState('');

    const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
    const selectedSlots = Array.isArray(route.params?.selectedSlots) ? route.params.selectedSlots : [];
    const selectedCourts = route.params?.selectedCourts || {};
    const selectedCourtIds = route.params?.selectedCourtIds || {};
    const courtPriceMap = route.params?.courtPriceMap || {};

    const bookings: Booking[] = selectedSlots.flatMap((slot) => {
        const courts = selectedCourts[slot] ?? [];
        return courts.map((courtNumber) => ({
            courtNumber,
            rawDate: formatDateForApi(selectedDate),
            time: slot,
        }));
    });

    const totalPrice = selectedSlots
        .flatMap((slot) => selectedCourtIds[slot] ?? [])
        .reduce((sum, courtId) => sum + (courtPriceMap[courtId] ?? 0), 0);
    const requiredCredits = totalPrice;

    const { isAuthenticated, user, refreshCredits } = useAuthStore();
    const userCredits = user?.credits ?? 0;
    const { mutate: createBookings, isPending: isCreatingBooking } = useCreateBooking();
    const { formatted: reservationTime, isExpired } = useReservationTimer(5 * 60);
    const hasLockedSlotsRef = useRef(false);

    const buildBookingRequest = (useCredit: boolean) => ({
        use_credit: useCredit,
        bookings: selectedSlots.flatMap((slot) => {
            const courtIds = selectedCourtIds[slot] ?? [];
            return courtIds.map((courtId) => ({
                court_id: courtId,
                date: formatDateForApi(selectedDate),
                time: slot,
            }));
        }),
    });

    useEffect(() => {
        if (!isAuthenticated) return;
        if (hasLockedSlotsRef.current) return;

        hasLockedSlotsRef.current = true;

        const dateForApi = formatDateForApi(selectedDate);

        selectedSlots.forEach((slot) => {
            const courtIds = selectedCourtIds[slot] ?? [];
            courtIds.forEach((courtId) => {
                bookingApi
                    .lockSlot({
                        court_id: courtId,
                        date: dateForApi,
                        time: slot,
                    })
                    .catch((error) => {
                        console.error('[SummaryScreen] lockSlot error', error);
                    });
            });
        });
    }, [isAuthenticated, selectedSlots, selectedCourtIds, selectedDate]);

    const handleApplyCode = () => {
        console.log('Applying promo code:', promoCode);
    };

    const submitBookings = (useCredit: boolean) => {
        if (isExpired) {
            return;
        }

        const request = buildBookingRequest(useCredit);
        console.log('[SummaryScreen] booking request:', JSON.stringify(request));

        if (request.bookings.length === 0) {
            console.warn('[SummaryScreen] No court IDs found in selectedCourtIds:', selectedCourtIds);
            Alert.alert(t('common.error'), 'Could not find court IDs. Please go back and re-select courts.');
            return;
        }

        createBookings(request, {
            onSuccess: (data) => {
                console.log('[SummaryScreen] createBookings success:', data);
                if (useCredit) {
                    refreshCredits();
                }
                const bookingIds = data?.booking_ids ?? [];
                const bookingId = bookingIds[0] != null ? String(bookingIds[0]) : undefined;
                navigation.navigate('Success', {
                    bookings,
                    bookingId: bookingId ?? '',
                    bookingIds: bookingIds.map(String),
                    isSingleBooking: bookings.length === 1,
                });
            },
            onError: (error) => {
                console.error('[SummaryScreen] createBookings error:', error);
                Alert.alert(t('common.error'), t('summary.bookingFailed'));
            },
        });
    };

    const handleBookWithCredits = () => submitBookings(true);
    const handlePayAndBook = () => submitBookings(false);

    const handleLoginToBook = () => {
        navigation.getParent()?.navigate('Auth', { screen: 'Login', params: { fromApp: true } });
    };

    return (
        <PageLayout>
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                {isAuthenticated && !isExpired && (
                    <ReservationTimer formattedTime={reservationTime} />
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <CourtCardList title={t('summary.title')} bookings={bookings} />

                    {isAuthenticated && (
                        <View style={styles.applyCodeSection}>
                            <Text style={styles.applyCodeTitle}>{t('summary.applyCode')}</Text>
                            <View style={styles.applyCodeRow}>
                                <InputField
                                    placeholder={t('summary.enterHere')}
                                    value={promoCode}
                                    onChangeText={setPromoCode}
                                    style={styles.promoInput}
                                />
                                <CustomButton
                                    title={t('summary.apply')}
                                    onPress={handleApplyCode}
                                    style={styles.applyButton}
                                />
                            </View>
                        </View>
                    )}

                </ScrollView>

                <View style={styles.buttonContainer}>
                    {!isAuthenticated ? (
                        <>
                            <Text style={styles.priceText}>{t('summary.price')} {`₾${totalPrice}`}</Text>
                            <CustomButton
                                title={t('summary.loginToBook')}
                                onPress={handleLoginToBook}
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.priceText}>
                                {t('summary.price')} {`₾${totalPrice}`} / {requiredCredits} {t('summary.credit')}
                            </Text>
                            {userCredits > 0 && (
                                <Text style={styles.creditsText}>
                                    {t('summary.yourCredits')} {userCredits}
                                </Text>
                            )}

                            {isExpired && (
                                <Text style={styles.errorText}>{t('summary.reservationExpired')}</Text>
                            )}

                            {userCredits > 0 && (
                                <CustomButton
                                    title={
                                        userCredits >= requiredCredits
                                            ? t('summary.bookWithCredits')
                                            : t('summary.bookWithCreditsAndCard')
                                    }
                                    onPress={handleBookWithCredits}
                                    disabled={isCreatingBooking || isExpired}
                                    variant="secondary"
                                />
                            )}
                            <CustomButton
                                title={t('summary.payAndBook')}
                                onPress={handlePayAndBook}
                                disabled={isCreatingBooking || isExpired}
                                style={styles.PayAndBookCourtsBTN}
                            />
                        </>
                    )}
                </View>
            </ScreenWrapper>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    reservationBanner: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 8,
        alignItems: 'center',
        marginBottom: 10,
        margin: 'auto',
    },
    reservationText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    title: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        marginBottom: 5,
    },
    applyCodeSection: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    applyCodeTitle: {
        fontSize: 14,
        fontFamily: typography.fontFamily,
        color: colors.white,
        marginBottom: 12,
    },
    applyCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    promoInput: {
        flex: 1,
        marginBottom: 0,
    },
    applyButton: {
        width: 57,
        height: 34,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.lightGray,
        padding: 0,
        margin: 0
    },
    paymentSection: {
    },
    paymentTitle: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.white,
        marginBottom: 8,
        marginTop: 4,
    },
    paymentInput: {
        marginBottom: 8,
    },
    warningContainer: {
        marginTop: 4,
        marginBottom: 8,
    },
    warningText: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: typography.fontFamily,
        color: '#FFA500',
    },
    errorText: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: typography.fontFamily,
        color: '#FF4444',
        marginTop: -4,
        marginBottom: 8,
    },
    priceSection: {
        marginTop: 24,
        backgroundColor: '#1E1E1E',
        borderRadius: 5,
        padding: 16,
    },
    priceSectionTitle: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    priceLabel: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.lightGray,
    },
    priceValue: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray,
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
    },
    totalValue: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: typography.fontFamilyBold,
        color: colors.lightPurple,
    },
    buttonContainer: {
        padding: 10,
        paddingBottom: 0,
        marginBottom: 0,
    },
    priceText: {
        fontSize: 18,
        lineHeight: 23,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        marginBottom: 10,
    },
    creditsText: {
        fontSize: 18,
        lineHeight: 23,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        marginBottom: 10,
    },
    PayAndBookCourtsBTN: {
        marginTop: 10
    }
});
