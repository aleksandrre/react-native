import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PageLayout, ScreenWrapper, DateSelector, ImageHeader } from '../components';
import { colors } from '../theme';
import book from '../../assets/book.png';

export const BookScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
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
      </ScreenWrapper>
    </PageLayout>
  );
};



