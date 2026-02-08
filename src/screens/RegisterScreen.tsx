import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRegister } from '../hooks';
import { CustomButton, InputField, Header } from '../components';
import { colors } from '../theme';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert('შეცდომა', 'გთხოვთ შეავსოთ ყველა ველი');
      return;
    }
    registerMutation.mutate({ name, email, password });
  };

  return (
    <View style={styles.container}>
      <Header title="რეგისტრაცია" />

      <InputField
        placeholder="სახელი"
        value={name}
        onChangeText={setName}
      />

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
        title="რეგისტრაცია"
        onPress={handleRegister}
        isLoading={registerMutation.isPending}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>უკვე გაქვს ანგარიში? შესვლა</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white,
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
