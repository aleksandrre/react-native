import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRegister } from '../hooks';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout, Checkbox } from '../components';
import { colors } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
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
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length > 0 && pwd.length < 6) {
      setPasswordError('Please enter at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPwd: string) => {
    if (confirmPwd.length > 0 && confirmPwd !== password) {
      setConfirmPasswordError('Please enter matching password');
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
      Alert.alert('შეცდომა', 'გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Please enter at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Please enter matching password');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('შეცდომა', 'გთხოვთ დაეთანხმოთ წესებსა და კონფიდენციალურობის პოლიტიკას');
      return;
    }

    registerMutation.mutate({ name, email, password });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header title="Skip for now" variant="right" />
      <ScreenWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Sign Up</Text>

          <LabeledInputField
            label="Name*"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <LabeledInputField
            label="Email*"
            placeholder="Email"
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
            label="Phone*"
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <LabeledInputField
            label="Password*"
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            error={passwordError}
          />

          <LabeledInputField
            label="Confirm password*"
            placeholder="Confirm password"
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
                  I agree to the{' '}
                  <Text style={styles.linkText} onPress={() => { }}>
                    terms
                  </Text>
                  {' & '}
                  <Text style={styles.linkText} onPress={() => { }}>
                    privacy policy
                  </Text>
                </Text>
              }
            />
          </View>

          <CustomButton
            title="Sign up"
            onPress={handleRegister}
            isLoading={registerMutation.isPending}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink}>Log in here</Text>
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
    lineHeight: 23
  },
  termsContainer: {
    paddingLeft: 9,
    marginBottom: 10,
    height: 34,
    display: 'flex',
    justifyContent: 'center',
  },
  termsText: {
    color: colors.white,
    fontSize: 12,
    lineHeight:15,
    flex: 1,
    flexWrap: 'wrap',
  },
  linkText: {
    color: colors.lightPurple,
  },
  
  linkContainer: {
  },
  footerText: {
    color: colors.white,
    fontSize: 14,
    lineHeight:18,
  },
  footerLink: {
    color: colors.lightPurple,
  },
});

