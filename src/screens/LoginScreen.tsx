import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLogin } from '../hooks';
import { CustomButton, InputField, Header } from '../components';
import { colors } from '../theme';
import { ScreenWrapper, } from '../components/ScreenWrapper';
import { PageLayout } from '../components/PageLayout';
import { ImageHeader } from '../components/ImageHeader';
import Cover from '../../assets/cover.png';
interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
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
      <ImageHeader
        title="მოგესალმებით"
        imageSource={Cover}
      />
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

        <TouchableOpacity onPress={onNavigateToRegister} style={styles.linkContainer}>
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
