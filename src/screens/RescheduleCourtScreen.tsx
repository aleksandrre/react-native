import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useDateLocale } from '../hooks';
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

const formatSelectedDate = (date: Date, locale: Locale): string => {
    const day = date.getDate();
    const monthYear = format(date, 'MMM yyyy', { locale });
    return `${day}${getOrdinalSuffix(day)} ${monthYear}`;
};

export const RescheduleCourtScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RescheduleCourtRouteProp>();
    const { t } = useTranslation();
    const dateLocale = useDateLocale();

    const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
    const selectedSlots = Array.isArray(route.params?.selectedSlots) ? route.params.selectedSlots : [];
    const bookingId = route.params?.bookingId;

    const [selectedCourts, setSelectedCourts] = useState<{ [key: string]: string | null }>({});

    const handleCourtPress = (timeSlot: string, courtId: string) => {
        setSelectedCourts((prev) => {
            const currentSelection = prev[timeSlot];
            if (currentSelection === courtId) {
                const { [timeSlot]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [timeSlot]: courtId };
        });
    };

    const handleContinue = () => {
        const allSelected = selectedSlots.every((slot) => selectedCourts[slot]);
        if (!allSelected) return;

        const dateStr = format(selectedDate, 'EEE, d MMM yyyy', { locale: dateLocale });
        const newCourtId = selectedCourts[selectedSlots[0] || ''] || '';
        const newCourtNumber = newCourtId.split('-').pop()?.replace('Court ', '') || 'X';

        navigation.navigate('RescheduleSummary', {
            bookingId,
            oldBooking: {
                courtNumber: '3',
                date: dateStr,
                time: '10:00',
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
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('rescheduleCourt.selectACourt')}</Text>
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.selectedDate}>
                        {t('rescheduleCourt.selectedTime')} <Text style={styles.selectedDateValue}>{formatSelectedDate(selectedDate, dateLocale)}</Text>
                    </Text>
                </View>

                <CourtSelector
                    selectedSlots={selectedSlots}
                    selectedCourts={selectedCourts}
                    onCourtSelect={handleCourtPress}
                />

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title={t('rescheduleCourt.continueToSummary')}
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
        color: colors.lightGray,
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
