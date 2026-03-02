import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../hooks';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout } from '../components';
import { colors, typography } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert(t('common.error'), t('login.fillAll'));
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header title={t('common.skipForNow')} variant="right" />
      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>{t('login.title')}</Text>

            <LabeledInputField
              label={t('login.username')}
              placeholder={t('login.usernamePlaceholder')}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <LabeledInputField
              label={t('login.password')}
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
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
              onPress={() => navigation.navigate('Register')}
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
    marginTop: 'auto',
    paddingTop: 20,
  },
  loginButton: {
    marginBottom: 10,
  },
  signUpButton: {
  },
});
