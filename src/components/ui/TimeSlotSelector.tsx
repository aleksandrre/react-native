import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../theme';
import { useAvailableSlots } from '../../hooks';

interface TimeSlotSelectorProps {
  selectedDate: Date;
  onSlotsSelect?: (slots: string[]) => void;
  maxSelections?: number;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  onSlotsSelect,
  maxSelections = 3,
}) => {
  const { t } = useTranslation();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const { data: availableTimes, isLoading, isError } = useAvailableSlots(selectedDate);

  useEffect(() => {
    setSelectedSlots([]);
    onSlotsSelect?.([]);
  }, [selectedDate]);

  const handleSlotPress = (time: string) => {
    let newSelection: string[];

    if (selectedSlots.includes(time)) {
      newSelection = selectedSlots.filter((t) => t !== time);
    } else if (maxSelections === 1) {
      newSelection = [time];
    } else if (selectedSlots.length >= maxSelections) {
      return;
    } else {
      newSelection = [...selectedSlots, time];
    }

    setSelectedSlots(newSelection);
    onSlotsSelect?.(newSelection);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {maxSelections > 1 ? t('timeSlotSelector.selectTimes') : t('timeSlotSelector.selectTime')}
      </Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : isError ? (
        <Text style={styles.errorText}>{t('timeSlotSelector.error')}</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.slotsGrid}>
            {(availableTimes ?? []).map((time) => {
              const isSelected = selectedSlots.includes(time);

              return (
                <View key={time} style={styles.slotButton}>
                  <TouchableOpacity
                    style={[
                      styles.slotButtonInner,
                      isSelected && styles.slotButtonInnerSelected,
                    ]}
                    onPress={() => handleSlotPress(time)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
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
  loader: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    color: colors.lightGray,
    marginTop: 12,
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
  slotText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
    color: colors.white,
  },
  slotTextSelected: {
    fontFamily: typography.fontFamilySemiBold,
  },
});
