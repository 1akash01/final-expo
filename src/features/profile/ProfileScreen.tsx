import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  getSafeTranslation,
  getThemePalette,
  translateUiText,
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
import { PasswordSettingsPage } from './PasswordSettings';
import { PartnerCommissionPage } from './PartnerCommission';
import { ReferFriendPage } from './ReferFriend';
import { ScanHistoryPage } from './ScanHistory';
import { TransferPointsPage } from './TransferPoints';
import { TierIcon } from '@/features/dealer/MemberTierScreen';
import { ElectricianTierIcon, getElectricianTier } from '@/features/electrician/ElectricianTierScreen';

const electricianMenuItems: Array<{
  label: string;
  icon: IconName;
  color: string;
  bg: string;
  screen?: SubPage;
  route?: Screen;
}> = [
  { label: 'My Redemption', icon: 'redeem', color: C.primary, bg: C.primaryLight, screen: 'My Redemption' },
  { label: 'Gift Store', icon: 'gift', color: C.teal, bg: C.tealLight, route: 'rewards' },
  { label: 'Transfer Points', icon: 'transfer', color: C.blue, bg: C.blueLight, screen: 'Transfer Points' },
  { label: 'My Orders', icon: 'order', color: C.purple, bg: C.purpleLight, screen: 'My Orders' },
  { label: 'Bank Details', icon: 'bank', color: C.gold, bg: C.goldLight, screen: 'Bank Details' },
  { label: 'Refer To A Friend', icon: 'refer', color: C.blue, bg: '#EFF6FF', screen: 'Refer To A Friend' },
  { label: 'Need Help', icon: 'help', color: C.teal, bg: C.tealLight, screen: 'Need Help' },
  { label: 'Offers & Promotions', icon: 'offer', color: C.gold, bg: C.goldLight, screen: 'Offers & Promotions' },
];

const dealerMenuItems: Array<{
  label: string;
  icon: IconName;
  color: string;
  bg: string;
  screen?: SubPage;
  route?: Screen;
}> = [
  { label: 'My Redemption', icon: 'redeem', color: C.primary, bg: C.primaryLight, screen: 'My Redemption' },
  { label: 'Gift Store', icon: 'gift', color: C.teal, bg: C.tealLight, route: 'rewards' },
  { label: 'Dealer Bonus', icon: 'transfer', color: C.blue, bg: C.blueLight, screen: 'Dealer Bonus' },
  { label: 'My Orders', icon: 'order', color: C.purple, bg: C.purpleLight, screen: 'My Orders' },
  { label: 'Bank Details', icon: 'bank', color: C.gold, bg: C.goldLight, screen: 'Bank Details' },
  { label: 'Refer To A Friend', icon: 'refer', color: C.blue, bg: '#EFF6FF', screen: 'Refer To A Friend' },
  { label: 'Need Help', icon: 'help', color: C.teal, bg: C.tealLight, screen: 'Need Help' },
  { label: 'Offers & Promotions', icon: 'offer', color: C.gold, bg: C.goldLight, screen: 'Offers & Promotions' },
];

const settingsItems: Array<{
  label: string;
  icon: IconName;
  color: string;
  bg: string;
  screen: SubPage;
  badge?: boolean;
  route?: Screen;
}> = [
  { label: 'Notifications', icon: 'notification', color: C.gold, bg: C.goldLight, screen: 'Notifications', badge: true, route: 'notification' },
  { label: 'Password', icon: 'lock', color: C.blue, bg: C.blueLight, screen: 'Password' },
  { label: 'App Settings', icon: 'settings', color: C.purple, bg: C.purpleLight, screen: 'App Settings' },
  { label: 'Scan History', icon: 'history', color: C.primary, bg: C.primaryLight, screen: 'Scan History' },
  { label: 'Contact Support', icon: 'support', color: C.teal, bg: C.tealLight, screen: 'Contact Support' },
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
];

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
    : {
        ...defaultProfile,
        gstHolderName: '',
        gstNumber: '',
        panHolderName: '',
        panNumber: '',
      };

const getTaxIdentityValue = (profile: Profile) => profile.gstNumber || profile.panNumber || '';

const getTaxHolderValue = (profile: Profile) => profile.gstHolderName || profile.panHolderName || '';

