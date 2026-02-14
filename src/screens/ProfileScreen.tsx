import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ImageHeader, PageLayout, ScreenWrapper, CustomButton } from '../components';
import { colors, typography } from '../theme';
import profile from '../../assets/profile.png';
import { Ionicons } from '@expo/vector-icons'; // ან სხვა icon ბიბლიოთეკა

export const ProfileScreen: React.FC = () => {
  // დროებითი state სიმულაციისთვის. რეალურ აპში ეს გლობალური უნდა იყოს.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // დამხმარე კომპონენტი ინფორმაციის ხაზებისთვის (დალოგინებულზე)
  const InfoRow = ({ label, value, editable = true }: { label: string, value: string, editable?: boolean }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoText}>{label}: <Text style={styles.infoValue}>{value}</Text></Text>
      {editable && (
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={20} color={colors.primary} />
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
          <View style={styles.content}>
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
                style={styles.logoutBtn}
              />
            </View>
          </View>
        ) : (
          /* --- დაულოგინებელი მომხმარებლის ხედი --- */
          <View style={styles.content}>
            <View style={styles.authSection}>
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
                style={styles.logInBtn}
              />

              <View style={[styles.infoRow, { marginTop: 20 }]}>
                <Text style={styles.infoText}>Language:</Text>
                <View style={styles.langPicker}><Text style={styles.whiteText}>EN ▼</Text></View>
              </View>
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
  content: {
    flex: 1,
  },
  section: {
    gap: 15,
    marginTop: 10,
  },
  authSection: {
    alignItems: 'center',
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
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.white,
  },
  infoValue: {
    fontWeight: '600',
  },
  whiteText: { color: colors.white },
  langPicker: {
    borderWidth: 1,
    borderColor: colors.white,
    padding: 5,
    borderRadius: 5,
  },
  signUpBtn: {
    backgroundColor: '#63255a', // ფერი სქრინშოტიდან
    width: '100%',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  logInBtn: {
    backgroundColor: colors.white,
    width: '100%',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnText: { color: colors.white, fontSize: 18, fontWeight: '600' },
  logInBtnText: { color: '#63255a', fontSize: 18, fontWeight: '600' },
  logoutBtn: { marginTop: 10 },
  logoutText: { color: colors.white, textDecorationLine: 'underline', fontSize: 16 },
  
  contactSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 10,
  },
  contactTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  contactText: { color: colors.white, fontSize: 14 },
  link: { textDecorationLine: 'underline' },
  footer: { marginTop: 15, alignItems: 'center' },
  footerText: { color: colors.white, fontSize: 12 },
  footerLink: { color: '#a366ff', textDecorationLine: 'underline', fontSize: 12 },
});