import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLogin } from '../hooks';
import { CustomButton, InputField, Header } from '../components';

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
    <View style={styles.container}>
      <Header title="შესვლა" />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 16,
  },
});
