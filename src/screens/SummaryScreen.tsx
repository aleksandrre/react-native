import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { PageLayout, ScreenWrapper, Header, CustomButton, CourtCardList } from '../components';
import { InputField } from '../components/ui/InputField';
import { colors, typography } from '../theme';
import { Booking } from '../types';
import { BookStackParamList } from '../navigation/MainNavigator';
import { useAuthStore } from '../store/authStore';

type RouteParams = {
    Summary: {
        selectedDate: Date;
        selectedSlots: string[];
        selectedCourts: { [timeSlot: string]: string | null };
    };
};

type SummaryRouteProp = RouteProp<RouteParams, 'Summary'>;

const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const formatDateForCard = (date: Date): string => {
    const dayName = format(date, 'EEE');
    const day = date.getDate();
    const monthYear = format(date, 'MMM yyyy');
    return `${dayName}, ${day} ${monthYear}`;
};

const extractCourtNumber = (courtId: string): string => {
    const match = courtId.match(/Court\s*(\d+)/i);
    return match ? match[1] : '1';
};

export const SummaryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<BookStackParamList>>();
    const route = useRoute<SummaryRouteProp>();
    const { t } = useTranslation();
    const [promoCode, setPromoCode] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvcNumber, setCvcNumber] = useState('');
    const [cvcError, setCvcError] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
    const selectedSlots = Array.isArray(route.params?.selectedSlots) ? route.params.selectedSlots : [];
    const selectedCourts = route.params?.selectedCourts || {};

    const bookings: Booking[] = selectedSlots
        .filter((slot) => selectedCourts[slot])
        .map((slot) => {
            const courtId = selectedCourts[slot] as string;
            return {
                courtNumber: extractCourtNumber(courtId),
                date: formatDateForCard(selectedDate),
                time: slot,
            };
        });

    const pricePerSession = 40;
    const totalPrice = bookings.length * pricePerSession;
    const userCredits: number = 3;
    const requiredCredits = bookings.length;
    
    const { isAuthenticated } = useAuthStore();

    const handleApplyCode = () => {
        console.log('Applying promo code:', promoCode);
    };

    const handleCvcChange = (text: string) => {
        setCvcNumber(text);
        if (text.length > 0 && text.length !== 3) {
            setCvcError(true);
        } else {
            setCvcError(false);
        }
    };

    const handleExpiryDateChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
        } else {
            setExpiryDate(cleaned);
        }
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!cardholderName.trim()) {
            errors.cardholderName = t('summary.errors.cardholderNameRequired');
        }
        if (!cardNumber.trim()) {
            errors.cardNumber = t('summary.errors.cardNumberRequired');
        }
        if (!expiryDate.trim()) {
            errors.expiryDate = t('summary.errors.expiryDateRequired');
        } else if (expiryDate.length < 5) {
            errors.expiryDate = t('summary.errors.invalidExpiryDate');
        }
        if (!cvcNumber.trim()) {
            errors.cvcNumber = t('summary.errors.cvcRequired');
        } else if (cvcNumber.length !== 3) {
            errors.cvcNumber = t('summary.errors.cvcMustBe3Digits');
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBookWithCredits = () => {
        if (!validateForm()) return;
        const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();
        navigation.navigate('Success', { bookings, bookingId });
    };

    const handlePayAndBook = () => {
        if (!validateForm()) return;
        const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();
        navigation.navigate('Success', { bookings, bookingId });
    };

    const handleLoginToBook = () => {
        navigation.getParent()?.navigate('Auth', { screen: 'Login' });
    };

    return (
        <PageLayout>
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                {isAuthenticated && (
                    <View style={styles.reservationBanner}>
                        <Text style={styles.reservationText}>{t('summary.reservationTimer')}</Text>
                    </View>
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

                    {isAuthenticated && (
                        <View style={styles.paymentSection}>
                            <Text style={styles.paymentTitle}>{t('summary.paymentDetails')}</Text>

                            <Text style={styles.fieldLabel}>{t('summary.cardholderName')}</Text>
                            <InputField
                                placeholder="Giorgi Padelia"
                                value={cardholderName}
                                onChangeText={setCardholderName}
                                style={styles.paymentInput}
                            />
                            {validationErrors.cardholderName && (
                                <Text style={styles.errorText}>{validationErrors.cardholderName}</Text>
                            )}

                            <Text style={styles.fieldLabel}>{t('summary.cardNumber')}</Text>
                            <InputField
                                placeholder="xxxx xxxx xxxx xxxx"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                                maxLength={19}
                                style={styles.paymentInput}
                            />
                            {validationErrors.cardNumber && (
                                <Text style={styles.errorText}>{validationErrors.cardNumber}</Text>
                            )}

                            <Text style={styles.fieldLabel}>{t('summary.expiryDate')}</Text>
                            <InputField
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChangeText={handleExpiryDateChange}
                                keyboardType="numeric"
                                maxLength={5}
                                style={styles.paymentInput}
                            />
                            {validationErrors.expiryDate && (
                                <Text style={styles.errorText}>{validationErrors.expiryDate}</Text>
                            )}

                            <Text style={styles.fieldLabel}>{t('summary.cvcNumber')}</Text>
                            <InputField
                                placeholder="***"
                                value={cvcNumber}
                                onChangeText={handleCvcChange}
                                keyboardType="numeric"
                                maxLength={3}
                                secureTextEntry
                                style={styles.paymentInput}
                            />
                            {validationErrors.cvcNumber && (
                                <Text style={styles.errorText}>{validationErrors.cvcNumber}</Text>
                            )}
                            {cvcError && !validationErrors.cvcNumber && (
                                <View style={styles.warningContainer}>
                                    <Text style={styles.warningText}>{t('summary.cvcWarning')}</Text>
                                </View>
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
                            {userCredits > 0 ? (
                                <>
                                    <Text style={styles.priceText}>
                                        {t('summary.price')} {`₾${totalPrice}`} / {requiredCredits} {t('summary.credit')}
                                    </Text>
                                    <Text style={styles.creditsText}>
                                        {t('summary.yourCredits')} {userCredits}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.priceText}>{t('summary.price')} {`₾${totalPrice}`}</Text>
                            )}

                            {userCredits === 0 ? (
                                <CustomButton
                                    title={t('summary.payAndBook')}
                                    onPress={handlePayAndBook}
                                    style={styles.PayAndBookCourtsBTN}
                                />
                            ) : userCredits >= requiredCredits ? (
                                <>
                                    <CustomButton
                                        title={t('summary.bookWithCredits')}
                                        onPress={handleBookWithCredits}
                                        variant="secondary"
                                    />
                                    <CustomButton
                                        title={t('summary.payAndBook')}
                                        onPress={handlePayAndBook}
                                        style={styles.PayAndBookCourtsBTN}
                                    />
                                </>
                            ) : (
                                <>
                                    <CustomButton
                                        title={t('summary.bookWithCreditsAndCard')}
                                        onPress={handleBookWithCredits}
                                        variant="secondary"
                                    />
                                    <CustomButton
                                        title={t('summary.payAndBook')}
                                        onPress={handlePayAndBook}
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
