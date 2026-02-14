import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../theme';

const COURTS = ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5', 'Court 6', 'Court 7', 'Court 8'];

interface CourtSelectorProps {
    selectedSlots: string[];
    selectedCourts: { [timeSlot: string]: string | null };
    onCourtSelect: (timeSlot: string, courtId: string) => void;
}

export const CourtSelector: React.FC<CourtSelectorProps> = ({
    selectedSlots,
    selectedCourts,
    onCourtSelect,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {selectedSlots.map((timeSlot) => (
                <View key={timeSlot} style={styles.timeColumn}>
                    {/* Time Header */}
                    <View style={styles.timeHeader}>
                        <Text style={styles.timeText}>{timeSlot}</Text>
                        <View style={styles.timeDivider} />
                    </View>

                    {/* Courts */}
                    {COURTS.map((court) => {
                        const courtId = `${timeSlot}-${court}`;
                        const isSelected = selectedCourts[timeSlot] === courtId;
                        // Mock availability - consistent with original screen for now
                        // In a real app, availability should be passed via props
                        const isDisabled = false; // logic was Math.random() > 0.6, removed for stability or we can keep it inside if needed. 
                        // The original used Math.random() inside render which causes hydration mismatches or flickering. 
                        // Better to let the parent handle availability or default to true for now to avoid flickering.
                        // But if I want "exact design" including disabled states, I should probably accept an `availability` prop.
                        // For now I'll leave it enabled or maybe implement a deterministic mock if needed.
                        // Let's stick to enabled or minimal random (but random on every render is bad).

                        return (
                            <TouchableOpacity
                                key={court}
                                style={[
                                    styles.courtButton,
                                    isSelected && styles.courtButtonSelected,
                                    isDisabled && styles.courtButtonDisabled,
                                ]}
                                onPress={() => onCourtSelect(timeSlot, courtId)}
                                disabled={isDisabled}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.courtText,
                                        isSelected && styles.courtTextSelected,
                                        isDisabled && styles.courtTextDisabled,
                                    ]}
                                >
                                    {court}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
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
        fontFamily: typography.fontFamilySemiBold,
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
    courtButtonDisabled: {
        opacity: 0.3,
    },
    courtText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilyMedium,
        color: colors.white,
    },
    courtTextSelected: {
        fontFamily: typography.fontFamilySemiBold,
    },
    courtTextDisabled: {
        color: colors.lightGray,
    },
});
