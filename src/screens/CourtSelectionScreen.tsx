import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useDateLocale } from '../hooks';
import { PageLayout, ScreenWrapper, CustomButton, Header, CourtSelector } from '../components';
import { BookStackParamList } from '../navigation/MainNavigator';
import { colors, typography } from '../theme';

type RouteParams = {
  CourtSelection: {
    selectedDate: Date;
    selectedSlots: string[];
  };
};

type CourtSelectionRouteProp = RouteProp<RouteParams, 'CourtSelection'>;

interface CourtSelection {
  [timeSlot: string]: string | null;
}

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

type CourtSelectionNavigationProp = NativeStackNavigationProp<BookStackParamList, 'CourtSelection'>;

export const CourtSelectionScreen: React.FC = () => {
  const navigation = useNavigation<CourtSelectionNavigationProp>();
  const route = useRoute<CourtSelectionRouteProp>();
  const { t } = useTranslation();
  const dateLocale = useDateLocale();

  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const selectedSlots = Array.isArray(route.params?.selectedSlots) ? route.params.selectedSlots : [];

  const [selectedCourts, setSelectedCourts] = useState<CourtSelection>({});
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

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

    navigation.navigate('Summary', {
      selectedDate,
      selectedSlots,
      selectedCourts,
    });
  };

  const allSelected = selectedSlots.every((slot) => selectedCourts[slot]);

  return (
    <PageLayout>
      <Header title={t('common.goBack')} />
      <ScreenWrapper>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('courtSelection.title')} </Text>
          <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
            <Text style={styles.viewCourts}>{t('courtSelection.viewCourts')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={12} color="#FFC107" style={styles.warningIcon} />
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>{t('courtSelection.warningBold')}</Text>
            {t('courtSelection.warningText')}
          </Text>
        </View>

        <Text style={styles.selectedDate}>
          {t('courtSelection.selectedDate')} <Text style={styles.selectedDateValue}>{formatSelectedDate(selectedDate, dateLocale)}</Text>
        </Text>

        <CourtSelector
          selectedSlots={selectedSlots}
          selectedCourts={selectedCourts}
          onCourtSelect={handleCourtPress}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title={t('courtSelection.continueToSummary')}
            onPress={handleContinue}
            disabled={!allSelected}
          />
        </View>
      </ScreenWrapper>

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <BlurView intensity={10} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Ionicons name="close" size={30} color={colors.dark} />
            </TouchableOpacity>
            <Image
              source={require('../../assets/corts.png')}
              style={styles.courtsImage}
              resizeMode="contain"
            />
          </View>
        </BlurView>
      </Modal>
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
    fontSize: 18,
    lineHeight: 23,
    fontFamily: typography.fontFamilyBold,
    color: colors.white,
  },
  viewCourts: {
    fontSize: 18,
    lineHeight: 23,
    fontFamily: typography.fontFamily,
    color: colors.lightPurple,
    textDecorationLine: 'underline',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderLeftColor: '#FFC107',
    marginTop: 10,
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
  selectedDate: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.white,
    marginBottom: 10,
  },
  selectedDateValue: {
    fontFamily: typography.fontFamily,
    color: colors.lightGray,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 16,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 10,
  },
  courtsImage: {
    width: '100%',
    height: 280,
  },
});
