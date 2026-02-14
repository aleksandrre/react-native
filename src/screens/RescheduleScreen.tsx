import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
    // bookingId might be needed for the actual reschedule API call later
    const { bookingId } = route.params || {};

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedSlots([]); // Clear time slots when date changes
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
            <Header title="Go Back" />
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
                        title="Continue to court"
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
        paddingBottom: 100, // Space for the fixed button
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
