import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../theme';

interface ReservationTimerProps {
    formattedTime: string;
}

export const ReservationTimer: React.FC<ReservationTimerProps> = ({ formattedTime }) => {
    const { t } = useTranslation();
    return (
        <View style={styles.reservationBanner}>
            <Text >
            ⏱️
            </Text>
            
            <Text style={styles.reservationText}>
                
                {t('summary.reservationTimer', { time: formattedTime })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    reservationBanner: {
        backgroundColor: '#60235acb',
        borderRadius: 15,
        alignSelf: 'center',
        paddingVertical: 5,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    reservationText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.white,
    },
});
