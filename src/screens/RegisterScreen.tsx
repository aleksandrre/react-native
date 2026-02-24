import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../hooks';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout, Checkbox } from '../components';
import { colors, typography } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const registerMutation = useRegister();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue.length === 0) {
      setEmailError('');
    } else if (!emailRegex.test(emailValue)) {
      setEmailError(t('register.emailError'));
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length > 0 && pwd.length < 6) {
      setPasswordError(t('register.passwordError'));
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPwd: string) => {
    if (confirmPwd.length > 0 && confirmPwd !== password) {
      setConfirmPasswordError(t('register.confirmPasswordError'));
    } else {
      setConfirmPasswordError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    validateConfirmPassword(text);
  };

  const handleRegister = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('register.fillAll'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('register.emailError'));
      return;
    }

    if (password.length < 6) {
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

    registerMutation.mutate({ name, email, password });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header title={t('common.skipForNow')} variant="right" />
      <ScreenWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('register.title')}</Text>

          <LabeledInputField
            label={t('register.nameLabel')}
            placeholder={t('register.namePlaceholder')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <LabeledInputField
            label={t('register.emailLabel')}
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <LabeledInputField
            label={t('register.phoneLabel')}
            placeholder={t('register.phonePlaceholder')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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
                  <Text style={styles.linkText} onPress={() => { }}>
                    {t('register.terms')}
                  </Text>
                  {t('register.andSeparator')}
                  <Text style={styles.linkText} onPress={() => { }}>
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

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
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
