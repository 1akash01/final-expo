import React, { useMemo, useState } from 'react';
import { BankDetailsPage } from './BankDetails';
import { PartnerCommissionPage } from './PartnerCommission';
import { PreferenceContext, getThemePalette, type AppLanguage } from './ProfileShared';
import { TransferPointsPage } from './TransferPoints';
import { translations } from './ProfileShared';
import type { Screen } from '@/shared/types/navigation';

function useWalletPreferenceValue() {
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => translations[language][key];

  return useMemo(
    () => ({ language, setLanguage, darkMode, setDarkMode, t, theme }),
    [darkMode, language, theme]
  );
}

export function WalletBankDetailsScreen({ onBack }: { onBack: () => void }) {
  const preferenceValue = useWalletPreferenceValue();

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <BankDetailsPage onBack={onBack} />
    </PreferenceContext.Provider>
  );
}

export function WalletDealerBonusScreen({ onBack }: { onBack: () => void }) {
  const preferenceValue = useWalletPreferenceValue();

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <PartnerCommissionPage onBack={onBack} />
    </PreferenceContext.Provider>
  );
}

export function WalletTransferPointsScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const preferenceValue = useWalletPreferenceValue();

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <TransferPointsPage onBack={onBack} onNavigate={onNavigate} />
    </PreferenceContext.Provider>
  );
}
