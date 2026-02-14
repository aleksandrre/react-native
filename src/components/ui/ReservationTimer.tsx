import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export const ReservationTimer: React.FC = () => {
    return (
        <View style={styles.reservationBanner}>
            <Text style={styles.reservationText}>⏱️ Your sessions are reserved for 4:59</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    reservationBanner: {
        backgroundColor: '#60235acb',
        borderRadius: 15,
        alignSelf: 'center', // Changed from margin: auto to alignSelf: center for better React Native support
        paddingVertical: 5,
        paddingHorizontal: 16, // Increased padding
        alignItems: 'center',
        marginBottom: 20,
    },
    reservationText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
    },
});
