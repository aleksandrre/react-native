import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { PageLayout, ScreenWrapper, Header, CustomButton, CourtCardList } from '../components';
import { InputField } from '../components/ui/InputField';
import { colors, typography } from '../theme';
import { Booking } from '../types';
import { BookStackParamList } from '../navigation/MainNavigator';

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
    // courtId format: "10:00-Court 3" -> extract "3"
    const match = courtId.match(/Court\s*(\d+)/i);
    return match ? match[1] : '1';
};

export const SummaryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<BookStackParamList>>();
    const route = useRoute<SummaryRouteProp>();
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

    // Build booking list from selected courts
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
    const isLoggedIn = true;

    const handleApplyCode = () => {
        console.log('Applying promo code:', promoCode);
        // TODO: Apply promo code logic
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
        // Remove all non-digit characters
        const cleaned = text.replace(/\D/g, '');

        // Format as MM/YY
        if (cleaned.length >= 2) {
            setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
        } else {
            setExpiryDate(cleaned);
        }
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!cardholderName.trim()) {
            errors.cardholderName = 'Cardholder name is required';
        }

        if (!cardNumber.trim()) {
            errors.cardNumber = 'Card number is required';
        }

        if (!expiryDate.trim()) {
            errors.expiryDate = 'Expiry date is required';
        } else if (expiryDate.length < 5) {
            errors.expiryDate = 'Invalid expiry date format (MM/YY)';
        }

        if (!cvcNumber.trim()) {
            errors.cvcNumber = 'CVC number is required';
        } else if (cvcNumber.length !== 3) {
            errors.cvcNumber = 'CVC must be 3 digits';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBookWithCredits = () => {
        if (!validateForm()) {
            return;
        }
        console.log('Booking with credits:', { bookings, requiredCredits });
        // Generate random booking ID
        const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();
        navigation.navigate('Success', { bookings, bookingId });
    };

    const handlePayAndBook = () => {
        if (!validateForm()) {
            return;
        }
        console.log('Pay and book:', { bookings, totalPrice });
        // Generate random booking ID
        const bookingId = Math.floor(Math.random() * 900000 + 100000).toString();
        navigation.navigate('Success', { bookings, bookingId });
    };

    const handleLoginToBook = () => {
        console.log('Navigate to login');
        navigation.getParent()?.navigate('Auth', { screen: 'Login' });
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <PageLayout>
            <Header title="Go Back" />
            <ScreenWrapper>
                {/* Reservation Timer */}
                {isLoggedIn && (
                    <View style={styles.reservationBanner}>
                        <Text style={styles.reservationText}>⏱️ Your sessions are reserved for 4:59</Text>
                    </View>
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Court Card List */}
                    <CourtCardList title="Summary" bookings={bookings} />

                    {/* Apply Code Section */}
                    {isLoggedIn && (
                        <View style={styles.applyCodeSection}>
                            <Text style={styles.applyCodeTitle}>Apply Code</Text>
                            <View style={styles.applyCodeRow}>
                                <InputField
                                    placeholder="Enter here"
                                    value={promoCode}
                                    onChangeText={setPromoCode}
                                    style={styles.promoInput}
                                />
                                <CustomButton
                                    title="Apply"
                                    onPress={handleApplyCode}
                                    style={styles.applyButton}
                                />
                            </View>
                        </View>
                    )}

                    {/* Payment Details Section */}
                    {isLoggedIn && (
                        <View style={styles.paymentSection}>
                            <Text style={styles.paymentTitle}>Payment details</Text>

                            <Text style={styles.fieldLabel}>Cardholder Name</Text>
                            <InputField
                                placeholder="Giorgi Padelia"
                                value={cardholderName}
                                onChangeText={setCardholderName}
                                style={styles.paymentInput}
                            />
                            {validationErrors.cardholderName && (
                                <Text style={styles.errorText}>{validationErrors.cardholderName}</Text>
                            )}

                            <Text style={styles.fieldLabel}>Card Number</Text>
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

                            <Text style={styles.fieldLabel}>Expiry Date</Text>
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

                            <Text style={styles.fieldLabel}>CVC Number</Text>
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
                                    <Text style={styles.warningText}>⚠️ Please enter 3 digits</Text>
                                </View>
                            )}
                        </View>
                    )}


                </ScrollView>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {!isLoggedIn ? (
                        // Not logged in: Show simple price and login button
                        <>
                            <Text style={styles.priceText}>Price: {`₾${totalPrice}`}</Text>
                            <CustomButton
                                title="Log in to book"
                                onPress={handleLoginToBook}
                            />
                        </>
                    ) : (
                        // Logged in: Show full price/credits info and conditional buttons
                        <>
                            {/* Price and Credits Info */}
                            {userCredits > 0 ? (
                                <>
                                    <Text style={styles.priceText}>
                                        Price: {`₾${totalPrice}`} / {requiredCredits} credit
                                    </Text>
                                    <Text style={styles.creditsText}>
                                        Your credits: {userCredits}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.priceText}>Price: {`₾${totalPrice}`}</Text>
                            )}

                            {/* Conditional Buttons */}
                            {userCredits === 0 ? (
                                // No credits: Show only Pay button
                                <CustomButton
                                    title="Pay and book court"
                                    onPress={handlePayAndBook}
                                />
                            ) : userCredits >= requiredCredits ? (
                                // Enough credits: Show both buttons
                                <>
                                    <CustomButton
                                        title="Book with credits"
                                        onPress={handleBookWithCredits}
                                        variant="secondary"
                                    />
                                    <CustomButton
                                        title="Pay and book courts"
                                        onPress={handlePayAndBook}
                                    />
                                </>
                            ) : (
                                // Not enough credits: Show both buttons with different text
                                <>
                                    <CustomButton
                                        title="Book with credits & card"
                                        onPress={handleBookWithCredits}
                                        variant="secondary"
                                    />
                                    <CustomButton
                                        title="Pay and book courts"
                                        onPress={handlePayAndBook}
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
        backgroundColor: '#60235acb',
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
        fontFamily: typography.fontFamilySemiBold,
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
        fontFamily: typography.fontFamilySemiBold,
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
        paddingVertical: 8,
        borderRadius: 5,
    },
    paymentSection: {
    },
    paymentTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamilySemiBold,
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
        marginBottom: 0,
    },
    priceText: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        marginBottom: 8,
    },
    creditsText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.white,
        marginBottom: 16,
    },
});
