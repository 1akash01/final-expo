import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav as DealerBottomNav } from '@/features/dealer/BottomNav';
import { CallElectricianScreen as DealerCallElectricianScreen } from '@/features/dealer/CallElectricianScreen';
import { ElectriciansScreen as DealerElectriciansScreen } from '@/features/dealer/ElectriciansScreen';
import { HomeScreen as DealerHomeScreen } from '@/features/dealer/HomeScreen';
import { MemberTierScreen as DealerMemberTierScreen } from '@/features/dealer/MemberTierScreen';
import { ProfileScreen as DealerProfileScreen } from '@/features/dealer/ProfileScreen';
import { ProductScreen as DealerProductScreen } from '@/features/dealer/ProductScreen';
import { BottomNav as ElectricianBottomNav } from '@/features/electrician/BottomNav';
import { ElectricianTierScreen } from '@/features/electrician/ElectricianTierScreen';
import { HomeScreen as ElectricianHomeScreen } from '@/features/electrician/HomeScreen';
import { NotificationScreen as ElectricianNotificationScreen } from '@/features/electrician/NotificationScreen';
import { OnboardingScreen } from '@/features/electrician/OnboardingScreen';
import { ProductScreen as ElectricianProductScreen } from '@/features/electrician/ProductScreen';
import { ProfileScreen as ElectricianProfileScreen } from '@/features/electrician/ProfileScreen';
import { RewardsScreen as ElectricianRewardsScreen } from '@/features/electrician/RewardsScreen';
import { ScanScreen as ElectricianScanScreen } from '@/features/electrician/ScanScreen';
import { WalletScreen as ElectricianWalletScreen } from '@/features/electrician/WalletScreen';
import {
  WalletBankDetailsScreen,
  WalletDealerBonusScreen,
  WalletTransferPointsScreen,
} from '@/features/profile/WalletLinkedPages';
import { PreferenceContext, getSafeTranslation, getThemePalette, translations, translateUiText, type AppLanguage } from '@/features/profile/ProfileShared';
import { colors } from '@/shared/theme/colors';
import type { Screen, UserRole } from '@/shared/types/navigation';

