import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { CustomButton, Header } from '../components';

export const HomeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={styles.container}>
      <Header 
        title="მოგესალმებით! 👋" 
        subtitle="თქვენ წარმატებით შეხვედით"
      />

      <CustomButton
        title="გასვლა"
        onPress={logout}
        variant="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});
