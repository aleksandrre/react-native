import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PageLayout, ScreenWrapper, DateSelector, ImageHeader, TimeSlotSelector } from '../components';
import { colors } from '../theme';
import book from '../../assets/book.png';

export const BookScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const handleSlotsSelect = (slots: string[]) => {
    setSelectedSlots(slots);
    console.log('Selected slots:', slots);
  };

  return (
    <PageLayout>
      <ImageHeader
        title="KUS TBA PADEL"
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
       
      </ScreenWrapper>
    </PageLayout>
  );
};




