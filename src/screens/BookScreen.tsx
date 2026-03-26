import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { PageLayout, ScreenWrapper, DateSelector, ImageHeader, TimeSlotSelector, CustomButton } from '../components';
import { BookStackParamList } from '../navigation/MainNavigator';
import { colors } from '../theme';
import book from '../../assets/book.png';

type BookScreenNavigationProp = NativeStackNavigationProp<
  BookStackParamList,
  'BookHome'
>;

export const BookScreen: React.FC = () => {
  const navigation = useNavigation<BookScreenNavigationProp>();
  const { t } = useTranslation();
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
    if (selectedSlots.length === 0) return;
    
    navigation.navigate('CourtSelection', {
      selectedDate: selectedDate.toISOString(),
      selectedSlots,
    });
  };

  return (
    <PageLayout>
      <ImageHeader
        title={t('book.title')}
        imageSource={book}
      />
      <ScreenWrapper>
        <View style={styles.content}>
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <TimeSlotSelector
            selectedDate={selectedDate}
            onSlotsSelect={handleSlotsSelect}
            maxSelections={3}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={t('common.continue')}
            onPress={handleContinue}
            disabled={selectedSlots.length === 0}
          />
        </View>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 0,
  },
});
