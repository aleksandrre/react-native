import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../theme';
import { Court } from '../../types';

interface CourtSelectorProps {
    selectedSlots: string[];
    selectedCourts: { [timeSlot: string]: string | null };
    onCourtSelect: (timeSlot: string, courtId: number, courtTitle: string) => void;
    courtsBySlot: Record<string, Court[]>;
    isLoading?: boolean;
}

export const CourtSelector: React.FC<CourtSelectorProps> = ({
    selectedSlots,
    selectedCourts,
    onCourtSelect,
    courtsBySlot,
    isLoading = false,
}) => {
    const { t } = useTranslation();

    if (isLoading) {
        // loading-ის დროს ძველი layout არ ვშლით, უბრალოდ არაფერი ვხატავთ
        return null;
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {selectedSlots.map((timeSlot) => {
                const courts = courtsBySlot[timeSlot] ?? [];

                return (
                    <View key={timeSlot} style={styles.timeColumn}>
                        <View style={styles.timeHeader}>
                            <Text style={styles.timeText}>{timeSlot}</Text>
                            <View style={styles.timeDivider} />
                        </View>

                        {courts.map((court) => {
                            const isSelected = selectedCourts[timeSlot] === court.court_number;
                            const courtLabel = `${t('courtCard.court')} ${court.court_number}`;

                            return (
                                <TouchableOpacity
                                    key={court.id}
                                    style={[
                                        styles.courtButton,
                                        isSelected && styles.courtButtonSelected,
                                    ]}
                                    onPress={() => onCourtSelect(timeSlot, court.id, court.court_number)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.courtText,
                                            isSelected && styles.courtTextSelected,
                                        ]}
                                    >
                                        {courtLabel}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    timeColumn: {
        flex: 1,
    },
    timeHeader: {
        marginBottom: 12,
    },
    timeText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilyBold,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    timeDivider: {
        height: 1,
        backgroundColor: colors.white,
    },
    courtButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    courtButtonSelected: {
        borderRadius: 23,
        backgroundColor: colors.primary,
        borderColor: colors.lightPurple,
    },
    courtText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.white,
    },
    courtTextSelected: {
        fontFamily: typography.fontFamilyBold,
    },
});
