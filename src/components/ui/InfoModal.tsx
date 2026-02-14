import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../../theme';

interface InfoModalProps {
    visible: boolean;
    title: string;
    message?: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
    onPrimaryPress: () => void;
    onSecondaryPress?: () => void;
    singleButton?: boolean;
}

export const InfoModal: React.FC<InfoModalProps> = ({
    visible,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    singleButton = false,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onSecondaryPress || onPrimaryPress}
        >
            <BlurView intensity={10} style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {message && <Text style={styles.message}>{message}</Text>}

                    <View style={styles.buttonContainer}>
                        {!singleButton && secondaryButtonText && onSecondaryPress && (
                            <TouchableOpacity
                                style={[styles.button, styles.secondaryButton]}
                                onPress={onSecondaryPress}
                            >
                                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                                    {secondaryButtonText}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={onPrimaryPress}
                        >
                            <Text style={[styles.buttonText, styles.primaryButtonText]}>
                                {primaryButtonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 320,
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.dark,
        textAlign: 'center',
        marginBottom: 20,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: typography.fontFamily,
        color: colors.dark,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
    },
    secondaryButtonText: {
        color: colors.primary,
    },
    primaryButtonText: {
        color: colors.white,
    },
});
