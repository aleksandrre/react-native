import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PageLayout, ScreenWrapper, DateSelector } from '../components';
import { colors } from '../theme';

export const BookScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  return (
    <PageLayout>
      <ScreenWrapper>
        <View style={styles.container}>
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </View>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
});

