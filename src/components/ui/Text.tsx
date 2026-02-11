import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography } from '../../theme';

interface TextProps extends RNTextProps {
  weight?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
}

export const Text: React.FC<TextProps> = ({ 
  style, 
  weight = 'regular',
  ...props 
}) => {
  const fontFamily = 
    weight === 'light' ? typography.fontFamilyLight :
    weight === 'medium' ? typography.fontFamilyMedium :
    weight === 'semiBold' ? typography.fontFamilySemiBold :
    weight === 'bold' ? typography.fontFamilyBold :
    typography.fontFamily;

  return (
    <RNText 
      style={[styles.text, { fontFamily }, style]} 
      {...props} 
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: typography.fontFamily,
  },
});

