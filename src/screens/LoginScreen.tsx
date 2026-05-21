import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useForgotPassword, useLogin, useApiError } from '../hooks';
import { useLanguageStore } from '../store/languageStore';
import {
  CustomButton,
  LabeledInputField,
  Header,
  ScreenWrapper,
  PageLayout,
  Text,
  ForgotPasswordModal,
  InfoModal,
} from '../components';
import { colors, typography } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { getLocalizedMessage } from '../utils/apiError';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const fromApp = route.params?.fromApp ?? false;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const loginMutation = useLogin();
  const forgotPasswordMutation = useForgotPassword();
  const { getApiError } = useApiError();

  const handleLogin = () => {
    let hasError = false;
    if (!username) { setUsernameError(t('common.required')); hasError = true; } else { setUsernameError(''); }
    if (!password) { setPasswordError(t('common.required')); hasError = true; } else { setPasswordError(''); }
    if (hasError) return;

    setApiError('');
    loginMutation.mutate({ username, password }, {
      onError: (error: any) => setApiError(getApiError(error)),
    });
  };

  const handleForgotPasswordOpen = () => {
    setForgotError('');
    setForgotModalVisible(true);
  };

  const handleForgotPasswordClose = () => {
    if (forgotPasswordMutation.isPending) return;
    setForgotModalVisible(false);
    setForgotError('');
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setForgotError('');
    forgotPasswordMutation.mutate(
      { user_login: email },
      {
        onSuccess: (data) => {
          if (!data.success) return;
          setForgotModalVisible(false);
          setSuccessMessage(getLocalizedMessage(data.message, language));
          setSuccessModalVisible(true);
        },
        onError: (error: any) => setForgotError(getApiError(error)),
      },
    );
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header
        title={fromApp ? t('common.goBack') : t('common.skipForNow')}
        variant={fromApp ? 'left' : 'right'}
      />
      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>{t('login.title')}</Text>
            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

            <LabeledInputField
              label={t('login.email')}
              placeholder={t('login.emailPlaceholder')}
              value={username}
              onChangeText={(v) => { setUsername(v); if (usernameError) setUsernameError(''); }}
              autoCapitalize="none"
              error={usernameError}
            />

            <LabeledInputField
              label={t('login.password')}
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(''); if (apiError) setApiError(''); }}
              secureTextEntry
              error={passwordError}
            />

            <TouchableOpacity
              style={styles.forgotPasswordRow}
              onPress={handleForgotPasswordOpen}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordLink}>{t('login.forgotPassword')}</Text>
            </TouchableOpacity>

            {!!apiError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.apiErrorText}>{apiError}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <CustomButton
              title={t('login.loginButton')}
              onPress={handleLogin}
              isLoading={loginMutation.isPending}
              style={styles.loginButton}
            />
            <CustomButton
              title={t('login.signUp')}
              onPress={() => navigation.navigate('Register', { fromApp })}
              variant="secondary"
              style={styles.signUpButton}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>

      <ForgotPasswordModal
        visible={forgotModalVisible}
        isLoading={forgotPasswordMutation.isPending}
        error={forgotError}
        onClose={handleForgotPasswordClose}
        onSubmit={handleForgotPasswordSubmit}
      />

      <InfoModal
        visible={successModalVisible}
        title={t('login.forgotPasswordSuccessTitle')}
        message={successMessage}
        primaryButtonText={t('common.ok')}
        onPrimaryPress={() => setSuccessModalVisible(false)}
        singleButton
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
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
  subtitle: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
    fontFamily: typography.fontFamily,
    marginBottom: 18,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    paddingRight: 9,
    marginTop: -4,
    marginBottom: 8,
  },
  forgotPasswordLink: {
    color: colors.lightPurple,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    paddingBottom: 40,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
    marginBottom: 8,
    marginTop: 3,
  },
  errorIcon: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 4,
  },
  apiErrorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
    flex: 1,
  },
  loginButton: {
    marginBottom: 10,
  },
  signUpButton: {
  },
});
