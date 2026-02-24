import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { colors, typography } from '../theme';
import { useLanguageStore } from '../store/languageStore';
import onboardImage from '../../assets/onboard.png';
import flagGB from '../../assets/flag_gb.png';
import flagGE from '../../assets/flag_ge.png';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { t } = useTranslation();
  const { setLanguage } = useLanguageStore();

  const handleBegin = () => {
    setLanguage('en');
    navigation.navigate('Register');
  };

  const handleGeorgian = () => {
    setLanguage('ka');
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.descriptionText}>
          {t('onboarding.description')}
        </Text>
        
        <Image 
          source={onboardImage} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleBegin}
            activeOpacity={0.8}
          >
            <Image source={flagGB} style={styles.flagIcon} />
            <Text style={styles.primaryButtonText}>Begin</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleGeorgian}
            activeOpacity={0.8}
          >
            <Image source={flagGE} style={styles.flagIcon} />
            <Text style={styles.primaryButtonText}>შესვლა</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 27,
    color: colors.white,
    textAlign: 'left',
    fontFamily: typography.fontFamilyBold,
  },
  image: {
    width: '100%',
    height: 180,
    marginTop:30,
    marginBottom:24
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 23,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  flagIcon: {
    width: 22,
    height: 15,
    borderRadius: 2,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    lineHeight:20,
    fontFamily: typography.fontFamilyBold,
  },
  
});
