import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { PageLayout, ScreenWrapper, CustomButton, Header, CourtSelector } from '../components';
import { colors, typography } from '../theme';

type RouteParams = {
    RescheduleCourt: {
        selectedDate: Date;
        selectedSlots: string[];
        bookingId: string;
    };
};

type RescheduleCourtRouteProp = RouteProp<RouteParams, 'RescheduleCourt'>;

const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const formatSelectedDate = (date: Date): string => {
    const day = date.getDate();
    const monthYear = format(date, 'MMM yyyy');
    return `${day}${getOrdinalSuffix(day)} ${monthYear}`;
};

export const RescheduleCourtScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RescheduleCourtRouteProp>();

    // Safe fallbacks
    const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
    const selectedSlots = Array.isArray(route.params?.selectedSlots) ? route.params.selectedSlots : [];
    const bookingId = route.params?.bookingId;

    const [selectedCourts, setSelectedCourts] = useState<{ [key: string]: string | null }>({});

    const handleCourtPress = (timeSlot: string, courtId: string) => {
        setSelectedCourts((prev) => {
            const currentSelection = prev[timeSlot];
            if (currentSelection === courtId) {
                // Deselect
                const { [timeSlot]: _, ...rest } = prev;
                return rest;
            }
            // Select new court
            return { ...prev, [timeSlot]: courtId };
        });
    };

    const handleContinue = () => {
        const allSelected = selectedSlots.every((slot) => selectedCourts[slot]);
        if (!allSelected) return;

        // We need to fetch/know the old booking details here.
        // For now, I'll mock them to match the screenshot or logical flow.
        // In a real app, 'bookingId' could be used to fetch the old details, or they should be passed as params from previous screens.
        // Assuming we passed them through OR we just mock them for this UI task.

        // Constructing date strings for display
        const formattedDate = formatSelectedDate(selectedDate); // "17th Dec 2025" style
        // The screenshot shows "Fri, 17 Dec 2025" style. Let's try to match that formatting if possible using date-fns or similar
        const dateStr = format(selectedDate, 'EEE, d MMM yyyy');

        const newCourtId = selectedCourts[selectedSlots[0] || ''] || '';
        // courtId is "10:00-Court 3", need to parse "Court 3" or just "3"
        const newCourtNumber = newCourtId.split('-').pop()?.replace('Court ', '') || 'X';

        navigation.navigate('RescheduleSummary', {
            bookingId,
            oldBooking: {
                courtNumber: '3', // Mocked as we don't have it in params
                date: dateStr,    // Mocked same date for demo
                time: '10:00',    // Mocked
            },
            newBooking: {
                courtNumber: newCourtNumber,
                date: dateStr,
                time: selectedSlots[0] || '',
            }
        });
    };

    const allSelected = selectedSlots.length > 0 && selectedSlots.every((slot) => selectedCourts[slot]);

    return (
        <PageLayout>
            <Header title="Go Back" />
            <ScreenWrapper>
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Select a court</Text>
                </View>

                {/* Selected Date */}
                <View style={styles.dateContainer}>
                    <Text style={styles.selectedDate}>
                        Selected time: <Text style={styles.selectedDateValue}>{formatSelectedDate(selectedDate)}</Text>
                    </Text>
                    {/* {selectedSlots.length > 0 && (
                        <Text style={styles.timeValue}>{selectedSlots[0]}</Text>
                    )} */}
                </View>


                {/* Court Selector */}
                <CourtSelector
                    selectedSlots={selectedSlots}
                    selectedCourts={selectedCourts}
                    onCourtSelect={handleCourtPress}
                />

                {/* Continue Button */}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Continue to summary"
                        onPress={handleContinue}
                        disabled={!allSelected}
                    />
                </View>
            </ScreenWrapper>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
    },
    dateContainer: {
        marginBottom: 10,
    },
    selectedDate: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.white,
        marginBottom: 4,
    },
    selectedDateValue: {
        fontFamily: typography.fontFamily,
        color: colors.lightGray, // Using lightGray for the value part to match mocks often seen? Or stick to white/gray mix.
        // The previous screen had "Selected date:" in gray and value in white.
        // Let's match typical style: label light, value bold/white.
        // But here I'll stick to the "Select court" screenshot style if possible.
        // color: colors.lightGray,
    },
    timeValue: {
        fontSize: 18,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 10
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray,
        marginBottom: 20
    },
    buttonContainer: {
        marginBottom: 0,
    },
});
