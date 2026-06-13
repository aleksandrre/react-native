import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { colors, typography } from '../../theme';

interface InputFieldProps extends TextInputProps {}

export const InputField: React.FC<InputFieldProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.lightGray}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.dark,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'android' ? 0 : 8,
    borderRadius: 5,
    height: 34,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
    color: colors.white,
    fontFamily: typography.fontFamily,
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
      textAlignVertical: 'center',
    }),
  },
});


