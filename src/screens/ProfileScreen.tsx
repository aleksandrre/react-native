import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { ImageHeader, PageLayout, ScreenWrapper, CustomButton, EditModal } from '../components';
import { colors } from '../theme';
import profile from '../../assets/profile.png';
import pencil from '../../assets/pencil.svg';
import { useNavigation } from '@react-navigation/native';
export const ProfileScreen: React.FC = () => {
  // დროებითი state სიმულაციისთვის. რეალურ აპში ეს გლობალური უნდა იყოს.
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [name, setName] = useState('Name Surname');
  const [email, setEmail] = useState('name@mail.com');
  const [phone, setPhone] = useState('+xx xxx xxx xxx');

  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [editType, setEditType] = useState<'name' | 'email' | 'phone'>('name');
  const [tempValue, setTempValue] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPhone, setPendingPhone] = useState('');

  const navigation = useNavigation<any>();

  const handleEdit = (type: 'name' | 'email' | 'phone') => {
    setEditType(type);
    if (type === 'name') {
      setTempValue(name);
    } else if (type === 'email') {
      setTempValue(email);
    } else if (type === 'phone') {
      setTempValue(phone);
    }
    setEditModalVisible(true);
  };

  const handleSaveEdit = (value: string) => {
    if (editType === 'name') {
      setName(value);
      setEditModalVisible(false);
    } else if (editType === 'email') {
      setPendingEmail(value);
      setEditModalVisible(false);
      setOtpModalVisible(true);
    } else if (editType === 'phone') {
      setPendingPhone(value);
      setEditModalVisible(false);
      setOtpModalVisible(true);
    }
  };

  const handleSaveOTP = (otp: string) => {
    // აქ უნდა იყოს OTP ვერიფიკაცია
    console.log('OTP:', otp);
    if (editType === 'email') {
      setEmail(pendingEmail);
    } else if (editType === 'phone') {
      setPhone(pendingPhone);
    }
    setOtpModalVisible(false);
  };

  // დამხმარე კომპონენტი ინფორმაციის ხაზებისთვის (დალოგინებულზე)
  const InfoRow = ({ label, value, editable = true, onEdit }: { label: string, value: string, editable?: boolean, onEdit?: () => void }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoText}>{label}: <Text style={styles.infoValue}>{value}</Text></Text>
      {editable && onEdit && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Image source={pencil} style={styles.pencilIcon} />
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
            <InfoRow label="Name" value={name} onEdit={() => handleEdit('name')} />
            <InfoRow label="Email" value={email} onEdit={() => handleEdit('email')} />
            <InfoRow label="Phone" value={phone} onEdit={() => handleEdit('phone')} />
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Language:</Text>
              <View style={styles.langPicker}><Text style={styles.whiteText}>EN ▼</Text></View>
            </View>
            <Text style={[styles.infoText]}>Credits: <Text style={styles.infoValue}>{'{x}'}</Text></Text>

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
              onPress={() => {
                // გადავდივართ Auth სთექის შიგნით არსებულ Register გვერდზე
                navigation.getParent()?.navigate('Auth', { screen: 'Register' });
              }}
            />

            <CustomButton
              title="Log in"
              variant="secondary"
              onPress={() => {
                // გადავდივართ Auth სთექის შიგნით არსებულ Login გვერდზე
                navigation.getParent()?.navigate('Auth', { screen: 'Login' });
              }}
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

      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        title={`Edit ${editType === 'name' ? 'Name' : editType === 'email' ? 'Email' : 'Phone'}`}
        placeholder={editType === 'name' ? 'Name Surname' : editType === 'email' ? 'name@mail.com' : '+xx xxx xxx xxx'}
        initialValue={tempValue}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
      />

      {/* OTP Modal */}
      <EditModal
        visible={otpModalVisible}
        title={`Edit ${editType === 'email' ? 'Email' : 'Phone'}`}
        placeholder="XXXX"
        mode="otp"
        message={`A verification OTP code has been sent to {${editType === 'email' ? pendingEmail : pendingPhone}}. Please enter your OTP code below to confirm and save.`}
        onClose={() => setOtpModalVisible(false)}
        onSave={handleSaveOTP}
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 18,
  },

  sectionTitle: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 'bold',
    color: colors.white,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 23,
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
    lineHeight: 20,
    color: colors.white,
  },
  infoValue: {
    fontWeight: '600',
  },
  whiteText: { color: colors.white, fontSize: 16, lineHeight: 20 },
  editButton: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilIcon: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  langPicker: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 3,
    paddingVertical: 6,
    borderRadius: 6,

  },
  signUpBtn: {
    marginTop: 12,
    marginBottom: 0

  },


  contactSection: {
    alignItems: 'center',
    gap: 20,
    marginTop: 12

  },
  contactTitle: { color: colors.white, fontSize: 16, lineHeight: 20, fontWeight: 'bold' },
  contactText: { color: colors.white, fontSize: 16, lineHeight: 20 },
  link: { textDecorationLine: 'underline', fontSize: 16, lineHeight: 20 },
  footer: { marginTop: 7, alignItems: 'center' },
  footerText: { color: colors.white, fontSize: 14, lineHeight: 18 },
  footerLink: { color: colors.lightPurple, textDecorationLine: 'underline', fontSize: 14, lineHeight: 18 },
});