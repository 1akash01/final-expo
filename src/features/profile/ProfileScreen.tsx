import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Screen, UserRole } from '@/shared/types/navigation';
import {
  AppIcon,
  C,
  PreferenceContext,
  defaultProfile,
  getThemePalette,
  translations,
  type AppLanguage,
  type IconName,
  type Profile,
  type SubPage,
} from './ProfileShared';
import { AppSettingsPage } from './AppSettings';
import { BankDetailsPage } from './BankDetails';
import { ContactSupportPage } from './ContactSupport';
import { MyOrdersPage } from './MyOrders';
import { RedemptionPage } from './MyRedemption';
import { NeedHelpPage } from './NeedHelp';
import { NotificationsPage } from './Notifications';
import { OffersPage } from './Offers';
import { ReferFriendPage } from './ReferFriend';
import { ScanHistoryPage } from './ScanHistory';
import { TransferPointsPage } from './TransferPoints';

const quickActions: Array<{
  label: keyof (typeof translations)['English'];
  icon: IconName;
  color: string;
  bg: string;
  screen?: SubPage;
  route?: Screen;
}> = [
  { label: 'redemptionHistory', icon: 'gift', color: C.primary, bg: C.primaryLight, screen: 'My Redemption' },
  { label: 'giftStore', icon: 'gift', color: C.gold, bg: C.goldLight, route: 'rewards' },
  { label: 'transferPoint', icon: 'transfer', color: C.blue, bg: C.blueLight, screen: 'Transfer Points' },
  { label: 'myOrders', icon: 'order', color: C.purple, bg: C.purpleLight, screen: 'My Orders' },
  { label: 'bankDetails', icon: 'bank', color: C.gold, bg: C.goldLight, screen: 'Bank Details' },
  { label: 'referFriend', icon: 'refer', color: C.teal, bg: C.tealLight, screen: 'Refer To A Friend' },
  { label: 'needHelp', icon: 'help', color: C.primary, bg: C.primaryLight, screen: 'Need Help' },
  { label: 'offer', icon: 'offer', color: C.gold, bg: C.goldLight, screen: 'Offers & Promotions' },
];

const settingsActions: Array<{
  label: keyof (typeof translations)['English'];
  icon: IconName;
  color: string;
  bg: string;
  screen: SubPage;
}> = [
  { label: 'notification', icon: 'notification', color: C.gold, bg: C.goldLight, screen: 'Notifications' },
  { label: 'appSettings', icon: 'settings', color: C.purple, bg: C.purpleLight, screen: 'App Settings' },
  { label: 'scanHistory', icon: 'history', color: C.primary, bg: C.primaryLight, screen: 'Scan History' },
  { label: 'contactSupport', icon: 'support', color: C.teal, bg: C.tealLight, screen: 'Contact Support' },
];

const detailRows: Array<{ label: string; key: keyof Profile; emptyText?: string }> = [
  { label: 'Mobile Number', key: 'phone' },
  { label: 'Email', key: 'email', emptyText: 'Not provided' },
  { label: 'Address', key: 'address' },
  { label: 'State', key: 'state' },
  { label: 'City', key: 'city' },
  { label: 'Pincode', key: 'pincode' },
  { label: 'GST Holder Name', key: 'gstHolderName' },
  { label: 'GST Number', key: 'gstNumber' },
  { label: 'PAN Holder Name', key: 'panHolderName', emptyText: 'Not provided' },
  { label: 'PAN Number', key: 'panNumber', emptyText: 'Not provided' },
  { label: 'Dealer Code', key: 'dealerCode' },
];

const editRows: Array<{ label: string; key: keyof Profile; keyboardType?: 'default' | 'phone-pad' }> = [
  { label: 'Full Name', key: 'name' },
  { label: 'Phone Number', key: 'phone', keyboardType: 'phone-pad' },
  { label: 'Email', key: 'email' },
  { label: 'City', key: 'city' },
  { label: 'State', key: 'state' },
  { label: 'Pincode', key: 'pincode', keyboardType: 'phone-pad' },
  { label: 'Address', key: 'address' },
  { label: 'GST Holder Name', key: 'gstHolderName' },
  { label: 'GST Number', key: 'gstNumber' },
  { label: 'PAN Holder Name', key: 'panHolderName' },
  { label: 'PAN Number', key: 'panNumber' },
  { label: 'Dealer Code', key: 'dealerCode' },
];

const fallbackT = (language: AppLanguage, key: keyof (typeof translations)['English']) => {
  const value = translations[language][key];
  return /[Ãàâ¨]/.test(value) ? translations.English[key] : value;
};

