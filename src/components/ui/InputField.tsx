import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography } from '../../theme';

interface InputFieldProps extends TextInputProps {}

export const InputField: React.FC<InputFieldProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.lightGray}
      editable={true}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 12,
    height: 34,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
    color: colors.white,
    fontFamily: typography.fontFamily,
    textAlignVertical: 'center',
  },
});


