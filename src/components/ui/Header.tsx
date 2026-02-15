
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // დავამატეთ ეს
interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'left' | 'right'
}

export const Header: React.FC<HeaderProps> = ({ title, variant = 'left' }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const arrow = variant === 'left' ? "<" : ">";
  const styles = getStyles(variant);

  const handlePress = () => {
    if (variant === 'left') {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } else {
      navigation.navigate('Main');
    }
  };
  return (
    <View style={[
      styles.container,
      {
        height: 63 + insets.top,
      }
    ]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.6}
        style={styles.headerContent}
      >

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{arrow}</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (variant: 'left' | 'right') => StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: variant === 'left' ? 'flex-start' : 'flex-end',
    display: "flex",
  },
  headerContent: {

    flexDirection: variant === 'left' ? 'row-reverse' : 'row',
    gap: 5,

  },

  title: {
    fontSize: 18,
    color: colors.white,
    fontFamily: typography.fontFamily,
  },


});


