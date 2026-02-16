import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, typography } from '../../theme';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  onSlotsSelect?: (slots: string[]) => void;
  maxSelections?: number;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '08:00', available: true },
  { id: '2', time: '09:00', available: true },
  { id: '3', time: '10:00', available: true },
  { id: '4', time: '11:00', available: true },
  { id: '5', time: '12:00', available: true },
  { id: '6', time: '13:00', available: true },
  { id: '7', time: '14:00', available: true },
  { id: '8', time: '15:00', available: true },
  { id: '9', time: '16:00', available: true },
  { id: '10', time: '17:00', available: true },
  { id: '11', time: '18:00', available: true },
  { id: '12', time: '19:00', available: true },
  { id: '13', time: '20:00', available: true },
  { id: '14', time: '21:00', available: true },
  { id: '15', time: '22:00', available: true },
];

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  onSlotsSelect,
  maxSelections = 3,
}) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const handleSlotPress = (slotId: string, slotTime: string, available: boolean) => {
    if (!available) return;

    setSelectedSlots((prev) => {
      let newSelection: string[];

      if (prev.includes(slotTime)) {
        // Deselect
        newSelection = prev.filter((time) => time !== slotTime);
      } else {
        // Select
        if (maxSelections === 1) {
          newSelection = [slotTime];
        } else {
          if (prev.length >= maxSelections) {
            return prev; // Already at max
          }
          newSelection = [...prev, slotTime];
        }
      }

      onSlotsSelect?.(newSelection);
      return newSelection;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{maxSelections > 1 ? 'Select times' : 'Select time'}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlots.includes(slot.time);
            const isDisabled = !slot.available;

            return (
              <View key={slot.id} style={styles.slotButton}>
                <TouchableOpacity
                  style={[
                    styles.slotButtonInner,
                    isSelected && styles.slotButtonInnerSelected,
                    isDisabled && styles.slotButtonInnerDisabled,
                  ]}
                  onPress={() => handleSlotPress(slot.id, slot.time, slot.available)}
                  activeOpacity={isDisabled ? 1 : 0.7}
                  disabled={isDisabled}
                >
                  <Text
                    style={[
                      styles.slotText,
                      isSelected && styles.slotTextSelected,
                      isDisabled && styles.slotTextDisabled,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
    fontFamily: typography.fontFamilyBold,
    color: colors.white,
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotButton: {
    width: '25%',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  slotButtonInner: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotButtonInnerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.lightPurple,
    borderRadius: 23,
  },
  slotButtonInnerDisabled: {
    backgroundColor: colors.dark,
    borderColor: colors.gray,
    opacity: 0.3,
  },
  slotText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
    color: colors.white,
  },
  slotTextSelected: {
    fontFamily: typography.fontFamilySemiBold,
  },
  slotTextDisabled: {
    color: colors.lightGray,
  },
});

