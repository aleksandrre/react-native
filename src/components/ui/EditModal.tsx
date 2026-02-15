import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../../theme';

interface EditModalProps {
    visible: boolean;
    title: string;
    placeholder: string;
    initialValue?: string;
    message?: string;
    mode?: 'input' | 'otp';
    onClose: () => void;
    onSave: (value: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
    visible,
    title,
    placeholder,
    initialValue = '',
    message,
    mode = 'input',
    onClose,
    onSave,
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (visible) {
            setValue(initialValue);
        }
    }, [visible, initialValue]);

    const handleSave = () => {
        onSave(value);
        if (mode === 'otp') {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={10} style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>{title}</Text>

                    {message && (
                        <Text style={styles.message}>{message}</Text>
                    )}

                    {mode === 'otp' && (
                        <Text style={styles.label}>OTP Code:</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor={colors.gray}
                        value={value}
                        onChangeText={setValue}
                        autoFocus
                        keyboardType={mode === 'otp' ? 'number-pad' : 'default'}
                        maxLength={mode === 'otp' ? 6 : undefined}
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 320,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeText: {
        fontSize: 24,
        color: colors.dark,
        fontWeight: '300',
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: typography.fontFamilySemiBold,
        color: colors.dark,
        textAlign: 'left',
        marginTop: 40,
        marginBottom: 20,
    },
    message: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: typography.fontFamily,
        color: colors.dark,
        textAlign: 'center',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamily,
        color: colors.dark,
        marginBottom: 8,
        textAlign: 'left',
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        fontFamily: typography.fontFamily,
        color: colors.dark,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 14,
        lineHeight: 18,
        fontFamily: typography.fontFamilySemiBold,
    },
});
