import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PageLayout, ScreenWrapper } from '../components';
import { colors, typography } from '../theme';

export const ProfileScreen: React.FC = () => {
  return (
    <PageLayout>
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
        </View>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    fontFamily: typography.fontFamilyBold,
  },
});

