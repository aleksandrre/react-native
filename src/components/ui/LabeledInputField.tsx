import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import { Text } from './Text';
import { InputField } from './InputField';
import { colors, typography } from '../../theme';

interface LabeledInputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const LabeledInputField: React.FC<LabeledInputFieldProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <InputField style={[styles.input, style]} {...props} />
      {!!error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    paddingLeft: 9,
    color: colors.white,
    fontSize: 14,
    marginBottom: 6,
    lineHeight:18,
    fontFamily: typography.fontFamily,
  },
  input: {
    marginBottom: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    paddingLeft:9
  },
  errorIcon: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    color: colors.lightPurple,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
  },
});

