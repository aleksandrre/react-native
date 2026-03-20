import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ImageHeader, PageLayout, ScreenWrapper, CustomButton, EditModal } from '../components';
import { colors, typography } from '../theme';
import profile from '../../assets/profile.png';
import pencil from '../../assets/pencil.svg';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useUpdateProfile } from '../hooks';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editType, setEditType] = useState<'name' | 'email' | 'phone'>('name');
  const [tempValue, setTempValue] = useState('');

  const navigation = useNavigation<any>();

  const handleEdit = (type: 'name' | 'email' | 'phone') => {
    setEditType(type);
    if (type === 'name') setTempValue(user?.display_name ?? '');
    else if (type === 'email') setTempValue(user?.email ?? '');
    else setTempValue(user?.phone ?? '');
    setEditModalVisible(true);
  };

  const handleSaveEdit = (value: string) => {
    const payload = {
      display_name: editType === 'name' ? value : (user?.display_name ?? ''),
      email: editType === 'email' ? value : (user?.email ?? ''),
      phone: editType === 'phone' ? value : (user?.phone ?? ''),
    };

    updateProfile(payload, {
      onSuccess: () => setEditModalVisible(false),
      onError: () => Alert.alert(t('common.error'), t('profile.updateFailed')),
    });
  };

  const handleLogout = () => {
    logout();
  };

  const getEditTitle = () => {
    if (editType === 'name') return t('profile.editName');
    if (editType === 'email') return t('profile.editEmail');
    return t('profile.editPhone');
  };

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
      <ImageHeader imageSource={profile} title={t('profile.title')} />
      <ScreenWrapper>
        {isAuthenticated ? (
          <View style={styles.section}>
            <InfoRow label={t('profile.name')} value={user?.display_name ?? '—'} onEdit={() => handleEdit('name')} />
            <InfoRow label={t('profile.email')} value={user?.email ?? '—'} onEdit={() => handleEdit('email')} />
            <InfoRow label={t('profile.phone')} value={user?.phone ?? '—'} onEdit={() => handleEdit('phone')} />
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{t('profile.language')}</Text>
              <View style={styles.langPickerRow}>
                <TouchableOpacity
                  style={[styles.langOption, language === 'en' && styles.langOptionActive]}
                  onPress={() => setLanguage('en')}
                >
                  <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.langOption, language === 'ka' && styles.langOptionActive]}
                  onPress={() => setLanguage('ka')}
                >
                  <Text style={[styles.langOptionText, language === 'ka' && styles.langOptionTextActive]}>KA</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.infoText}>{t('profile.credits')} <Text style={styles.infoValue}>{user?.credits ?? 0}</Text></Text>

            <CustomButton
              title={t('profile.logOut')}
              onPress={handleLogout}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>{t('profile.becomeMember')}</Text>
            <Text style={styles.subtitle}>{t('profile.pleaseLogIn')}</Text>

            <CustomButton
              title={t('profile.signUp')}
              variant="primary"
              style={styles.signUpBtn}
              onPress={() => {
                navigation.getParent()?.navigate('Auth', { screen: 'Register' });
              }}
            />

            <CustomButton
              title={t('profile.logIn')}
              variant="secondary"
              style={styles.signInBtn}
              onPress={() => {
                navigation.getParent()?.navigate('Auth', { screen: 'Login' });
              }}
            />

            <View style={[styles.infoRow]}>
              <Text style={styles.infoText}>{t('profile.language')}</Text>
              <View style={styles.langPickerRow}>
                <TouchableOpacity
                  style={[styles.langOption, language === 'en' && styles.langOptionActive]}
                  onPress={() => setLanguage('en')}
                >
                  <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.langOption, language === 'ka' && styles.langOptionActive]}
                  onPress={() => setLanguage('ka')}
                >
                  <Text style={[styles.langOptionText, language === 'ka' && styles.langOptionTextActive]}>KA</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>{t('profile.contactUs')}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Phone/WhatsApp:</Text>
            <Text style={styles.linkText} onPress={() => Linking.openURL('tel:+995585889977')}>
              +995 585 88 99 77
            </Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.linkText} onPress={() => Linking.openURL('mailto:kustbapadel@gmail.com')}>
              kustbapadel@gmail.com
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('profile.builtBy')}</Text>
            <Text style={styles.footerLink} onPress={() => Linking.openURL('https://conceptdigital.com')}>Conceptdigital.com</Text>
          </View>
        </View>
      </ScreenWrapper>

      <EditModal
        visible={editModalVisible}
        title={getEditTitle()}
        placeholder={editType === 'name' ? 'Name Surname' : editType === 'email' ? 'name@mail.com' : '+xx xxx xxx xxx'}
        initialValue={tempValue}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 18,
    color: colors.white,
    fontFamily:typography.fontFamilyBold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 23,
    color: colors.white,
    fontFamily:typography.fontFamily,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 34,
    color: colors.white,
    fontFamily:typography.fontFamily
  },
  infoValue: {
    fontFamily:typography.fontFamilyBold
  },
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
  langPickerRow: {
    flexDirection: 'row',
    gap: 4,
  },
  langOption: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 40,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langOptionActive: {
    borderColor: colors.white,
    backgroundColor: colors.primary,
  },
  langOptionText: {
    color: colors.lightGray,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: typography.fontFamilySemiBold,
  },
  langOptionTextActive: {
    color: colors.white,
  },
  signUpBtn: {
    marginTop: 12,
    marginBottom: 8,
  },
  signInBtn:{
    marginBottom:12
  },
  contactSection: {
    gap: 20,
    marginTop: 12
  },
  contactTitle: { color: colors.white, fontSize: 16, lineHeight: 20, fontFamily:typography.fontFamilyBold ,textAlign:"center"},
  contactText: { color: colors.white, fontSize: 16, lineHeight: 20,fontFamily:typography.fontFamily},
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactLabel: { color: colors.white, fontSize: 16, lineHeight: 20, fontFamily: typography.fontFamily, marginRight: 6 },
  linkText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 16,
    fontFamily: typography.fontFamily,
    textDecorationLine: 'underline',
  },
  footer: { marginTop: 7, alignItems: 'center' },
  footerText: { color: colors.white, fontSize: 14, lineHeight: 18,fontFamily:typography.fontFamily },
  footerLink: { color: colors.lightPurple, textDecorationLine: 'underline', fontSize: 14, lineHeight: 18,fontFamily:typography.fontFamily },
});
