import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useCreateBooking, useInitiatePayment, useReservationTimer, useValidateCoupon } from '../hooks';
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
    const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

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

    const { isAuthenticated, user, refreshCredits } = useAuthStore();
    const userCredits = user?.credits ?? 0;
    const { mutate: createBookings, isPending: isCreatingBooking } = useCreateBooking();
    const { mutate: initiatePayment, isPending: isInitiatingPayment } = useInitiatePayment();
    const { mutate: validateCoupon, isPending: isValidatingCoupon } = useValidateCoupon();

    const isPaymentPending = isCreatingBooking || isInitiatingPayment;
    const { formatted: reservationTime, isExpired } = useReservationTimer(5 * 60);
    const hasLockedSlotsRef = useRef(false);
    const hasUnlockedSlotsRef = useRef(false);
    const navigatingForwardRef = useRef(false);

    const buildBookingItems = () =>
        selectedSlots.flatMap((slot) => {
            const courtIds = selectedCourtIds[slot] ?? [];
            return courtIds.map((courtId) => ({
                court_id: courtId,
                date: formatDateForApi(selectedDate),
                time: slot,
            }));
        });

    const appliedCouponCode = discountedPrice !== null ? promoCode.trim() : undefined;

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

    const unlockAllSlots = useCallback(() => {
        if (hasUnlockedSlotsRef.current) return;
        hasUnlockedSlotsRef.current = true;
        bookingApi.unlockSlots().catch(() => {});
    }, []);

    // Unlock when screen is removed from stack (back press or Book tab reset)
    useEffect(() => {
        const unsubBeforeRemove = navigation.addListener('beforeRemove', () => {
            if (!navigatingForwardRef.current) {
                unlockAllSlots();
            }
        });

        return () => {
            unsubBeforeRemove();
        };
    }, [navigation, unlockAllSlots]);

    const effectivePrice = discountedPrice ?? totalPrice;
    const isFreeCheckout = effectivePrice <= 0;

    const handleApplyCode = () => {
        if (!promoCode.trim()) return;
        setCouponMessage(null);

        const couponBookings = selectedSlots.flatMap((slot) => {
            const courtIds = selectedCourtIds[slot] ?? [];
            return courtIds.map((courtId) => ({
                court_id: courtId,
                time: slot,
            }));
        });

        validateCoupon({ coupon_code: promoCode.trim(), bookings: couponBookings }, {
            onSuccess: (data) => {
                if (data.success && data.total != null) {
                    setDiscountedPrice(data.total);
                    setCouponMessage({ text: t('summary.couponApplied'), isError: false });
                } else {
                    setDiscountedPrice(null);
                    setCouponMessage({ text: data.message ?? t('summary.couponInvalid'), isError: true });
                }
            },
            onError: () => {
                setCouponMessage({ text: t('summary.couponError'), isError: true });
            },
        });
    };

    const handleBookWithCredits = () => {
        if (isExpired) return;

        const bookingItems = buildBookingItems();
        if (bookingItems.length === 0) {
            Alert.alert(t('common.error'), 'Could not find court IDs. Please go back and re-select courts.');
            return;
        }

        createBookings({ coupon_code: appliedCouponCode, bookings: bookingItems }, {
            onSuccess: (data) => {
                refreshCredits();
                navigatingForwardRef.current = true;
                const bookingIds = data?.booking_ids ?? [];
                navigation.navigate('Success', {
                    bookings,
                    bookingId: bookingIds[0] != null ? String(bookingIds[0]) : '',
                    bookingIds: bookingIds.map(String),
                    isSingleBooking: bookings.length === 1,
                });
            },
            onError: () => {
                Alert.alert(t('common.error'), t('summary.bookingFailed'));
            },
        });
    };

    const handleInitiatePayment = (usePartialCredits: boolean) => {
        if (isExpired) return;

        const bookingItems = buildBookingItems();
        if (bookingItems.length === 0) {
            Alert.alert(t('common.error'), 'Could not find court IDs. Please go back and re-select courts.');
            return;
        }

        initiatePayment(
            {
                name: user?.display_name ?? '',
                email: user?.email ?? '',
                phone: user?.phone ?? '',
                coupon_code: appliedCouponCode,
                use_partial_credits: usePartialCredits || undefined,
                bookings: bookingItems,
            },
            {
                onSuccess: ({ redirect_url }) => {
                    navigatingForwardRef.current = true;
                    Linking.openURL(redirect_url).catch(() => {
                        Alert.alert(t('common.error'), t('summary.paymentRedirectFailed'));
                    });
                },
                onError: () => {
                    Alert.alert(t('common.error'), t('summary.bookingFailed'));
                },
            }
        );
    };

    const handlePayAndBook = () => handleInitiatePayment(false);
    const handlePayWithPartialCredits = () => handleInitiatePayment(true);

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
                                    onChangeText={(text) => {
                                        setPromoCode(text);
                                        if (couponMessage) setCouponMessage(null);
                                    }}
                                    style={styles.promoInput}
                                    editable={discountedPrice === null}
                                />
                                <CustomButton
                                    title={t('summary.apply')}
                                    onPress={handleApplyCode}
                                    disabled={isValidatingCoupon || !promoCode.trim() || discountedPrice !== null}
                                    style={styles.applyButton}
                                />
                            </View>
                            {couponMessage && (
                                <Text style={couponMessage.isError ? styles.couponErrorText : styles.couponSuccessText}>
                                    {couponMessage.text}
                                </Text>
                            )}
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
                            {discountedPrice !== null && (
                                <Text style={styles.originalPriceText}>
                                    {t('summary.originalPrice')} {`₾${totalPrice}`}
                                </Text>
                            )}
                            <Text style={styles.priceText}>
                                {t('summary.price')} {`₾${effectivePrice}`}
                            </Text>
                            {userCredits > 0 && (
                                <Text style={styles.creditsText}>
                                    {t('summary.yourCredits')} {userCredits}
                                </Text>
                            )}

                            {isExpired && (
                                <Text style={styles.errorText}>{t('summary.reservationExpired')}</Text>
                            )}

                            {isFreeCheckout ? (
                                <CustomButton
                                    title={t('summary.confirmFreeBooking')}
                                    onPress={handleBookWithCredits}
                                    disabled={isPaymentPending || isExpired}
                                />
                            ) : (
                                <>
                                    {userCredits >= effectivePrice && (
                                        <CustomButton
                                            title={t('summary.bookWithCredits')}
                                            onPress={handleBookWithCredits}
                                            disabled={isPaymentPending || isExpired}
                                            variant="secondary"
                                        />
                                    )}

                                    {userCredits > 0 && userCredits < effectivePrice && (
                                        <CustomButton
                                            title={t('summary.bookWithCreditsAndCard')}
                                            onPress={handlePayWithPartialCredits}
                                            disabled={isPaymentPending || isExpired}
                                            variant="secondary"
                                        />
                                    )}

                                    <CustomButton
                                        title={t('summary.payAndBook')}
                                        onPress={handlePayAndBook}
                                        disabled={isPaymentPending || isExpired}
                                        style={styles.PayAndBookCourtsBTN}
                                    />
                                </>
                            )}
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
        height: 34,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.lightGray,
        padding: 0,
        paddingHorizontal: 9,
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
    },
    couponSuccessText: {
        fontSize: 13,
        fontFamily: typography.fontFamily,
        color: '#4CAF50',
        marginTop: 6,
    },
    couponErrorText: {
        fontSize: 13,
        fontFamily: typography.fontFamily,
        color: '#FF4444',
        marginTop: 6,
    },
    originalPriceText: {
        fontSize: 14,
        fontFamily: typography.fontFamily,
        color: colors.lightGray,
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
});
