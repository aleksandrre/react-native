import React from 'react';
import { StyleSheet, Text, ImageBackground, View } from 'react-native';
import { colors, typography } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface ImageHeaderProps {
  title: string;
  imageSource: any; // აქ გადააწვდი სურათის ლინკს ან ლოკალურ ფაილს
}

export const ImageHeader: React.FC<ImageHeaderProps> = ({ title, imageSource }) => {
  const insets = useSafeAreaInsets(); // ვიგებთ სტატუს ბარის ზუსტ სიმაღლეს
  return (
    <ImageBackground
      source={imageSource}
      style={[
        styles.background,
        {
          height: 141 + insets.top,
        }
      ]}
      resizeMode="cover" // სურათი სრულად შეავსებს 141px-ს
    >
      <View >
        <Text style={styles.title}>{title}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  title: {
    fontSize: 40,
    lineHeight: 70,
    color: colors.white,
    textAlign: 'center',
    fontFamily: typography.fontFamily,
  },
});


