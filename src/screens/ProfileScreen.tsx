import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ImageHeader, PageLayout, ScreenWrapper, CustomButton } from '../components';
import { colors,  } from '../theme';
import profile from '../../assets/profile.png';
import pencil from '../../assets/pencil.svg'
export const ProfileScreen: React.FC = () => {
  // დროებითი state სიმულაციისთვის. რეალურ აპში ეს გლობალური უნდა იყოს.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // დამხმარე კომპონენტი ინფორმაციის ხაზებისთვის (დალოგინებულზე)
  const InfoRow = ({ label, value, editable = true }: { label: string, value: string, editable?: boolean }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoText}>{label}: <Text style={styles.infoValue}>{value}</Text></Text>
      {editable && (
        <TouchableOpacity style={{height:34, display:'flex',justifyContent:'center'}}>
          <img src={pencil} alt="" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <PageLayout>
      <ImageHeader imageSource={profile} title="Profile" />
      <ScreenWrapper>
        {isLoggedIn ? (
          /* --- დალოგინებული მომხმარებლის ხედი --- */
            <View style={styles.section}>
              <InfoRow label="Name" value="{Name Surname}" />
              <InfoRow label="Email" value="{name@mail.com}" />
              <InfoRow label="Phone" value="{+xx xxx xxx xxx}" />
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Language:</Text>
                <View style={styles.langPicker}><Text style={styles.whiteText}>EN ▼</Text></View>
              </View>
              <Text style={[styles.infoText, { marginTop: 10 }]}>Credits: <Text style={styles.infoValue}>{'{x}'}</Text></Text>
              
              <CustomButton 
                title="Log out" 
                onPress={() => setIsLoggedIn(false)}
              />
            </View>
        ) : (
          /* --- დაულოგინებელი მომხმარებლის ხედი --- */
          <View>
              <Text style={styles.sectionTitle}>Become a member</Text>
              <Text style={styles.subtitle}>Please log in to see all settings.</Text>
              
              <CustomButton 
                title="Sign Up" 
                variant="primary"
                style={styles.signUpBtn}
              />
              
              <CustomButton 
                title="Log in" 
                variant="secondary"
                onPress={() => setIsLoggedIn(true)}
              />

              <View style={[styles.infoRow]}>
                <Text style={styles.infoText}>Language:</Text>
                <View style={styles.langPicker}><Text style={styles.whiteText}>EN ▼</Text></View>
              </View>
            </View>
        )}

        {/* --- ორივე ხედისთვის საერთო "Contact Us" სექცია --- */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>Phone/WhatsApp: 
            <Text style={styles.link} onPress={() => Linking.openURL('tel:+995599xxxxxx')}> +995 599 xxx xxx</Text>
          </Text>
          <Text style={styles.contactText}>Email: 
            <Text style={styles.link} onPress={() => Linking.openURL('mailto:kustbapadel@gmail.com')}> kustbapadel@gmail.com</Text>
          </Text>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Kus Tba Padel tech is built by:</Text>
            <Text style={styles.footerLink} onPress={() => Linking.openURL('https://conceptdigital.com')}>Conceptdigital.com</Text>
          </View>
        </View>
      </ScreenWrapper>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 18,
  },
  
  sectionTitle: {
    fontSize: 18,
    lineHeight:18,
    fontWeight: 'bold',
    color: colors.white,
    alignSelf: 'flex-start',
    marginBottom:4,
  },
  subtitle: {
    fontSize: 18,
    lineHeight:23,
    color: colors.white,
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  infoText: {
    fontSize: 16,
    lineHeight:20,
    color: colors.white,
  },
  infoValue: {
    fontWeight: '600',
  },
  whiteText: { color: colors.white,fontSize:16,lineHeight:20 },
  langPicker: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 3,
    paddingVertical:6,
    borderRadius: 6,
    
  },
  signUpBtn:{
    marginTop:12,
    marginBottom:0

  },
 
  
  contactSection: {
    alignItems: 'center',
    gap: 20,
    marginTop:12

  },
  contactTitle: { color: colors.white, fontSize: 16,lineHeight:20, fontWeight: 'bold' },
  contactText: { color: colors.white, fontSize: 16,lineHeight:20 },
  link: { textDecorationLine: 'underline',fontSize:16,lineHeight:20 },
  footer: { marginTop: 7, alignItems: 'center' },
  footerText: { color: colors.white, fontSize: 14,lineHeight:18 },
  footerLink: { color: '#a366ff', textDecorationLine: 'underline', fontSize: 14,lineHeight:18 },
});