import React from 'react';
import { StyleSheet, SafeAreaView, View, ViewProps } from 'react-native';

interface PageLayoutProps extends ViewProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, style, ...props }) => {
  return (
    // SafeAreaView უზრუნველყოფს, რომ კონტენტი Notch-ის ქვეშ არ მოექცეს
    <SafeAreaView style={[styles.mainContainer, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});