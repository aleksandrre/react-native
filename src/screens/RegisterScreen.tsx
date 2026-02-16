import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRegister } from '../hooks';
import { CustomButton, LabeledInputField, Header, ScreenWrapper, PageLayout, Checkbox } from '../components';
import { colors, typography } from '../theme';
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

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const validateName = (nameValue: string) => {
    if (nameValue.length === 0) {
      setNameError('');
    } else if (nameValue.length < 2) {
      setNameError('Name must be at least 2 characters');
    } else if (nameValue.length > 50) {
      setNameError('Name must be less than 50 characters');
    } else {
      setNameError('');
    }
  };

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

  const validatePhone = (phoneValue: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (phoneValue.length === 0) {
      setPhoneError('');
    } else if (!phoneRegex.test(phoneValue)) {
      setPhoneError('Please enter a valid phone number');
    } else if (phoneValue.replace(/[\s\+\-\(\)]/g, '').length < 9) {
      setPhoneError('Phone number must be at least 9 digits');
    } else {
      setPhoneError('');
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length === 0) {
      setPasswordError('');
    } else if (pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPwd: string) => {
    if (confirmPwd.length === 0) {
      setConfirmPasswordError('');
    } else if (confirmPwd !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    validateName(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmail(text);
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    validatePhone(text);
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
    let hasError = false;

    // Check if all required fields are filled
    if (!name.trim()) {
      setNameError('This field is required');
      hasError = true;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      hasError = true;
    } else if (name.length > 50) {
      setNameError('Name must be less than 50 characters');
      hasError = true;
    }

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

    if (!phone.trim()) {
      setPhoneError('This field is required');
      hasError = true;
    } else {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        setPhoneError('Please enter a valid phone number');
        hasError = true;
      } else if (phone.replace(/[\s\+\-\(\)]/g, '').length < 9) {
        setPhoneError('Phone number must be at least 9 digits');
        hasError = true;
      }
    }

    if (!password) {
      setPasswordError('This field is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('This field is required');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (!agreedToTerms) {
      setTermsError('You must agree to the terms & privacy policy');
      hasError = true;
    } else {
      setTermsError('');
    }

    if (hasError) {
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
            onChangeText={handleNameChange}
            autoCapitalize="words"
            error={nameError}
          />

          <LabeledInputField
            label="Email*"
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <LabeledInputField
            label="Phone*"
            placeholder="Phone number"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            error={phoneError}
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
              onToggle={() => {
                setAgreedToTerms(!agreedToTerms);
                if (termsError) setTermsError('');
              }}
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
            {termsError && (
              <Text style={styles.termsErrorText}>
                <Text style={styles.warningIcon}>⚠</Text> {termsError}
              </Text>
            )}
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
  termsErrorText: {
    color: colors.lightPurple,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 8,
    fontFamily: typography.fontFamily,
  },
  warningIcon: {
    color: '#FFD700',
    fontSize: 14,
    marginRight: 4,
  },
});

