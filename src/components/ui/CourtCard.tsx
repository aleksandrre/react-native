import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
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
  const CardContent = (
    <View style={[styles.container, cancelled && styles.containerCancelled]}>
      <ImageBackground
        source={courtLogo}
        style={[styles.courtSection, cancelled && styles.courtSectionCancelled]}
        imageStyle={[styles.courtImage, cancelled && styles.courtImageCancelled]}
      >
        <Text style={[styles.courtLabel, cancelled && styles.textCancelled]}>court</Text>
        <Text style={[styles.courtNumber, cancelled && styles.textCancelled]}>{courtNumber}</Text>
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
    lineHeight: 37,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBold,
  },
  dateTimeSection: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  dateText: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 10,
    fontFamily: typography.fontFamily,
  },
  timeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBold,
  },
  containerCancelled: {
    opacity: 0.6,
  },
  courtSectionCancelled: {
    opacity: 0.8,
  },
  courtImageCancelled: {
    opacity: 0.5,
  },
  textCancelled: {
    color: colors.gray,
  },
  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: colors.gray,
  },
});


