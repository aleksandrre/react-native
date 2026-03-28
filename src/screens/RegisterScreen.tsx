import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../hooks';
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
  const registerMutation = useRegister();

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
    if (!username || !email || !phone || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('register.fillAll'));
      return;
    }

    if (!isValidLatinDisplayName(username)) {
      setUsernameError(t('register.usernameLatinError'));
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError(t('register.emailError'));
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError(t('register.phoneError'));
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError(t('register.passwordError'));
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(t('register.confirmPasswordError'));
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(t('common.error'), t('register.agreeTermsError'));
      return;
    }

    registerMutation.mutate({ username, email, password, phone });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header
        title={fromApp ? t('common.goBack') : t('common.skipForNow')}
        variant={fromApp ? 'left' : 'right'}
      />
      <ScreenWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              onToggle={() => setAgreedToTerms(!agreedToTerms)}
              label={
                <Text style={styles.termsText}>
                  {t('register.agreeTermsPrefix')}
                  <Text style={styles.linkText} onPress={openTerms}>
                    {t('register.terms')}
                  </Text>
                  {t('register.andSeparator')}
                  <Text style={styles.linkText} onPress={openTerms}>
                    {t('register.privacyPolicy')}
                  </Text>
                </Text>
              }
            />
          </View>

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
        </ScrollView>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    marginTop:20,
    marginBottom:30,
    display: 'flex',
    justifyContent: 'center',
  },
  termsText: {
    color: colors.white,
    fontSize: 12,
    lineHeight:15,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: typography.fontFamily,
  },
  linkText: {
    color: colors.lightPurple,
    fontFamily: typography.fontFamily,
  },
  
  linkContainer: {
  },
  footerText: {
    color: colors.white,
    fontSize: 14,
    lineHeight:18,
    marginTop:15,
    fontFamily: typography.fontFamily,
  },
  footerLink: {
    color: colors.lightPurple,
    fontFamily: typography.fontFamily,
  },
});
