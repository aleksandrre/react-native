import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLogin } from '../hooks';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout } from '../components';
import { colors, typography } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const loginMutation = useLogin();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handleLogin = () => {
    let hasError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('This field is required');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email');
        hasError = true;
      }
    }

    // Validate password
    if (!password) {
      setPasswordError('This field is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Please enter a valid password');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header title="Skip for now" variant="right" />
      <ScreenWrapper>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome back! Log in:</Text>

            <LabeledInputField
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <LabeledInputField
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Log in"
              onPress={handleLogin}
              isLoading={loginMutation.isPending}
              style={styles.loginButton}
            />

            <CustomButton
              title="Sign up"
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