const getDealerMembership = (electricianCount: number) => {
  if (electricianCount <= 100) {
    return {
      tier: 'Silver' as const,
      accent: '#64748B',
      soft: '#E2E8F0',
    };
  }

  if (electricianCount <= 300) {
    return {
      tier: 'Gold' as const,
      accent: '#D97706',
      soft: '#FEF3C7',
    };
  }

  if (electricianCount <= 500) {
    return {
      tier: 'Platinum' as const,
      accent: '#2563EB',
      soft: '#DBEAFE',
    };
  }

  return {
    tier: 'Diamond' as const,
    accent: '#0E7490',
    soft: '#CFFAFE',
  };
};

export function ProfileScreen({
  currentRole,
  onNavigate,
  onSignOut,
  hasPasswordConfigured,
  storedPassword,
  onPasswordConfiguredChange,
  onPasswordChange,
  language,
  onLanguageChange,
  darkMode,
  onDarkModeChange,
  profilePhotoUri,
  onProfilePhotoChange,
}: {
  currentRole: UserRole;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
  hasPasswordConfigured: boolean;
  storedPassword: string;
  onPasswordConfiguredChange: (configured: boolean) => void;
  onPasswordChange: (password: string) => void;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  profilePhotoUri: string | null;
  onProfilePhotoChange: (photoUri: string | null) => void;
}) {
  const initialProfile = useMemo(() => getProfileByRole(currentRole), [currentRole]);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [draft, setDraft] = useState<Profile>(initialProfile);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showImgPicker, setShowImgPicker] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(null);
  const [pendingDraftImage, setPendingDraftImage] = useState<string | null>(null);
  const [draftTaxIdentity, setDraftTaxIdentity] = useState(getTaxIdentityValue(initialProfile));
  const [draftTaxHolder, setDraftTaxHolder] = useState(getTaxHolderValue(initialProfile));

  useEffect(() => {
    setProfile(initialProfile);
    setDraft(initialProfile);
    setSubPage(null);
    setShowEdit(false);
    setShowSignOut(false);
    setShowImgPicker(false);
    setShowFullProfile(false);
    setDraftPhotoUri(null);
    setPendingDraftImage(null);
    setDraftTaxIdentity(getTaxIdentityValue(initialProfile));
    setDraftTaxHolder(getTaxHolderValue(initialProfile));
  }, [initialProfile]);

  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => getSafeTranslation(language, key);
  const tx = (text: string) => translateUiText(language, text);
  const preferenceValue = { language, setLanguage: onLanguageChange, darkMode, setDarkMode: onDarkModeChange, t, tx, theme };
  const menuItems = useMemo(() => (currentRole === 'dealer' ? dealerMenuItems : electricianMenuItems), [currentRole]);
  const settingsMenuItems = useMemo(
    () => (currentRole === 'dealer' ? settingsItems.filter((item) => item.screen !== 'Scan History') : settingsItems),
    [currentRole]
  );
  const electricianCount = 134;
  const electricianPoints = 4250;
  const dealerMembership = useMemo(() => getDealerMembership(electricianCount), [electricianCount]);
  const electricianMembership = useMemo(() => getElectricianTier(electricianPoints), [electricianPoints]);
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
    setPendingDraftImage(null);
    setDraftTaxIdentity(getTaxIdentityValue(profile));
    setDraftTaxHolder(getTaxHolderValue(profile));
    setShowImgPicker(false);
    setShowEdit(true);
  };

  const openPhotoPicker = () => {
    setDraft(profile);
    setDraftPhotoUri(profilePhotoUri);
    setPendingDraftImage(null);
    setShowImgPicker(true);
  };

  const closeEdit = () => {
    setDraft(profile);
    setDraftPhotoUri(profilePhotoUri);
    setPendingDraftImage(null);
    setDraftTaxIdentity(getTaxIdentityValue(profile));
    setDraftTaxHolder(getTaxHolderValue(profile));
    setShowImgPicker(false);
    setShowEdit(false);
  };

  const updateDraftField = (key: keyof Profile, value: string) => {
    let nextValue = value;
    if (key === 'name' || key === 'city' || key === 'state' || key === 'gstHolderName' || key === 'panHolderName') {
      nextValue = value.replace(/[^A-Za-z ]/g, '');
    } else if (key === 'phone' || key === 'pincode') {
      nextValue = value.replace(/\D/g, '');
    } else if (key === 'email') {
      nextValue = value.replace(/\s/g, '');
    }

    setDraft((current) => ({ ...current, [key]: nextValue }));
  };

  const saveProfile = () => {
    if (draft.name.trim() && !/^[A-Za-z ]+$/.test(draft.name.trim())) {
      return Alert.alert(tx('Invalid name'), tx('Name should contain only alphabets and spaces.'));
    }
    if (draft.phone.trim() && !/^\d+$/.test(draft.phone.trim())) {
      return Alert.alert(tx('Invalid phone number'), tx('Phone number should contain only integers.'));
    }
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      return Alert.alert(tx('Invalid email'), tx('Please enter a valid email address.'));
    }
    if (draft.city.trim() && !/^[A-Za-z ]+$/.test(draft.city.trim())) {
      return Alert.alert(tx('Invalid city'), tx('City should contain only alphabets and spaces.'));
    }
    if (draft.state.trim() && !/^[A-Za-z ]+$/.test(draft.state.trim())) {
      return Alert.alert(tx('Invalid state'), tx('State should contain only alphabets and spaces.'));
    }
    if (draft.pincode.trim() && !/^\d+$/.test(draft.pincode.trim())) {
      return Alert.alert(tx('Invalid pincode'), tx('Pincode should contain only integers.'));
    }
    if (draftTaxHolder.trim() && !/^[A-Za-z ]+$/.test(draftTaxHolder.trim())) {
      return Alert.alert(tx('Invalid holder name'), tx('GST / PAN holder name should contain only alphabets and spaces.'));
    }

    const nextProfile: Profile =
      currentRole === 'dealer'
        ? {
            ...draft,
            gstNumber: draftTaxIdentity.trim().toUpperCase(),
            panNumber: '',
            gstHolderName: draftTaxHolder.trim(),
            panHolderName: '',
          }
        : {
            ...draft,
            gstNumber: '',
            panNumber: '',
            gstHolderName: '',
            panHolderName: '',
          };

    setProfile(nextProfile);
    onProfilePhotoChange(draftPhotoUri);
    setPendingDraftImage(null);
    setShowEdit(false);
  };

  const pickDraftPhoto = async (source: 'camera' | 'gallery') => {
    try {
      setShowImgPicker(false);
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(tx('Permission needed'), tx('Allow camera access to update your profile photo.'));
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled && result.assets?.length) {
          setPendingDraftImage(result.assets[0].uri);
        }
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(tx('Permission needed'), tx('Allow gallery access to update your profile photo.'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setPendingDraftImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert(tx('Unable to update photo'), tx('Please try again.'));
    }
  };

  const cancelDraftPhoto = () => setPendingDraftImage(null);

  const confirmDraftPhoto = () => {
    if (!pendingDraftImage) {
      return;
    }
    if (showEdit) {
      setDraftPhotoUri(pendingDraftImage);
    } else {
      setDraftPhotoUri(pendingDraftImage);
      onProfilePhotoChange(pendingDraftImage);
    }
    setPendingDraftImage(null);
  };

  const removeProfilePhoto = () => {
    setShowImgPicker(false);
    setPendingDraftImage(null);
    setDraftPhotoUri(null);
    if (!showEdit) {
      onProfilePhotoChange(null);
    }
  };

  const subpages: Record<Exclude<SubPage, null>, React.ReactElement> = {
    'My Redemption': (
      <RedemptionPage
        onBack={() => setSubPage(null)}
        onNavigate={onNavigate}
        onOpenBankDetails={() => setSubPage('Bank Details')}
        onOpenTransferPoints={() => setSubPage(currentRole === 'dealer' ? 'Dealer Bonus' : 'Transfer Points')}
        currentRole={currentRole}
      />
    ),
    'Dealer Bonus': <PartnerCommissionPage onBack={() => setSubPage(null)} />,
    'Transfer Points': <TransferPointsPage onBack={() => setSubPage(null)} onNavigate={onNavigate} />,
    'My Orders': <MyOrdersPage onBack={() => setSubPage(null)} />,
    'Bank Details': <BankDetailsPage onBack={() => setSubPage(null)} />,
    'Refer To A Friend': <ReferFriendPage onBack={() => setSubPage(null)} />,
    'Need Help': <NeedHelpPage onBack={() => setSubPage(null)} />,
    'Offers & Promotions': <OffersPage onBack={() => setSubPage(null)} />,
    Notifications: <NotificationsPage onBack={() => setSubPage(null)} />,
    Password: (
      <PasswordSettingsPage
        onBack={() => setSubPage(null)}
        hasPasswordConfigured={hasPasswordConfigured}
        storedPassword={storedPassword}
        onPasswordConfiguredChange={onPasswordConfiguredChange}
        onPasswordChange={onPasswordChange}
      />
    ),
    'App Settings': <AppSettingsPage onBack={() => setSubPage(null)} />,
    'Scan History': <ScanHistoryPage onBack={() => setSubPage(null)} />,
    'Contact Support': <ContactSupportPage onBack={() => setSubPage(null)} />,
  };

  if (subPage) {
    return <PreferenceContext.Provider value={preferenceValue}>{subpages[subPage]}</PreferenceContext.Provider>;
  }

  const roleColor = currentRole === 'dealer' ? C.blue : C.success;
  const roleSoft = currentRole === 'dealer' ? C.blueLight : C.successLight;
  const hasCompletedKyc = Boolean(getTaxIdentityValue(profile).trim() && getTaxHolderValue(profile).trim());
  const visibleDetailRows =
    currentRole === 'dealer'
      ? detailRows
      : detailRows.filter((item) => !['gstHolderName', 'gstNumber', 'panHolderName', 'panNumber'].includes(item.key));

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <>
        <ScrollView
          style={[styles.screen, { backgroundColor: theme.bg }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('myProfile')}</Text>
            <TouchableOpacity
              onPress={openEdit}
              style={[styles.editHeaderBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.75}
            >
              <AppIcon name="edit" size={16} color={C.primary} />
              <Text style={[styles.editHeaderText, { color: theme.textPrimary }]}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.heroCard, { backgroundColor: theme.heroSurface, borderColor: theme.border }]}>
            <View style={styles.blobTL} />
            <View style={styles.blobBR} />
            <View style={styles.heroTop}>
              <TouchableOpacity onPress={openPhotoPicker} activeOpacity={0.85} style={styles.avatarWrap}>
                <View style={styles.avatarRing}>
                  {profilePhotoUri ? (
                    <Image source={{ uri: profilePhotoUri }} style={styles.avatarImg} />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: roleColor }]}>
                      <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: currentRole === 'dealer' ? dealerMembership.soft : electricianMembership.soft },
                  ]}
                >
                  {currentRole === 'dealer' ? (
                    <TierIcon tier={dealerMembership.tier} size={15} />
                  ) : (
                    <ElectricianTierIcon tier={electricianMembership.tier} size={15} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroName, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Text style={[styles.heroPhone, { color: theme.textMuted }]}>+91 {profile.phone}</Text>
                <View style={styles.tagRow}>
                  <View style={[styles.tag, { backgroundColor: theme.soft }]}>
                    <AppIcon name="location" size={12} color={theme.textSecondary} />
                    <Text style={[styles.tagTxt, { color: theme.textSecondary }]}>{profile.city}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: roleSoft }]}>
                    <Text style={[styles.tagTxt, { color: roleColor }]}>{profile.dealerCode}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {currentRole !== 'dealer' ? (
            <View style={styles.statsRow}>
              {[
                { val: '24', label: t('scans'), icon: 'scan' as IconName, bg: C.primaryLight, color: C.primary, onPress: () => setSubPage('Scan History') },
                { val: '4,250', label: t('points'), icon: 'star' as IconName, bg: C.goldLight, color: C.gold, onPress: () => onNavigate('wallet') },
                { val: '6', label: t('rewards'), icon: 'gift' as IconName, bg: C.tealLight, color: C.teal, onPress: () => onNavigate('rewards') },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.statIcon, { backgroundColor: item.bg }]}>
                    <AppIcon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.statVal, { color: item.color }]}>{item.val}</Text>
                  <Text style={[styles.statLbl, { color: theme.textMuted }]}>{tx(item.label)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHead}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{t('profileDetails')}</Text>
              <TouchableOpacity onPress={() => setShowFullProfile((current) => !current)} style={styles.visibilityBtn} activeOpacity={0.75}>
                <AppIcon name={showFullProfile ? 'eyeOff' : 'eye'} size={16} color={C.blue} />
                <Text style={styles.visibilityText}>{showFullProfile ? t('hide') : t('show')}</Text>
              </TouchableOpacity>
            </View>
            {currentRole === 'dealer' && !hasCompletedKyc ? (
              <View style={styles.kycBanner}>
                <View style={styles.kycIcon}>
                  <AppIcon name="warning" size={18} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.kycTitle}>Complete KYC to unlock all features</Text>
                  <Text style={styles.kycSub}>Add PAN & GST details to get verified</Text>
                </View>
                <View style={styles.kycBadge}>
                  <Text style={styles.kycBadgeTxt}>Pending</Text>
                </View>
              </View>
            ) : null}
            {visibleDetailRows.slice(0, showFullProfile ? visibleDetailRows.length : 4).map((item, index, rows) => {
              const rawValue = profile[item.key];
              const value = item.key === 'phone' ? `+91 ${rawValue}` : rawValue || item.emptyText || 'Not provided';
              const isEmpty = !rawValue || value === 'Not provided';
              return (
                <View
                  key={item.label}
                  style={[styles.detailRow, index < rows.length - 1 ? [styles.detailBorder, { borderBottomColor: theme.border }] : null]}
                >
                  <Text style={[styles.detailLbl, { color: theme.textMuted }]}>{tx(item.label)}</Text>
                  <Text style={[styles.detailVal, { color: theme.textPrimary }, isEmpty ? styles.detailEmpty : null]} numberOfLines={1}>
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{t('quickActions')}</Text>
            <View style={{ height: 12 }} />
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, index < menuItems.length - 1 ? [styles.menuBorder, { borderBottomColor: theme.border }] : null]}
                onPress={() => (item.route ? onNavigate(item.route) : item.screen ? setSubPage(item.screen) : undefined)}
                activeOpacity={0.75}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <AppIcon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{tx(item.label)}</Text>
                <View style={[styles.arrowWrap, { backgroundColor: item.bg, borderColor: `${item.color}22` }]}>
                  <View style={styles.arrowCore}>
                    <AppIcon name="chevronRight" size={15} color={item.color} strokeWidth={2.4} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{t('settings')}</Text>
            <View style={{ height: 12 }} />
            {settingsMenuItems.map((item, index) => {
              return (
              <TouchableOpacity
                key={item.screen}
                style={[styles.menuRow, index < settingsMenuItems.length - 1 ? [styles.menuBorder, { borderBottomColor: theme.border }] : null]}
                onPress={() => (item.route ? onNavigate(item.route) : setSubPage(item.screen))}
                activeOpacity={0.75}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  {item.badge ? <View style={styles.notifDot} /> : null}
                  <AppIcon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{tx(item.label)}</Text>
                <View style={[styles.arrowWrap, { backgroundColor: item.bg, borderColor: `${item.color}22` }]}>
                  <View style={styles.arrowCore}>
                    <AppIcon name="chevronRight" size={15} color={item.color} strokeWidth={2.4} />
                  </View>
                </View>
              </TouchableOpacity>
            );
            })}
          </View>

          <TouchableOpacity
            style={[styles.signOutBtn, { backgroundColor: theme.surface, borderColor: darkMode ? theme.border : '#FFD6D4' }]}
            onPress={() => setShowSignOut(true)}
            activeOpacity={0.8}
          >
            <View style={styles.signOutIconWrap}>
              <AppIcon name="signOut" size={18} color={C.primary} />
            </View>
            <Text style={styles.signOutTxt}>{t('signOut')}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>

        <Modal visible={showImgPicker} animationType="slide" transparent onRequestClose={() => setShowImgPicker(false)}>
          <Pressable style={styles.pickerOverlay} onPress={() => setShowImgPicker(false)}>
            <Pressable style={styles.pickerSheet}>
              <View style={styles.handle} />
              <Text style={styles.pickerTitle}>{t('updateProfilePhoto')}</Text>
              <Text style={styles.pickerHelper}>Choose a photo source or remove the current photo. Your initials will appear again if no photo is selected.</Text>
              {[
                { icon: 'camera' as IconName, label: t('takePhoto'), sub: tx('Capture a photo, then tap Done on the confirmation screen'), fn: () => pickDraftPhoto('camera') },
                { icon: 'gallery' as IconName, label: t('chooseGallery'), sub: tx('Select a photo, then tap Done on the confirmation screen'), fn: () => pickDraftPhoto('gallery') },
                { icon: 'eyeOff' as IconName, label: 'Remove Photo', sub: 'Remove the profile photo and show initials again', fn: removeProfilePhoto },
              ].map((option) => (
                <TouchableOpacity key={option.label} style={styles.pickerOption} onPress={option.fn} activeOpacity={0.8}>
                  <View style={styles.pickerOptionIcon}>
                    <AppIcon name={option.icon} size={22} color={option.label === 'Remove Photo' ? C.primary : C.blue} />
                  </View>
                  <View>
                    <Text style={styles.pickerOptionLabel}>{option.label}</Text>
                    <Text style={styles.pickerOptionSub}>{option.sub}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.pickerCancel} onPress={() => setShowImgPicker(false)}>
                <Text style={styles.pickerCancelTxt}>{t('cancel')}</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal visible={!!pendingDraftImage} animationType="fade" transparent onRequestClose={cancelDraftPhoto}>
          <View style={styles.overlay}>
            <View style={[styles.confirmPhotoCard, { backgroundColor: theme.surface }]}>
              {pendingDraftImage ? <Image source={{ uri: pendingDraftImage }} style={styles.confirmPhotoPreview} /> : null}
              <Text style={[styles.confirmPhotoTitle, { color: theme.textPrimary }]}>{tx('Review photo')}</Text>
              <Text style={[styles.confirmPhotoHelp, { color: theme.textMuted }]}>{tx('If the photo looks right, tap Done to update your profile photo.')}</Text>
              <View style={styles.confirmPhotoActions}>
                <Pressable onPress={cancelDraftPhoto} style={[styles.cancelBtn, { backgroundColor: theme.soft, borderColor: theme.border }]}>
                  <Text style={[styles.cancelTxt, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable onPress={confirmDraftPhoto} style={styles.signOutActionBtn}>
                  <Text style={styles.signOutActionTxt}>{tx('Done')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showEdit} animationType="slide" transparent onRequestClose={closeEdit}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.editOverlay}
          >
            <TouchableOpacity style={styles.editBackdrop} activeOpacity={1} onPress={Keyboard.dismiss}>
              <TouchableOpacity activeOpacity={1} style={[styles.editSheet, { backgroundColor: theme.surface }]}>
                <View style={styles.handle} />
                <View style={styles.editHeader}>
                  <Text style={[styles.editTitle, { color: theme.textPrimary }]}>{tx('Edit Profile')}</Text>
                  <TouchableOpacity onPress={closeEdit} style={[styles.closeBtn, { backgroundColor: theme.soft }]}>
                    <Text style={[styles.closeTxt, { color: theme.textSecondary }]}>x</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="interactive"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <View style={styles.avatarSection}>
                    <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Profile Photo</Text>
                    <TouchableOpacity
                      onPress={() => setShowImgPicker(true)}
                      activeOpacity={0.8}
                      style={[
                        styles.uploadBox,
                        draftPhotoUri ? styles.uploadBoxFilled : null,
                        { backgroundColor: theme.soft, borderColor: theme.border },
                      ]}
                    >
                      {draftPhotoUri ? (
                        <Image source={{ uri: draftPhotoUri }} style={styles.previewImage} />
                      ) : (
                        <View style={styles.uploadInner}>
                          <View style={[styles.uploadIconWrap, { backgroundColor: roleSoft }]}>
                            <AppIcon name="gallery" size={20} color={roleColor} />
                          </View>
                          <View style={styles.uploadCopy}>
                            <Text style={[styles.uploadTitle, { color: theme.textPrimary }]}>{t('tapToChangePhoto')}</Text>
                            <Text style={[styles.uploadText, { color: theme.textMuted }]}>{tx('Choose from camera or gallery, then finish with Done on the confirmation screen.')}</Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={[styles.photoHint, { color: theme.textMuted }]}>{draftPhotoUri ? t('tapToChangePhoto') : tx('After selecting a photo, review it and tap Done to continue.')}</Text>
                  </View>
                  {editRows.map((field) => (
                    <View key={field.key} style={styles.field}>
                      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{tx(field.label)}</Text>
                      <TextInput
                        value={draft[field.key]}
                        onChangeText={(value) => updateDraftField(field.key, value)}
                        placeholder={`${tx('Enter')} ${tx(field.label)}`}
                        placeholderTextColor={theme.textMuted}
                        keyboardType={field.keyboardType ?? 'default'}
                        autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                        style={[styles.input, { borderColor: theme.border, backgroundColor: theme.soft, color: theme.textPrimary }]}
                      />
                    </View>
                  ))}
                  {currentRole === 'dealer' ? (
                    <>
                      <View style={styles.field}>
                        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>GST Number / PAN Number</Text>
                        <TextInput
                          value={draftTaxIdentity}
                          onChangeText={(value) => setDraftTaxIdentity(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                          placeholder="Enter GST or PAN number"
                          placeholderTextColor={theme.textMuted}
                          autoCapitalize="characters"
                          maxLength={10}
                          style={[styles.input, { borderColor: theme.border, backgroundColor: theme.soft, color: theme.textPrimary }]}
                        />
                      </View>
                      <View style={styles.field}>
                        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>GST Holder / PAN Holder Name</Text>
                        <TextInput
                          value={draftTaxHolder}
                          onChangeText={(value) => setDraftTaxHolder(value.replace(/[^A-Za-z ]/g, ''))}
                          placeholder="Enter holder name"
                          placeholderTextColor={theme.textMuted}
                          autoCapitalize="words"
                          style={[styles.input, { borderColor: theme.border, backgroundColor: theme.soft, color: theme.textPrimary }]}
                        />
                      </View>
                    </>
                  ) : null}
                  <View style={styles.field}>
                    <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Dealer Code</Text>
                    <TextInput
                      value={draft.dealerCode}
                      onChangeText={(value) => updateDraftField('dealerCode', value)}
                      placeholder="Enter dealer code"
                      placeholderTextColor={theme.textMuted}
                      autoCapitalize="characters"
                      style={[styles.input, { borderColor: theme.border, backgroundColor: theme.soft, color: theme.textPrimary }]}
                    />
                  </View>
                </ScrollView>
                <View style={styles.editActions}>
                  <Pressable onPress={closeEdit} style={[styles.discardBtn, { backgroundColor: theme.soft, borderColor: theme.border }]}>
                    <Text style={[styles.discardTxt, { color: theme.textSecondary }]}>{t('discard')}</Text>
                  </Pressable>
                  <Pressable onPress={saveProfile} style={styles.saveBtn}>
                    <Text style={styles.saveTxt}>{t('saveChanges')}</Text>
                  </Pressable>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>

        <Modal visible={showSignOut} animationType="fade" transparent onRequestClose={() => setShowSignOut(false)}>
          <View style={styles.overlay}>
            <View style={[styles.confirmCard, { backgroundColor: theme.surface }]}>
              <View style={styles.confirmIconBg}>
                <AppIcon name="signOut" size={28} color={C.primary} />
              </View>
              <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>{`${t('signOut')}?`}</Text>
              <Text style={[styles.confirmSub, { color: theme.textMuted }]}>{tx('Are you sure you want to sign out?\nYour data will be saved.')}</Text>
              <View style={styles.rowActions}>
                <Pressable style={[styles.cancelBtn, { backgroundColor: theme.soft, borderColor: theme.border }]} onPress={() => setShowSignOut(false)}>
                  <Text style={[styles.cancelTxt, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable
                  style={styles.signOutActionBtn}
                  onPress={() => {
                    setShowSignOut(false);
                    onSignOut();
                  }}
                >
                  <Text style={styles.signOutActionTxt}>{t('signOut')}</Text>
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
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 26, fontWeight: '900' },
  editHeaderBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1 },
  editHeaderText: { fontSize: 14, fontWeight: '700' },
  heroCard: { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  blobTL: { position: 'absolute', top: -40, left: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(232,69,60,0.1)' },
  blobBR: { position: 'absolute', bottom: -30, right: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(37,99,235,0.08)' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 22, paddingBottom: 16 },
  avatarWrap: { position: 'relative', paddingBottom: 4, paddingRight: 4 },
  avatarRing: { width: 80, height: 80, borderRadius: 26, borderWidth: 2.5, borderColor: 'rgba(15,17,32,0.08)', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#fff', fontSize: 28, fontWeight: '900' },
  levelBadge: { position: 'absolute', right: 4, bottom: 4, width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  heroName: { fontSize: 20, fontWeight: '900', marginBottom: 3 },
  heroPhone: { fontSize: 13, marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  tagTxt: { fontSize: 11, fontWeight: '700' },
  memberStrip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderTopWidth: 1, paddingHorizontal: 18, paddingVertical: 14, gap: 12, flexWrap: 'wrap' },
  memberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, flexGrow: 1, minWidth: 0 },
  memberTextBlock: { flexShrink: 1, minWidth: 0 },
  memberRight: { alignItems: 'flex-start', gap: 5, flexBasis: '100%' },
  memberStarWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(245,158,11,0.14)', alignItems: 'center', justifyContent: 'center' },
  memberTierBadge: { minWidth: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  memberTierBadgeText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.4 },
  memberTitle: { fontSize: 13, fontWeight: '800', color: '#F59E0B', flexShrink: 1 },
  memberSub: { fontSize: 11, marginTop: 1, flexShrink: 1 },
  memberHint: { fontSize: 11, fontWeight: '600', lineHeight: 16, flexShrink: 1 },
  memberNetworkChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 2 },
  memberNetworkText: { fontSize: 11, fontWeight: '800' },
  progressTrack: { width: 100, height: 5, borderRadius: 3, backgroundColor: '#E8EAF1' },
  dealerProgressTrack: { width: '100%', maxWidth: 230 },
  progressFill: { width: '72%', height: '100%', borderRadius: 3, backgroundColor: '#F59E0B' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, borderRadius: 20, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1 },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statVal: { fontSize: 18, fontWeight: '900' },
  statLbl: { fontSize: 11, fontWeight: '600' },
  sectionCard: { borderRadius: 24, padding: 20, borderWidth: 1 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  visibilityBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  visibilityText: { fontSize: 13, fontWeight: '700', color: C.blue },
  kycBanner: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#FDE68A', borderRadius: 16, padding: 12, marginBottom: 14 },
  kycIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  kycTitle: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  kycSub: { fontSize: 12, color: '#B45309', marginTop: 2 },
  kycBadge: { backgroundColor: '#F59E0B', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  kycBadgeTxt: { fontSize: 11, fontWeight: '800', color: '#fff' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2FA' },
  detailLbl: { fontSize: 13, fontWeight: '500', width: 100 },
  detailVal: { flex: 1, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  detailEmpty: { color: C.muted, fontStyle: 'italic', fontWeight: '400' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2FA' },
  menuIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  arrowWrap: { width: 28, height: 30, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  arrowCore: { width: 18, height: 22, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 7, right: 7, width: 9, height: 9, borderRadius: 5, backgroundColor: C.primary, borderWidth: 1.5, borderColor: C.surface },
  signOutBtn: { borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5 },
  signOutIconWrap: { width: 34, height: 34, borderRadius: 11, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  signOutTxt: { fontSize: 16, fontWeight: '700', color: C.primary },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15,17,32,0.55)' },
  confirmCard: { borderRadius: 32, padding: 30, marginHorizontal: 28, width: '86%', alignItems: 'center' },
  confirmIconBg: { width: 74, height: 74, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  confirmTitle: { fontSize: 21, fontWeight: '900', marginBottom: 8 },
  confirmSub: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 26 },
  rowActions: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmPhotoCard: { borderRadius: 28, padding: 20, marginHorizontal: 24, width: '88%', alignItems: 'center' },
  confirmPhotoPreview: { width: 220, height: 220, borderRadius: 24, marginBottom: 16 },
  confirmPhotoTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  confirmPhotoHelp: { fontSize: 12, lineHeight: 18, textAlign: 'center', marginBottom: 18 },
  confirmPhotoActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  cancelTxt: { fontSize: 15, fontWeight: '800' },
  signOutActionBtn: { flex: 1, height: 52, borderRadius: 17, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  signOutActionTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,17,32,0.45)' },
  pickerSheet: { backgroundColor: C.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  handle: { width: 42, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 16 },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: C.dark, marginBottom: 20 },
  pickerHelper: { fontSize: 12, lineHeight: 18, color: C.muted, marginTop: -10, marginBottom: 14 },
  pickerOption: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  pickerOptionIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  pickerOptionLabel: { fontSize: 16, fontWeight: '700', color: C.dark },
  pickerOptionSub: { fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 14, flexShrink: 1, maxWidth: 220 },
  pickerCancel: { marginTop: 16, height: 52, borderRadius: 18, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  pickerCancelTxt: { fontSize: 15, fontWeight: '700', color: C.mid },
  editOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,17,32,0.45)' },
  editBackdrop: { flex: 1, justifyContent: 'flex-end' },
  editSheet: { maxHeight: '92%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  editTitle: { fontSize: 20, fontWeight: '900' },
  closeBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 15, fontWeight: '700' },
  avatarSection: { marginBottom: 24 },
  uploadBox: { minHeight: 110, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', overflow: 'hidden', marginTop: 7 },
  uploadBoxFilled: { minHeight: 0, alignSelf: 'center', width: 120, borderStyle: 'solid' },
  uploadInner: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18, gap: 12 },
  uploadIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  uploadCopy: { flex: 1 },
  uploadTitle: { fontSize: 14, fontWeight: '800' },
  uploadText: { fontSize: 12, fontWeight: '600', lineHeight: 18, marginTop: 4 },
  previewImage: { width: 120, height: 120, borderRadius: 18, alignSelf: 'center' },
  photoHint: { fontSize: 12, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  editAvatarRing: { width: 96, height: 96, borderRadius: 30, borderWidth: 3, overflow: 'hidden', position: 'relative' },
  editAvatarImg: { width: '100%', height: '100%' },
  editAvatarFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  editAvatarInitials: { color: '#fff', fontSize: 32, fontWeight: '900' },
  cameraOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 },
  input: { height: 52, borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 16, fontSize: 14, fontWeight: '500' },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  discardBtn: { flex: 1, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  discardTxt: { fontSize: 15, fontWeight: '800' },
  saveBtn: { flex: 2, height: 54, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  saveTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },
});




