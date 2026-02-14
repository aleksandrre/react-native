import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface PageLayoutProps extends ViewProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={[styles.mainContainer, style]} edges={['top', 'left', 'right',]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor:colors.primary
  },
});

