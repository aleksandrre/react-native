import React from 'react';
import { View, Text, StyleSheet, TextInputProps } from 'react-native';
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
        <Text style={styles.errorText}>
          <Text style={styles.warningIcon}>⚠</Text> {error}
        </Text>
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
    lineHeight:18,
    fontFamily: typography.fontFamily,
  },
  input: {
    marginBottom: 0,
  },
 
  
  errorText: {
    color: colors.lightPurple,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 4,
    paddingLeft: 9,
    fontFamily: typography.fontFamily,
  },
  warningIcon: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 4,
  },
});