export default function Index() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [screenResetKey, setScreenResetKey] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('electrician');
  const [selectedProductCategory, setSelectedProductCategory] = useState('fanbox');
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [darkMode, setDarkMode] = useState(false);
  const [passwordConfiguredByRole, setPasswordConfiguredByRole] = useState<Record<UserRole, boolean>>({
    dealer: false,
    electrician: false,
  });
  const [profilePhotoByRole, setProfilePhotoByRole] = useState<Record<UserRole, string | null>>({
    dealer: null,
    electrician: null,
  });
  const [passwordValueByRole, setPasswordValueByRole] = useState<Record<UserRole, string>>({
    dealer: '',
    electrician: '',
  });

  const isDealer = currentRole === 'dealer';
  const appTheme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const statusBarStyle = darkMode ? 'light' : 'dark';
  const t = (key: keyof (typeof translations)['English']) => getSafeTranslation(language, key);
  const tx = (text: string) => translateUiText(language, text);
  const preferenceValue = useMemo(
    () => ({
      language,
      setLanguage,
      darkMode,
      setDarkMode,
      t,
      tx,
      theme: appTheme,
    }),
    [language, darkMode, appTheme]
  );

  const handleNavigate = (screen: Screen) => {
    if (screen === currentScreen) {
      setScreenResetKey((current) => current + 1);
    }

    if (screen === 'product') {
      setSelectedProductCategory((current) => current || 'fanbox');
    }

    setCurrentScreen(screen);
  };

  const handleOpenProductCategory = (category: string) => {
    setSelectedProductCategory(category);
    setCurrentScreen('product');
  };

  const handleSignOut = () => {
    setShowOnboarding(true);
    setCurrentRole('electrician');
    setCurrentScreen('home');
    setSelectedProductCategory('fanbox');
  };

  const activeScreen = useMemo(() => {
    if (isDealer) {
      switch (currentScreen) {
        case 'home':
          return (
            <DealerHomeScreen
              onNavigate={handleNavigate}
              onOpenProductCategory={handleOpenProductCategory}
              profilePhotoUri={profilePhotoByRole.dealer}
            />
          );
        case 'product':
          return (
            <DealerProductScreen
              onNavigate={handleNavigate}
              initialCategory={selectedProductCategory}
            />
          );
        case 'electricians':
          return <DealerElectriciansScreen onNavigate={handleNavigate} />;
        case 'call_electrician':
          return <DealerCallElectricianScreen />;
        case 'notification':
          return <ElectricianNotificationScreen onNavigate={handleNavigate} />;
        case 'scan':
          return <ElectricianScanScreen onNavigate={handleNavigate} />;
        case 'rewards':
          return <ElectricianRewardsScreen />;
        case 'wallet':
          return <ElectricianWalletScreen role="dealer" onNavigate={handleNavigate} />;
        case 'profile':
          return (
            <DealerProfileScreen
              onNavigate={handleNavigate}
              onSignOut={handleSignOut}
              hasPasswordConfigured={passwordConfiguredByRole.dealer}
              storedPassword={passwordValueByRole.dealer}
              onPasswordConfiguredChange={(configured) =>
                setPasswordConfiguredByRole((current) => ({ ...current, dealer: configured }))
              }
              onPasswordChange={(password) =>
                setPasswordValueByRole((current) => ({ ...current, dealer: password }))
              }
              language={language}
              onLanguageChange={setLanguage}
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              profilePhotoUri={profilePhotoByRole.dealer}
              onProfilePhotoChange={(photoUri) => setProfilePhotoByRole((current) => ({ ...current, dealer: photoUri }))}
            />
          );
        case 'dealer_tier':
          return <DealerMemberTierScreen onBack={() => setCurrentScreen('home')} />;
        case 'bank_details':
          return <WalletBankDetailsScreen onBack={() => setCurrentScreen('wallet')} language={language} onLanguageChange={setLanguage} darkMode={darkMode} onDarkModeChange={setDarkMode} />;
        case 'dealer_bonus':
          return <WalletDealerBonusScreen onBack={() => setCurrentScreen('wallet')} language={language} onLanguageChange={setLanguage} darkMode={darkMode} onDarkModeChange={setDarkMode} />;
        case 'transfer_points':
          return <WalletTransferPointsScreen onBack={() => setCurrentScreen('wallet')} onNavigate={handleNavigate} language={language} onLanguageChange={setLanguage} darkMode={darkMode} onDarkModeChange={setDarkMode} />;
        default:
          return (
            <DealerHomeScreen
              onNavigate={handleNavigate}
              onOpenProductCategory={handleOpenProductCategory}
              profilePhotoUri={profilePhotoByRole.dealer}
            />
          );
      }
    }

    switch (currentScreen) {
      case 'home':
        return (
          <ElectricianHomeScreen
            onNavigate={handleNavigate}
            onOpenProductCategory={handleOpenProductCategory}
            profilePhotoUri={profilePhotoByRole.electrician}
          />
        );
      case 'product':
        return (
          <ElectricianProductScreen
            onNavigate={handleNavigate}
            initialCategory={selectedProductCategory}
          />
        );
      case 'notification':
        return <ElectricianNotificationScreen onNavigate={handleNavigate} />;
      case 'scan':
        return <ElectricianScanScreen onNavigate={handleNavigate} />;
      case 'rewards':
        return <ElectricianRewardsScreen />;
      case 'profile':
        return (
          <ElectricianProfileScreen
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
            hasPasswordConfigured={passwordConfiguredByRole.electrician}
            storedPassword={passwordValueByRole.electrician}
            onPasswordConfiguredChange={(configured) =>
              setPasswordConfiguredByRole((current) => ({ ...current, electrician: configured }))
            }
            onPasswordChange={(password) =>
              setPasswordValueByRole((current) => ({ ...current, electrician: password }))
            }
            language={language}
            onLanguageChange={setLanguage}
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
            profilePhotoUri={profilePhotoByRole.electrician}
            onProfilePhotoChange={(photoUri) => setProfilePhotoByRole((current) => ({ ...current, electrician: photoUri }))}
          />
        );
      case 'wallet':
        return <ElectricianWalletScreen role="electrician" onNavigate={handleNavigate} />;
      case 'electrician_tier':
        return <ElectricianTierScreen onBack={() => setCurrentScreen('home')} />;
      case 'bank_details':
        return <WalletBankDetailsScreen onBack={() => setCurrentScreen('wallet')} language={language} onLanguageChange={setLanguage} darkMode={darkMode} onDarkModeChange={setDarkMode} />;
      case 'transfer_points':
        return <WalletTransferPointsScreen onBack={() => setCurrentScreen('wallet')} onNavigate={handleNavigate} language={language} onLanguageChange={setLanguage} darkMode={darkMode} onDarkModeChange={setDarkMode} />;
      default:
        return (
          <ElectricianHomeScreen
            onNavigate={handleNavigate}
            onOpenProductCategory={handleOpenProductCategory}
            profilePhotoUri={profilePhotoByRole.electrician}
          />
        );
    }
  }, [
    currentScreen,
    isDealer,
    passwordConfiguredByRole.dealer,
    passwordConfiguredByRole.electrician,
    profilePhotoByRole.dealer,
    profilePhotoByRole.electrician,
    passwordValueByRole.dealer,
    passwordValueByRole.electrician,
    language,
    darkMode,
    selectedProductCategory,
  ]);

  if (showOnboarding) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ExpoStatusBar style={statusBarStyle} />
        <PreferenceContext.Provider value={preferenceValue}>
          <OnboardingScreen
            onGetStarted={(role, options) => {
              if (typeof options?.passwordConfigured === 'boolean') {
                setPasswordConfiguredByRole((current) => ({ ...current, [role]: options.passwordConfigured as boolean }));
                if (!options.passwordConfigured) {
                  setPasswordValueByRole((current) => ({ ...current, [role]: '' }));
                }
              }
              if (typeof options?.passwordValue === 'string') {
                setPasswordValueByRole((current) => ({ ...current, [role]: options.passwordValue as string }));
              }
              setCurrentRole(role);
              setCurrentScreen('home');
              setShowOnboarding(false);
            }}
          />
        </PreferenceContext.Provider>
      </View>
    );
  }

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: appTheme.bg }]}>
        <ExpoStatusBar style={statusBarStyle} />
        <View style={styles.content} key={`${currentRole}-${currentScreen}-${screenResetKey}`}>{activeScreen}</View>
        {isDealer ? (
          <DealerBottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        ) : (
          <ElectricianBottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        )}
      </View>
    </PreferenceContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    flex: 1,
  },
});
