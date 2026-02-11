import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle, label }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <View style={styles.checkmark} />}
      </View>
      {label && <View style={styles.labelContainer}>{label}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    width: 6,
    height: 10,
    borderColor: colors.white,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  labelContainer: {
    flex: 1,
  },
});

