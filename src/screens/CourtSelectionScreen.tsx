import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { PageLayout, ScreenWrapper, CustomButton, Header } from '../components';
import { colors, typography } from '../theme';

type RouteParams = {
  CourtSelection: {
    selectedDate: Date;
    selectedSlots: string[];
  };
};

type CourtSelectionRouteProp = RouteProp<RouteParams, 'CourtSelection'>;

interface CourtSelection {
  [timeSlot: string]: string | null; // courtId or null
}

const COURTS = ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5', 'Court 6', 'Court 7', 'Court 8'];

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

export const CourtSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CourtSelectionRouteProp>();

  // Safe fallbacks to prevent TypeError
  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const selectedSlots = Array.isArray(route.params?.selectedSlots) ? route.params.selectedSlots : [];

  const [selectedCourts, setSelectedCourts] = useState<CourtSelection>({});

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

    console.log('Continue to summary:', { selectedDate, selectedSlots, selectedCourts });
    // TODO: Navigate to summary screen
  };

  const allSelected = selectedSlots.every((slot) => selectedCourts[slot]);

  return (
    <PageLayout>
      <Header title="Go Back" />
      <ScreenWrapper>
        {/* Header with Go Back */}


        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select courts </Text>
          <Text style={styles.viewCourts}>(view courts)</Text>
        </View>

        {/* Warning */}
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={12} color="#FFC107" style={styles.warningIcon} />
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>Max. 3 sessions in a booking:</Text>
            {' '}please deselect a session to choose a different one
          </Text>
        </View>

        {/* Selected Date */}
        <Text style={styles.selectedDate}>
          Selected date: <Text style={styles.selectedDateValue}>{formatSelectedDate(selectedDate)}</Text>
        </Text>

        {/* Courts Grid */}
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
                const isDisabled = Math.random() > 0.6; // Mock availability

                return (
                  <TouchableOpacity
                    key={court}
                    style={[
                      styles.courtButton,
                      isSelected && styles.courtButtonSelected,
                      isDisabled && styles.courtButtonDisabled,
                    ]}
                    onPress={() => handleCourtPress(timeSlot, courtId)}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: typography.fontFamilyMedium,
    color: colors.white,
    marginLeft: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.white,
  },
  viewCourts: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: typography.fontFamilyMedium,
    color: colors.lightPurple,
    textDecorationLine: 'underline',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
    marginTop: 10,
    marginBottom: 10,
  },
  warningIcon: {
    marginRight: 8,
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
    fontFamily: typography.fontFamilySemiBold,
  },
  selectedDate: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
    color: colors.lightGray,
    marginBottom: 10,
  },
  selectedDateValue: {
    fontFamily: typography.fontFamilySemiBold,
    color: colors.white,

  },
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
  buttonContainer: {
    marginBottom: 0,
  },
});

