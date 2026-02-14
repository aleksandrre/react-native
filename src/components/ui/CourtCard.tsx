import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../theme';
import courtLogo from '../../../assets/court_logo.png';

interface CourtCardProps {
  courtNumber: string;
  date: string;
  time: string;
  onPress?: () => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ courtNumber, date, time, onPress }) => {
  const CardContent = (
    <View style={styles.container}>
      <ImageBackground
        source={courtLogo}
        style={styles.courtSection}
        imageStyle={styles.courtImage}
      >
        <Text style={styles.courtLabel}>court</Text>
        <Text style={styles.courtNumber}>{courtNumber}</Text>
      </ImageBackground>

      <View style={styles.dateTimeSection}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.timeText}>{time}</Text>
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
    backgroundColor: '#1E1E1E',
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
});


