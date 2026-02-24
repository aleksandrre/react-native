import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../theme';
import courtLogo from '../../../assets/court_logo.png';

interface CourtCardProps {
  courtNumber: string;
  date: string;
  time: string;
  onPress?: () => void;
  cancelled?: boolean;
}

export const CourtCard: React.FC<CourtCardProps> = ({ courtNumber, date, time, onPress, cancelled }) => {
  const { t } = useTranslation();
  const CardContent = (
    <View style={[styles.container]}>
      <ImageBackground
        source={courtLogo}
        style={[styles.courtSection]}
        imageStyle={[styles.courtImage]}
      >
        <Text style={[styles.courtLabel]}>{t('courtCard.court')}</Text>
        <Text style={[styles.courtNumber]}>{courtNumber}</Text>
      </ImageBackground>

      <View style={styles.dateTimeSection}>
        <Text style={[styles.dateText, cancelled && styles.textStrikethrough]}>{date}</Text>
        <Text style={[styles.timeText, cancelled && styles.textStrikethrough]}>{time}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(96, 35, 90, 0.9)',
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  courtSection: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70
  },
  courtImage: {
    resizeMode: 'cover',
  },
  courtLabel: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 13,
    fontFamily: typography.fontFamily,
  },
  courtNumber: {
    color: colors.white,
    fontSize: 40,
    lineHeight:40,
    fontFamily: typography.fontFamilyBold,
  },
  dateTimeSection: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  dateText: {
    color: colors.white,
    fontSize: 19,
    lineHeight:24,
    marginBottom: 10,
    fontFamily: typography.fontFamilyBold,
  },
  timeText: {
    color: colors.white,
    fontSize: 18,
    lineHeight:24,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily,
  },

  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: '#A4A4A4',
  },
});


