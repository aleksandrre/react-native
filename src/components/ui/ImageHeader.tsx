import React from 'react';
import { StyleSheet, Text, ImageBackground, View } from 'react-native';
import { colors } from '../../theme';

interface ImageHeaderProps {
  title: string;
  imageSource: any; // აქ გადააწვდი სურათის ლინკს ან ლოკალურ ფაილს
}

export const ImageHeader: React.FC<ImageHeaderProps> = ({ title, imageSource }) => {
  return (
    <ImageBackground
      source={imageSource}
      style={styles.background}
      resizeMode="cover" // სურათი სრულად შეავსებს 141px-ს
    >
      {/* შავი გადაკვრა (Overlay), რომ ტექსტი უკეთ იკითხებოდეს */}
      <View >
        <Text style={styles.title}>{title}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    height: 141,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  title: {
    fontSize: 40,
    lineHeight:70,

    color: colors.white,
    textAlign: 'center',
  },
});


