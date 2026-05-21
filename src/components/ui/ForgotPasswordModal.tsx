import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from './Text';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../../theme';

interface ForgotPasswordModalProps {
  visible: boolean;
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  isLoading = false,
  error,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (visible) {
      setEmail('');
      setEmailError('');
    }
  }, [visible]);

  const handleSubmit = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError(t('common.required'));
      return;
    }
    setEmailError('');
    onSubmit(trimmed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{t('login.forgotPasswordTitle')}</Text>
            <Text style={styles.subtitle}>{t('login.forgotPasswordSubtitle')}</Text>

            <Text style={styles.label}>{t('login.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor={colors.gray}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoFocus
              editable={!isLoading}
            />

            {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}
            {!!error && <Text style={styles.fieldError}>{error}</Text>}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>{t('login.forgotPasswordSubmit')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    width: '100%',
    maxWidth: 320,
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: typography.fontFamily,
    color: colors.gray,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 8,
  },
  fieldError: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
    color: colors.error,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamilySemiBold,
  },
});
