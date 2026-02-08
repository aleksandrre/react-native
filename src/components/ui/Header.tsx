import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'left' | 'right'
}

export const Header: React.FC<HeaderProps> = ({ title, variant = 'left' }) => {
  const arrow = variant === 'left' ? "<" : ">";
  const styles = getStyles(variant);
  return (
    <View style={styles.container}>
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
    height: 63,
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
  },
  
  
});


