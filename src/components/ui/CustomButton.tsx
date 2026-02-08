import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../theme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  isLoading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    (disabled || isLoading) && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    { color: variant === 'primary' ? colors.white : colors.primary }
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 23,
    alignItems: 'center',
    borderWidth: 1.5,
    marginTop: 10,
  },
  primary: {
    borderColor: colors.white,
    backgroundColor: colors.primary,
  },
  secondary: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {

    fontSize: 16,
  },
});


