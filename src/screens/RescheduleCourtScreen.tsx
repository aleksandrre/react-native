import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAvailableCourts, useDateLocale } from '../hooks';
import { PageLayout, ScreenWrapper, CustomButton, Header, CourtSelector, Text } from '../components';
import { colors, typography } from '../theme';

type RouteParams = {
    RescheduleCourt: {
        selectedDate: string;
        selectedSlots: string[];
        bookingId: string;
        oldBooking: { courtNumber: string; rawDate: string; time: string };
    };
};

type RescheduleCourtRouteProp = RouteProp<RouteParams, 'RescheduleCourt'>;

const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export const RescheduleCourtScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RescheduleCourtRouteProp>();
    const { t } = useTranslation();
    const dateLocale = useDateLocale();

    const selectedDate = route.params?.selectedDate
        ? new Date(route.params.selectedDate)
        : new Date();
    const selectedSlots = Array.isArray(route.params?.selectedSlots)
        ? route.params.selectedSlots
        : [];
    const bookingId = route.params?.bookingId;
    const oldBooking = route.params?.oldBooking;

    const [selectedCourts, setSelectedCourts] = useState<{ [timeSlot: string]: string[] }>({});
    const [selectedCourtIds, setSelectedCourtIds] = useState<{ [timeSlot: string]: number }>({});

    const { courtsBySlot, isLoading } = useAvailableCourts(selectedDate, selectedSlots);

    const handleCourtPress = (timeSlot: string, courtId: number, courtTitle: string) => {
        const currentSelection = selectedCourts[timeSlot] ?? [];
        const isAlreadySelected = currentSelection.includes(courtTitle);

        setSelectedCourts((prev) => ({
            ...prev,
            [timeSlot]: isAlreadySelected ? [] : [courtTitle],
        }));

        setSelectedCourtIds((prev) => {
            if (isAlreadySelected) {
                const { [timeSlot]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [timeSlot]: courtId };
        });
    };

    const handleContinue = () => {
        const slot = selectedSlots[0];
        if (!slot || !selectedCourtIds[slot]) return;

        const newDateForApi = formatDateForApi(selectedDate);
        const courtTitle = (selectedCourts[slot] ?? [])[0] ?? '';

        navigation.navigate('RescheduleSummary', {
            bookingId,
            oldBooking: oldBooking ?? { courtNumber: '', rawDate: newDateForApi, time: slot },
            newBooking: {
                courtNumber: courtTitle,
                rawDate: newDateForApi,
                time: slot,
            },
            newCourtId: selectedCourtIds[slot],
            newDateForApi,
        });
    };

    const allSelected = selectedSlots.length > 0 &&
        selectedSlots.every((slot) => selectedCourtIds[slot] != null);

    return (
        <PageLayout>
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('rescheduleCourt.selectACourt')}</Text>
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.selectedDate}>
                        {t('rescheduleCourt.selectedTime')}{' '}
                        <Text style={styles.selectedDateValue}>
                            {format(selectedDate, 'd MMM yyyy', { locale: dateLocale })}
                        </Text>
                    </Text>
                </View>

                <CourtSelector
                    selectedSlots={selectedSlots}
                    selectedCourts={selectedCourts}
                    onCourtSelect={handleCourtPress}
                    courtsBySlot={courtsBySlot}
                    isLoading={isLoading}
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
    buttonContainer: {
        marginBottom: 0,
    },
});
