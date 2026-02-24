import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PageLayout, ScreenWrapper, Header, CustomButton, DateSelector, TimeSlotSelector } from '../components';
import { colors } from '../theme';

type RouteParams = {
    Reschedule: {
        bookingId: string;
    };
};

type RescheduleRouteProp = RouteProp<RouteParams, 'Reschedule'>;

export const RescheduleScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RescheduleRouteProp>();
    const { t } = useTranslation();
    const { bookingId } = route.params || {};

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedSlots([]);
    };

    const handleSlotsSelect = (slots: string[]) => {
        setSelectedSlots(slots);
    };

    const handleContinue = () => {
        if (selectedSlots.length === 1) {
            navigation.navigate('RescheduleCourt', {
                selectedDate: selectedDate.toISOString(),
                selectedSlots,
                bookingId
            });
        }
    };

    return (
        <PageLayout>
            <Header title={t('common.goBack')} />
            <ScreenWrapper>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.section}>
                        <DateSelector
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                        />
                    </View>

                    <View style={styles.section}>
                        <TimeSlotSelector
                            maxSelections={1}
                            onSlotsSelect={handleSlotsSelect}
                        />
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title={t('reschedule.continueToCourt')}
                        onPress={handleContinue}
                        disabled={selectedSlots.length !== 1}
                        variant="primary"
                    />
                </View>
            </ScreenWrapper>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
});
