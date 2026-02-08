import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLogin } from '../hooks';
import { CustomButton, InputField, Header, ScreenWrapper, PageLayout } from '../components';
import { colors } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('შეცდომა', 'გთხოვთ შეავსოთ ყველა ველი');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <PageLayout style={styles.mainContainer}>
      <Header title="Skip for now" variant="right" />
      <ScreenWrapper>
        <InputField
          placeholder="ელ. ფოსტა"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          placeholder="პაროლი"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title="შესვლა"
          onPress={handleLogin}
          isLoading={loginMutation.isPending}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
          <Text style={styles.linkText}>არ გაქვს ანგარიში? რეგისტრაცია</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </PageLayout>

  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
  },
});
