import React, { useMemo } from 'react';
import { BankDetailsPage } from './BankDetails';
import { PartnerCommissionPage } from './PartnerCommission';
import { PreferenceContext, getSafeTranslation, getThemePalette, type AppLanguage } from './ProfileShared';
import { TransferPointsPage } from './TransferPoints';
import type { Screen } from '@/shared/types/navigation';

function useWalletPreferenceValue({
  language,
  setLanguage,
  darkMode,
  setDarkMode,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}) {
  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof ReturnType<typeof getTranslationKeys>) => getSafeTranslation(language, key);

  return useMemo(
    () => ({ language, setLanguage, darkMode, setDarkMode, t, theme }),
    [darkMode, language, setDarkMode, setLanguage, theme]
  );
}

function getTranslationKeys() {
  return {
    myProfile: true, edit: true, goldMember: true, dealerPartner: true, electricianPartner: true, toPlatinum: true,
    scans: true, points: true, rewards: true, profileDetails: true, show: true, hide: true, quickActions: true,
    settings: true, giftStore: true, signOut: true, appSettings: true, preferences: true, pushNotifications: true,
    receiveAlerts: true, darkMode: true, switchTheme: true, language: true, about: true, privacyPolicy: true,
    terms: true, open: true, english: true, hindi: true, punjabi: true, notification: true, offer: true,
    contactSupport: true, contactUs: true, faqs: true, myOrders: true, bankDetails: true, referFriend: true,
    needHelp: true, transferPoint: true, redemptionHistory: true, scanHistory: true, save: true, saveChanges: true,
    discard: true, cancel: true, updateProfilePhoto: true, takePhoto: true, useCamera: true, chooseGallery: true,
    selectPhoto: true, tapToChangePhoto: true, submitted: true, incompleteForm: true, fillSubjectComment: true,
  } as const;
}

type WalletPreferenceProps = {
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
};

export function WalletBankDetailsScreen({ onBack, language, onLanguageChange, darkMode, onDarkModeChange }: { onBack: () => void } & WalletPreferenceProps) {
  const preferenceValue = useWalletPreferenceValue({ language, setLanguage: onLanguageChange, darkMode, setDarkMode: onDarkModeChange });

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <BankDetailsPage onBack={onBack} />
    </PreferenceContext.Provider>
  );
}

export function WalletDealerBonusScreen({ onBack, language, onLanguageChange, darkMode, onDarkModeChange }: { onBack: () => void } & WalletPreferenceProps) {
  const preferenceValue = useWalletPreferenceValue({ language, setLanguage: onLanguageChange, darkMode, setDarkMode: onDarkModeChange });

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <PartnerCommissionPage onBack={onBack} />
    </PreferenceContext.Provider>
  );
}

export function WalletTransferPointsScreen({
  onBack,
  onNavigate,
  language,
  onLanguageChange,
  darkMode,
  onDarkModeChange,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
} & WalletPreferenceProps) {
  const preferenceValue = useWalletPreferenceValue({ language, setLanguage: onLanguageChange, darkMode, setDarkMode: onDarkModeChange });

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <TransferPointsPage onBack={onBack} onNavigate={onNavigate} />
    </PreferenceContext.Provider>
  );
}
