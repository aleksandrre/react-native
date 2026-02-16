import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { PageLayout, ScreenWrapper, Header, CustomButton, CourtCardList, LabeledInputField } from '../components';
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
    
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    const handleApplyCode = () => {
        console.log('Applying promo code:', promoCode);
        // TODO: Apply promo code logic
    };

    // Luhn algorithm for card number validation
    const validateCardNumberLuhn = (cardNum: string): boolean => {
        const digits = cardNum.replace(/\s/g, '');
        if (!/^\d+$/.test(digits)) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i], 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    };

    const handleCardholderNameChange = (text: string) => {
        // Allow letters (including Georgian), spaces, hyphens, and apostrophes
        const cleaned = text.replace(/[^\p{L}\s\-']/gu, '');
        setCardholderName(cleaned);
        
        // Clear error when user starts typing
        if (validationErrors.cardholderName) {
            setValidationErrors(prev => ({ ...prev, cardholderName: '' }));
        }
    };

    const handleCardNumberChange = (text: string) => {
        // Remove all non-digit characters
        const cleaned = text.replace(/\D/g, '');
        
        // Format as groups of 4 digits
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        setCardNumber(formatted);
        
        // Clear error when user starts typing
        if (validationErrors.cardNumber) {
            setValidationErrors(prev => ({ ...prev, cardNumber: '' }));
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
        
        // Clear error when user starts typing
        if (validationErrors.expiryDate) {
            setValidationErrors(prev => ({ ...prev, expiryDate: '' }));
        }
    };

    const handleCvcChange = (text: string) => {
        // Allow only digits
        const cleaned = text.replace(/\D/g, '');
        setCvcNumber(cleaned);
        
        // Real-time warning for incomplete CVC
        if (cleaned.length > 0 && cleaned.length !== 3) {
            setCvcError(true);
        } else {
            setCvcError(false);
        }
        
        // Clear error when user starts typing
        if (validationErrors.cvcNumber) {
            setValidationErrors(prev => ({ ...prev, cvcNumber: '' }));
        }
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        // Cardholder Name Validation
        if (!cardholderName.trim()) {
            errors.cardholderName = 'Cardholder name is required';
        } else if (cardholderName.trim().length < 3) {
            errors.cardholderName = 'Name must be at least 3 characters';
        } else if (!/^[\p{L}\s\-']+$/u.test(cardholderName.trim())) {
            errors.cardholderName = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        } else if (cardholderName.trim().split(/\s+/).length < 2) {
            errors.cardholderName = 'Please enter both first and last name';
        }

        // Card Number Validation
        if (!cardNumber.trim()) {
            errors.cardNumber = 'Card number is required';
        } else {
            const digitsOnly = cardNumber.replace(/\s/g, '');
            if (digitsOnly.length < 13 || digitsOnly.length > 19) {
                errors.cardNumber = 'Card number must be between 13-19 digits';
            } else if (!/^\d+$/.test(digitsOnly)) {
                errors.cardNumber = 'Card number must contain only digits';
            } else if (!validateCardNumberLuhn(cardNumber)) {
                errors.cardNumber = 'Invalid card number';
            }
        }

        // Expiry Date Validation
        if (!expiryDate.trim()) {
            errors.expiryDate = 'Expiry date is required';
        } else if (expiryDate.length < 5) {
            errors.expiryDate = 'Invalid expiry date format (MM/YY)';
        } else {
            const [month, year] = expiryDate.split('/');
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            
            if (monthNum < 1 || monthNum > 12) {
                errors.expiryDate = 'Month must be between 01 and 12';
            } else {
                // Check if card is expired
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
                const currentMonth = currentDate.getMonth() + 1;
                
                if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
                    errors.expiryDate = 'Card has expired';
                }
            }
        }

        // CVC Number Validation
        if (!cvcNumber.trim()) {
            errors.cvcNumber = 'CVC number is required';
        } else if (!/^\d+$/.test(cvcNumber)) {
            errors.cvcNumber = 'CVC must contain only digits';
        } else if (cvcNumber.length !== 3) {
            errors.cvcNumber = 'CVC must be exactly 3 digits';
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
                {isAuthenticated && (
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
                    {isAuthenticated && (
                        <View style={styles.applyCodeSection}>
                            <View style={styles.applyCodeRow}>
                                <View style={styles.promoInputWrapper}>
                                    <LabeledInputField
                                        label="Apply Code"
                                        placeholder="Enter here"
                                        value={promoCode}
                                        onChangeText={setPromoCode}
                                        style={styles.promoInput}
                                    />
                                </View>
                                <CustomButton
                                    title="Apply"
                                    onPress={handleApplyCode}
                                    style={styles.applyButton}
                                />
                            </View>
                        </View>
                    )}

                    {/* Payment Details Section */}
                    {isAuthenticated && (
                        <View style={styles.paymentSection}>
                            <Text style={styles.paymentTitle}>Payment details</Text>

                            <LabeledInputField
                                label="Cardholder Name"
                                placeholder="Giorgi Padelia"
                                value={cardholderName}
                                onChangeText={handleCardholderNameChange}
                                autoCapitalize="words"
                                error={validationErrors.cardholderName}
                            />

                            <LabeledInputField
                                label="Card Number"
                                placeholder="xxxx xxxx xxxx xxxx"
                                value={cardNumber}
                                onChangeText={handleCardNumberChange}
                                keyboardType="numeric"
                                maxLength={23}
                                error={validationErrors.cardNumber}
                            />

                            <LabeledInputField
                                label="Expiry Date"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChangeText={handleExpiryDateChange}
                                keyboardType="numeric"
                                maxLength={5}
                                error={validationErrors.expiryDate}
                            />

                            <LabeledInputField
                                label="CVC Number"
                                placeholder="***"
                                value={cvcNumber}
                                onChangeText={handleCvcChange}
                                keyboardType="numeric"
                                maxLength={3}
                                secureTextEntry
                                error={validationErrors.cvcNumber || (cvcError && !validationErrors.cvcNumber ? 'Please enter 3 digits' : '')}
                            />
                        </View>
                    )}


                </ScrollView>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {!isAuthenticated ? (
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
                                    title="Pay and book courts"
                                    onPress={handlePayAndBook}
                                    style={styles.PayAndBookCourtsBTN}
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
                                        style={styles.PayAndBookCourtsBTN}

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
    applyCodeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 2,
    },
    promoInputWrapper: {
        flex: 1,
    },
    promoInput: {
        marginBottom: 0,
    },
    applyButton: {
        width: 57,
        height: 34,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.lightGray,
        padding: 0,
        margin: 0,
        marginTop: 30,
    },
    paymentSection: {
    },
    paymentTitle: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        marginBottom: 12,
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
