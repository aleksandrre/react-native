import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';
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

  const handleSlotPress = (time: string, status: string) => {
    if (status !== 'available') return;

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

      {selectedSlots.length >= maxSelections && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={12} color="#FFC107" style={styles.warningIcon} />
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>{t('timeSlotSelector.warningBold')}</Text>
            {t('timeSlotSelector.warningText')}
          </Text>
        </View>
      )}

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
            {(availableTimes ?? []).map((slot) => {
              const isUnavailable = slot.status !== 'available';
              const isSelected = !isUnavailable && selectedSlots.includes(slot.time);

              return (
                <View key={slot.time} style={styles.slotButton}>
                  <TouchableOpacity
                    style={[
                      styles.slotButtonInner,
                      isSelected && styles.slotButtonInnerSelected,
                      isUnavailable && styles.slotButtonInnerUnavailable,
                    ]}
                    onPress={() => handleSlotPress(slot.time, slot.status)}
                    activeOpacity={isUnavailable ? 1 : 0.7}
                  >
                    <Text style={[
                      styles.slotText,
                      isSelected && styles.slotTextSelected,
                      isUnavailable && styles.slotTextUnavailable,
                    ]}>
                      {slot.time}
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
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderLeftColor: '#FFC107',
    marginBottom: 10,
  },
  warningIcon: {
    marginRight: 4,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
    color: colors.white,
  },
  warningBold: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamilyBold,
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
  slotButtonInnerUnavailable: {
    opacity: 1,
  },
  slotTextUnavailable: {
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
});
