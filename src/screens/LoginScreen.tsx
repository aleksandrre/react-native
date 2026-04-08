import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../hooks';
import { useApiError } from '../hooks/useApiError';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout, Text } from '../components';
import { colors, typography } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { t } = useTranslation();
  const fromApp = route.params?.fromApp ?? false;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const loginMutation = useLogin();
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
            {!!apiError && <Text style={styles.apiError}>⚠ {apiError}</Text>}
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
  buttonsContainer: {
    paddingBottom: 40,
  },
  apiError: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: typography.fontFamily,
    paddingLeft: 9,
    marginBottom: 8,
  },
  loginButton: {
    marginBottom: 10,
  },
  signUpButton: {
  },
});
