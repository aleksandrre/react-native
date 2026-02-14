
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'left' | 'right'
}

export const Header: React.FC<HeaderProps> = ({ title, variant = 'left' }) => {
  const insets = useSafeAreaInsets();
  const arrow = variant === 'left' ? "<" : ">";
  const styles = getStyles(variant);
  return (
    <View style={[
      styles.container,
      {
        height: 63 + insets.top,
      }
    ]}>
      <View style={styles.headerContent}>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{arrow}</Text>
      </View>
    </View>
  );
};

const getStyles = (variant: 'left' | 'right') => StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 10,
    justifyContent:'flex-end',
    alignItems:variant === 'left' ? 'flex-start' : 'flex-end',
    display:"flex",
  },
  headerContent:{
    
    flexDirection:variant === 'left' ? 'row-reverse' : 'row',
    gap:5,
    
  },

  title: {
    fontSize: 18,
    color: colors.white,
    fontFamily: typography.fontFamily,
  },
  
  
});