const getProfileByRole = (currentRole: UserRole): Profile =>
  currentRole === 'dealer'
    ? {
        ...defaultProfile,
        name: 'Pawan Electricals',
        phone: '9876543210',
        email: 'sales@pawanelectricals.com',
        state: 'Punjab',
        city: 'Mansa',
        pincode: '151505',
        address: 'Shop No. 18, Power Market, Near Bus Stand, Mansa, Punjab 151505',
        gstHolderName: 'Pawan Kumar',
        gstNumber: '03ABCDE1234F1Z5',
        panHolderName: 'Pawan Kumar',
        panNumber: 'ABCDE1234F',
        dealerCode: 'PB-05-800206-001',
      }
    : defaultProfile;

export function ProfileScreen({
  currentRole,
  onNavigate,
  onSignOut,
}: {
  currentRole: UserRole;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [darkMode, setDarkMode] = useState(false);
  const initialProfile = useMemo(() => getProfileByRole(currentRole), [currentRole]);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [draft, setDraft] = useState<Profile>(initialProfile);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(null);
  const [pendingDraftImage, setPendingDraftImage] = useState<string | null>(null);

  useEffect(() => {
    setProfile(initialProfile);
    setDraft(initialProfile);
    setSubPage(null);
    setShowEdit(false);
    setShowSignOut(false);
    setProfilePhotoUri(null);
    setDraftPhotoUri(null);
    setPendingDraftImage(null);
  }, [initialProfile]);

  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => fallbackT(language, key);
  const preferenceValue = { language, setLanguage, darkMode, setDarkMode, t, theme };
  const initials = useMemo(
    () =>
      profile.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [profile.name]
  );

  const openEdit = () => {
    setDraft(profile);
    setDraftPhotoUri(profilePhotoUri);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setDraft(profile);
    setDraftPhotoUri(profilePhotoUri);
    setPendingDraftImage(null);
    setShowEdit(false);
  };

  const saveProfile = () => {
    setProfile(draft);
    setProfilePhotoUri(draftPhotoUri);
    setPendingDraftImage(null);
    setShowEdit(false);
  };

  const pickDraftPhoto = async (source: 'camera' | 'gallery') => {
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Allow camera access to update your profile photo.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled && result.assets?.length) {
          setPendingDraftImage(result.assets[0].uri);
        }
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow gallery access to update your profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setPendingDraftImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Unable to update photo', 'Please try again.');
    }
  };

  const cancelDraftPhoto = () => setPendingDraftImage(null);

  const confirmDraftPhoto = () => {
    setDraftPhotoUri(pendingDraftImage);
    setPendingDraftImage(null);
  };

  const subpages: Record<Exclude<SubPage, null>, React.ReactElement> = {
    'My Redemption': (
      <RedemptionPage
        onBack={() => setSubPage(null)}
        onNavigate={onNavigate}
        onOpenBankDetails={() => setSubPage('Bank Details')}
        onOpenTransferPoints={() => setSubPage('Transfer Points')}
      />
    ),
    'Transfer Points': <TransferPointsPage onBack={() => setSubPage(null)} onNavigate={onNavigate} />,
    'My Orders': <MyOrdersPage onBack={() => setSubPage(null)} />,
    'Bank Details': <BankDetailsPage onBack={() => setSubPage(null)} />,
    'Refer To A Friend': <ReferFriendPage onBack={() => setSubPage(null)} />,
    'Need Help': <NeedHelpPage onBack={() => setSubPage(null)} />,
    'Offers & Promotions': <OffersPage onBack={() => setSubPage(null)} />,
    Notifications: <NotificationsPage onBack={() => setSubPage(null)} />,
    'App Settings': <AppSettingsPage onBack={() => setSubPage(null)} />,
    'Scan History': <ScanHistoryPage onBack={() => setSubPage(null)} />,
    'Contact Support': <ContactSupportPage onBack={() => setSubPage(null)} />,
  };

  if (subPage) {
    return <PreferenceContext.Provider value={preferenceValue}>{subpages[subPage]}</PreferenceContext.Provider>;
  }

  const roleColor = currentRole === 'dealer' ? C.blue : C.success;
  const roleSoft = currentRole === 'dealer' ? C.blueLight : C.successLight;

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <>
        <ScrollView
          style={[styles.screen, { backgroundColor: theme.bg }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.heroHead}>
              <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('myProfile')}</Text>
              <Pressable
                style={[styles.editHeaderBtn, { backgroundColor: theme.soft, borderColor: theme.border }]}
                onPress={openEdit}
              >
                <AppIcon name="edit" size={16} color={roleColor} />
                <Text style={[styles.editHeaderText, { color: theme.textPrimary }]}>{t('edit')}</Text>
              </Pressable>
            </View>

            <View style={styles.profileRow}>
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: roleColor }]}>
                  {profilePhotoUri ? (
                    <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>GOLD</Text>
                </View>
              </View>

              <View style={styles.profileMeta}>
                <Text style={[styles.profileName, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Text style={[styles.profilePhone, { color: theme.textSecondary }]}>+91 {profile.phone}</Text>
                <Text style={[styles.profileCity, { color: theme.textMuted }]}>
                  {profile.city}, {profile.state}
                </Text>
                <View style={[styles.roleBadge, { backgroundColor: roleSoft }]}>
                  <Text style={[styles.roleBadgeText, { color: roleColor }]}>
                    {currentRole === 'dealer' ? t('dealerPartner') : t('electricianPartner')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              {[
                {
                  icon: 'scan' as IconName,
                  label: t('scans'),
                  value: '24',
                  bg: C.primaryLight,
                  color: C.primary,
                  onPress: () => setSubPage('Scan History'),
                },
                {
                  icon: 'star' as IconName,
                  label: t('points'),
                  value: '4250',
                  bg: C.goldLight,
                  color: C.gold,
                  onPress: () => onNavigate('wallet'),
                },
                {
                  icon: 'gift' as IconName,
                  label: t('rewards'),
                  value: '06',
                  bg: C.tealLight,
                  color: C.teal,
                  onPress: () => onNavigate('rewards'),
                },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  style={[styles.statBox, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  onPress={item.onPress}
                >
                  <View style={[styles.statIcon, { backgroundColor: item.bg }]}>
                    <AppIcon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.textPrimary }]}>{item.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('profileDetails')}</Text>
            {detailRows.map((item, index) => {
              const rawValue = profile[item.key];
              const value = item.key === 'phone' ? `+91 ${rawValue}` : rawValue || item.emptyText || 'Not provided';
              return (
                <View
                  key={item.label}
                  style={[
                    styles.detailRow,
                    index < detailRows.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.border } : null,
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: theme.textMuted }]}>{item.label}</Text>
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
                </View>
              );
            })}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('quickActions')}</Text>
            <View style={styles.grid}>
              {quickActions.map((item) => (
                <Pressable
                  key={item.label}
                  style={[styles.gridCard, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  onPress={() => {
                    if (item.route) {
                      onNavigate(item.route);
                      return;
                    }
                    if (item.screen) {
                      setSubPage(item.screen);
                    }
                  }}
                >
                  <View style={[styles.gridIcon, { backgroundColor: item.bg }]}>
                    <AppIcon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.gridLabel, { color: theme.textPrimary }]}>{t(item.label)}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('settings')}</Text>
            {settingsActions.map((item, index) => (
              <Pressable
                key={item.label}
                style={[
                  styles.menuRow,
                  index < settingsActions.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.border } : null,
                ]}
                onPress={() => setSubPage(item.screen)}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <AppIcon name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{t(item.label)}</Text>
                <AppIcon name="chevronRight" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.signOutButton} onPress={() => setShowSignOut(true)}>
            <AppIcon name="signOut" size={18} color="#B42318" />
            <Text style={styles.signOutText}>{t('signOut')}</Text>
          </Pressable>
        </ScrollView>

        <Modal visible={!!pendingDraftImage} animationType="fade" transparent onRequestClose={cancelDraftPhoto}>
          <View style={styles.confirmOverlay}>
            <View style={[styles.confirmPhotoCard, { backgroundColor: theme.surface }]}>
              {pendingDraftImage ? <Image source={{ uri: pendingDraftImage }} style={styles.confirmPhotoPreview} /> : null}
              <Text style={[styles.confirmPhotoTitle, { color: theme.textPrimary }]}>Use this photo?</Text>
              <View style={styles.confirmActions}>
                <Pressable
                  onPress={cancelDraftPhoto}
                  style={[styles.modalSecondary, { backgroundColor: theme.soft, borderColor: theme.border }]}
                >
                  <Text style={[styles.modalSecondaryText, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable onPress={confirmDraftPhoto} style={styles.modalPrimary}>
                  <Text style={styles.modalPrimaryText}>Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showEdit} animationType="slide" transparent onRequestClose={closeEdit}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t('edit')}</Text>

              <View style={[styles.photoPanel, { backgroundColor: theme.soft, borderColor: theme.border }]}>
                <TouchableOpacity
                  onPress={() => pickDraftPhoto('gallery')}
                  style={[styles.photoAvatar, { backgroundColor: roleColor }]}
                  activeOpacity={0.85}
                >
                  {draftPhotoUri ? (
                    <Image source={{ uri: draftPhotoUri }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                </TouchableOpacity>
                <View style={styles.photoContent}>
                  <Text style={[styles.photoTitle, { color: theme.textPrimary }]}>{t('updateProfilePhoto')}</Text>
                  <Text style={[styles.photoHint, { color: theme.textMuted }]}>{t('tapToChangePhoto')}</Text>
                  <View style={styles.photoActions}>
                    <Pressable
                      onPress={() => pickDraftPhoto('camera')}
                      style={[styles.photoAction, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                      <AppIcon name="camera" size={16} color={roleColor} />
                      <Text style={[styles.photoActionText, { color: theme.textPrimary }]}>{t('takePhoto')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => pickDraftPhoto('gallery')}
                      style={[styles.photoAction, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                      <AppIcon name="gallery" size={16} color={roleColor} />
                      <Text style={[styles.photoActionText, { color: theme.textPrimary }]}>{t('chooseGallery')}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {editRows.map((field) => (
                  <View key={field.key} style={styles.modalField}>
                    <Text style={[styles.modalLabel, { color: theme.textMuted }]}>{field.label}</Text>
                    <TextInput
                      value={draft[field.key]}
                      onChangeText={(value) => setDraft((current) => ({ ...current, [field.key]: value }))}
                      placeholder={field.label}
                      placeholderTextColor={theme.textMuted}
                      keyboardType={field.keyboardType ?? 'default'}
                      style={[
                        styles.modalInput,
                        { borderColor: theme.border, backgroundColor: theme.soft, color: theme.textPrimary },
                      ]}
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalSecondary, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  onPress={closeEdit}
                >
                  <Text style={[styles.modalSecondaryText, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable style={styles.modalPrimary} onPress={saveProfile}>
                  <Text style={styles.modalPrimaryText}>{t('saveChanges')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showSignOut} animationType="fade" transparent onRequestClose={() => setShowSignOut(false)}>
          <View style={styles.confirmOverlay}>
            <View style={[styles.confirmCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>{t('signOut')}</Text>
              <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
                Do you want to sign out of this account?
              </Text>
              <View style={styles.confirmActions}>
                <Pressable
                  style={[styles.modalSecondary, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  onPress={() => setShowSignOut(false)}
                >
                  <Text style={[styles.modalSecondaryText, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable
                  style={styles.modalPrimary}
                  onPress={() => {
                    setShowSignOut(false);
                    onSignOut();
                  }}
                >
                  <Text style={styles.modalPrimaryText}>{t('signOut')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </>
    </PreferenceContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  heroCard: { borderRadius: 28, borderWidth: 1, padding: 18, gap: 18 },
  heroHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 26, fontWeight: '900' },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editHeaderText: { fontSize: 13, fontWeight: '800' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 74, height: 74, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  levelBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  levelText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  profileMeta: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800' },
  profilePhone: { marginTop: 4, fontSize: 13, fontWeight: '600' },
  profileCity: { marginTop: 6, fontSize: 12, fontWeight: '600' },
  roleBadge: { marginTop: 8, alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  roleBadgeText: { fontSize: 11, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, borderRadius: 20, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center', gap: 6 },
  statIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 12, fontWeight: '700' },
  sectionCard: { borderRadius: 24, borderWidth: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  detailRow: { flexDirection: 'row', gap: 14, paddingVertical: 12 },
  detailLabel: { width: 124, fontSize: 12, fontWeight: '700' },
  detailValue: { flex: 1, fontSize: 13, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: { width: '48%', borderRadius: 18, borderWidth: 1, padding: 14, gap: 10 },
  gridIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  gridLabel: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  menuIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '700' },
  signOutButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  signOutText: { color: '#B42318', fontSize: 15, fontWeight: '800' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(34, 18, 10, 0.36)' },
  modalCard: { maxHeight: '90%', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  photoPanel: { borderRadius: 22, borderWidth: 1, padding: 14, flexDirection: 'row', gap: 14, marginBottom: 16 },
  photoAvatar: { width: 84, height: 84, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoContent: { flex: 1, justifyContent: 'center' },
  photoTitle: { fontSize: 14, fontWeight: '800' },
  photoHint: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  photoActions: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  photoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  photoActionText: { fontSize: 12, fontWeight: '700' },
  modalField: { marginBottom: 12 },
  modalLabel: { marginBottom: 8, fontSize: 12, fontWeight: '700' },
  modalInput: { minHeight: 50, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalSecondary: { flex: 1, minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  modalSecondaryText: { fontSize: 14, fontWeight: '800' },
  modalPrimary: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(34, 18, 10, 0.36)', padding: 20 },
  confirmCard: { width: '100%', maxWidth: 360, borderRadius: 24, padding: 20, borderWidth: 1 },
  confirmTitle: { fontSize: 20, fontWeight: '800' },
  confirmText: { marginTop: 8, fontSize: 14, lineHeight: 20 },
  confirmActions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  confirmPhotoCard: { width: '100%', maxWidth: 340, borderRadius: 28, padding: 20, alignItems: 'center' },
  confirmPhotoPreview: { width: 220, height: 220, borderRadius: 20, marginBottom: 16 },
  confirmPhotoTitle: { fontSize: 18, fontWeight: '800', marginBottom: 18 },
});
