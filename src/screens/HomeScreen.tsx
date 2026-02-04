import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { CustomButton, Header } from '../components';
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
      
    </PageLayout>
    
  );
};

const styles = StyleSheet.create({
  
});
