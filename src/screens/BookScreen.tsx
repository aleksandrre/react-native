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
  };

  const handleSlotsSelect = (slots: string[]) => {
    setSelectedSlots(slots);
  };

  const handleContinue = () => {
    if (selectedSlots.length === 0) return;
    
    navigation.navigate('CourtSelection', {
      selectedDate,
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
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
        <TimeSlotSelector
          onSlotsSelect={handleSlotsSelect}
          maxSelections={3}
        />
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
  buttonContainer: {
    marginTop: 20,
  },
});
