import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTypography } from '../../hooks';

interface TextProps extends RNTextProps {
  weight?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  style,
  weight = 'regular',
  ...props
}) => {
  const typo = useTypography();

  const fontFamily =
    weight === 'light' ? typo.fontFamilyLight :
    weight === 'medium' ? typo.fontFamilyMedium :
    weight === 'semiBold' ? typo.fontFamilySemiBold :
    weight === 'bold' ? typo.fontFamilyBold :
    typo.fontFamily;

  return <RNText style={[{ fontFamily }, style]} {...props} />;
};
