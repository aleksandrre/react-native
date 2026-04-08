import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../hooks';
import { useApiError } from '../hooks/useApiError';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout, Checkbox, Text } from '../components';
import { colors, typography } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { useLanguageStore } from '../store/languageStore';
import {
  isValidLatinDisplayName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
} from '../utils/validation';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;
type RegisterScreenRouteProp = RouteProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const route = useRoute<RegisterScreenRouteProp>();
  const { t } = useTranslation();
  const fromApp = route.params?.fromApp ?? false;
  const { language } = useLanguageStore();

  const openTerms = () => {
    const url = language === 'ka'
      ? 'https://kustbapadel.ge/terms-and-rules/'
      : 'https://kustbapadel.ge/en/terms-and-conditions/';
    Linking.openURL(url);
  };
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [apiError, setApiError] = useState('');
  const registerMutation = useRegister();
  const { getApiError } = useApiError();
  const insets = useSafeAreaInsets();

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (text.length > 0) {
      setUsernameError(isValidLatinDisplayName(text) ? '' : t('register.usernameLatinError'));
    } else {
      setUsernameError('');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      setEmailError(isValidEmail(text) ? '' : t('register.emailError'));
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (text.length > 0) {
      setPhoneError(isValidPhone(text) ? '' : t('register.phoneError'));
    } else {
      setPhoneError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length > 0) {
      setPasswordError(isValidPassword(text) ? '' : t('register.passwordError'));
    } else {
      setPasswordError('');
    }
    if (confirmPassword.length > 0) {
      setConfirmPasswordError(text === confirmPassword ? '' : t('register.confirmPasswordError'));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text.length > 0) {
      setConfirmPasswordError(text === password ? '' : t('register.confirmPasswordError'));
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleRegister = () => {
    let hasError = false;

    if (!username) { setUsernameError(t('common.required')); hasError = true; }
    else if (!isValidLatinDisplayName(username)) { setUsernameError(t('register.usernameLatinError')); hasError = true; }
    else { setUsernameError(''); }

    if (!email) { setEmailError(t('common.required')); hasError = true; }
    else if (!isValidEmail(email)) { setEmailError(t('register.emailError')); hasError = true; }
    else { setEmailError(''); }

    if (!phone) { setPhoneError(t('common.required')); hasError = true; }
    else if (!isValidPhone(phone)) { setPhoneError(t('register.phoneError')); hasError = true; }
    else { setPhoneError(''); }

    if (!password) { setPasswordError(t('common.required')); hasError = true; }
    else if (!isValidPassword(password)) { setPasswordError(t('register.passwordError')); hasError = true; }
    else { setPasswordError(''); }

    if (!confirmPassword) { setConfirmPasswordError(t('common.required')); hasError = true; }
    else if (password !== confirmPassword) { setConfirmPasswordError(t('register.confirmPasswordError')); hasError = true; }
    else { setConfirmPasswordError(''); }

    if (!agreedToTerms) { setTermsError(t('register.agreeTermsError')); hasError = true; }
    else { setTermsError(''); }

    if (hasError) return;

    setApiError('');
    registerMutation.mutate({ username, email, password, phone }, {
      onError: (error: any) => setApiError(getApiError(error)),
    });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header
        title={fromApp ? t('common.goBack') : t('common.skipForNow')}
        variant={fromApp ? 'left' : 'right'}
      />
      <ScreenWrapper>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{t('register.title')}</Text>

          <LabeledInputField
            label={t('register.usernameLabel')}
            placeholder={t('register.usernamePlaceholder')}
            value={username}
            onChangeText={handleUsernameChange}
            autoCapitalize="words"
            error={usernameError}
          />

          <LabeledInputField
            label={t('register.emailLabel')}
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <LabeledInputField
            label={t('register.phoneLabel')}
            placeholder={t('register.phonePlaceholder')}
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            error={phoneError}
          />

          <LabeledInputField
            label={t('register.passwordLabel')}
            placeholder={t('register.passwordPlaceholder')}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            error={passwordError}
          />

          <LabeledInputField
            label={t('register.confirmPasswordLabel')}
            placeholder={t('register.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry
            error={confirmPasswordError}
          />

          <View style={styles.termsContainer}>
            <Checkbox
              checked={agreedToTerms}
              onToggle={() => { setAgreedToTerms(!agreedToTerms); if (termsError) setTermsError(''); }}
              label={
                <Text style={styles.termsText} >
                  {t('register.agreeTermsPrefix')}
                  <Text onPress={openTerms}>
                    <Text style={styles.linkText}>
                      {t('register.terms')}
                    </Text>
                    {t('register.andSeparator')}
                    <Text style={styles.linkText}>
                      {t('register.privacyPolicy')}
                    </Text>
                  </Text>

                </Text>
              }
            />
            {!!termsError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{termsError}</Text>
              </View>
            )}
          </View>

          {!!apiError && <Text style={styles.apiError}>⚠ {apiError}</Text>}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <CustomButton
            title={t('register.signUpButton')}
            onPress={handleRegister}
            isLoading={registerMutation.isPending}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login', { fromApp })} style={styles.linkContainer}>
            <Text style={styles.footerText}>
              {t('register.alreadyHaveAccount')}
              <Text style={styles.footerLink}>{t('register.logInHere')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
  },
  footer: {
    backgroundColor: colors.dark,
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 18,
    lineHeight: 23,
    fontFamily: typography.fontFamilyBold,
  },
  termsContainer: {
    paddingLeft: 9,
    marginTop: 10,
    marginBottom: 30,
    display: 'flex',
    justifyContent: 'center',
  },
  termsText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 15,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: typography.fontFamily,
  },
  linkText: {
    color: colors.lightPurple,
    fontFamily: typography.fontFamily,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  errorIcon: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
  },
  apiError: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
    paddingLeft: 9,
    marginBottom: 8,
  },

  linkContainer: {
  },
  footerText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 15,
    fontFamily: typography.fontFamily,
  },
  footerLink: {
    color: colors.lightPurple,
    fontFamily: typography.fontFamily,
  },
});
