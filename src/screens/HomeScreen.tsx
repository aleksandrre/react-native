import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { CustomButton, Header, CourtCard } from '../components';
import { PageLayout } from '../components/PageLayout';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ImageHeader } from '../components/ImageHeader';
import cover from '../../assets/cover.png';
export const HomeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <PageLayout>
      <ImageHeader
          title="Bookings!"
          imageSource={cover}
        />
      
      <View style={styles.cardsContainer}>
        <CourtCard 
          courtNumber="3"
          date="Fri, 17 Dec 2025"
          time="10:00"
        />
        
        <CourtCard 
          courtNumber="5"
          date="Sat, 18 Dec 2025"
          time="14:30"
        />
      </View>
      
    </PageLayout>
    
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    width: '100%',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
