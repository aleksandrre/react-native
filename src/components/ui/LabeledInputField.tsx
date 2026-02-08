import React from 'react';
import { View, Text, StyleSheet, TextInputProps } from 'react-native';
import { InputField } from './InputField';
import { colors } from '../../theme';

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
      {error && (
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
    marginBottom: 12,
  },
  label: {
    paddingLeft: 9,
    color: colors.white,
    fontSize: 14,
    marginBottom: 12,
    lineHeight:18
  },
  input: {
    marginBottom: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorIcon: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 6,
  },
  errorText: {
    color: colors.primary,
    fontSize: 12,
  },
});

