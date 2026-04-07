import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Svg, { Path } from 'react-native-svg';

export type UserRole = 'electrician' | 'dealer';
type AuthMode = 'login' | 'signup';
type LoginStep = 'phone' | 'otp' | 'password';
type SignupStep = 'name' | 'email' | 'dealer' | 'address' | 'location' | 'identity' | 'holders' | 'terms' | 'phone' | 'otp' | 'password';
type ElectricianLoginMethod = 'otp' | 'password' | null;

const dealerDirectory: Record<string, { dealerName: string; city: string }> = {
  '9876543210': { dealerName: 'Sharma Electricals', city: 'Delhi' },
  '9988776655': { dealerName: 'Ravi Traders', city: 'Mumbai' },
  '9123456789': { dealerName: 'Gupta Power House', city: 'Jaipur' },
};

const C = {
  bg: '#EEF3F8',
  heroA: '#EAF3FF',
  heroB: '#DDEEFF',
  heroC: '#F6EEFF',
  white: '#FFFFFF',
  line: '#E6ECF5',
  text: '#152238',
  title: '#14213D',
  muted: '#74829D',
  muted2: '#5C6F91',
  field: '#FBFDFF',
  fieldLine: '#D8E2F0',
  primary: '#E8453C',
  success: '#1F9C5D',
  successSoft: '#EAF8EF',
  error: '#D64B4B',
  errorSoft: '#FFF3F3',
  warmA: '#F97316',
  warmB: '#EF4444',
  accentA: '#0EA5E9',
  accentB: '#8B5CF6',
};

const roleMeta = {
  electrician: { title: 'Electrician', subtitle: 'Field rewards and quick verification' },
  dealer: { title: 'Dealer', subtitle: 'Business onboarding and account access' },
} as const;

const roleImages = {
  electrician: require('../../../assets/electrician-role.png'),
  dealer: require('../../../assets/dealer-role.png'),
} as const;

const isValidEmail = (value: string) => {
  const trimmed = value.trim();
  return !trimmed || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

const dealerSignupMeta: Partial<Record<SignupStep, { stepLabel: string; title: string; description: string; buttonLabel: string }>> = {
  name: {
    stepLabel: 'Step 1 of 5',
    title: 'Business Profile',
    description: 'Enter the owner or business name, email address, and business address in a clean business format.',
    buttonLabel: 'Continue to Location',
  },
  location: {
    stepLabel: 'Step 2 of 5',
    title: 'Location Details',
    description: 'Review the state, city, and pincode. Auto-filled details can still be edited if needed.',
    buttonLabel: 'Continue to Identity',
  },
  identity: {
    stepLabel: 'Step 3 of 5',
    title: 'Business Identity',
    description: 'Add GST or PAN details now, or skip this step and update them later from Edit Profile.',
    buttonLabel: 'Continue to Mobile Verification',
  },
  holders: {
    stepLabel: 'Step 4 of 5',
    title: 'Mobile Verification',
    description: 'Verify the dealer mobile number before moving to the final security step.',
    buttonLabel: 'Continue to Security',
  },
  password: {
    stepLabel: 'Step 5 of 5',
    title: 'Password & Consent',
    description: 'Create a password if you want and finish the account setup securely.',
    buttonLabel: 'Create Account',
  },
};

function useReveal() {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fade]);
  return { opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] };
}

function Info({ text, kind }: { text: string; kind: 'error' | 'success' }) {
  return (
    <View style={[s.info, kind === 'error' ? s.infoError : s.infoSuccess]}>
      <Text style={[s.infoText, kind === 'error' ? s.infoErrorText : s.infoSuccessText]}>{text}</Text>
    </View>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <Path d="M2 12C3.9 8.3 7.5 6 12 6C16.5 6 20.1 8.3 22 12C20.1 15.7 16.5 18 12 18C7.5 18 3.9 15.7 2 12Z" stroke="#5C6F91" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z" stroke="#5C6F91" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <Path d="M3 3L21 21" stroke="#5C6F91" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M10.6 6.3C11.05 6.1 11.52 6 12 6C16.5 6 20.1 8.3 22 12C21.2 13.56 20.11 14.88 18.8 15.89" stroke="#5C6F91" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M6.17 8.22C4.54 9.16 3.18 10.44 2 12C3.9 15.7 7.5 18 12 18C13.76 18 15.37 17.65 16.79 17.03" stroke="#5C6F91" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9.9 9.92C9.32 10.5 8.96 11.3 8.96 12.18C8.96 13.94 10.38 15.36 12.14 15.36C13.02 15.36 13.82 15 14.4 14.42" stroke="#5C6F91" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </Svg>
  );
}

function BackArrowIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5L8 12L15 19" stroke="#152238" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  prefix,
  error,
  onFocus,
  onSubmitEditing,
  actionLabel,
  onActionPress,
  actionDisabled,
  actionContent,
  inputRef,
  returnKeyType,
  blurOnSubmit,
  editable,
  onPressIn,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  secureTextEntry?: boolean;
  prefix?: string;
  error?: string;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  actionDisabled?: boolean;
  actionContent?: React.ReactNode;
  inputRef?: React.RefObject<TextInput | null>;
  returnKeyType?: 'done' | 'next';
  blurOnSubmit?: boolean;
  editable?: boolean;
  onPressIn?: () => void;
}) {
  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.shell, error ? s.shellError : null]}>
        {prefix ? (
          <View style={s.prefixWrap}>
            <Text style={s.prefix}>{prefix}</Text>
          </View>
        ) : null}
        <TextInput
          ref={inputRef}
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#90A0BB"
          keyboardType={keyboardType ?? 'default'}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType ?? 'done'}
          blurOnSubmit={blurOnSubmit ?? returnKeyType !== 'next'}
          editable={editable ?? true}
          onPressIn={onPressIn}
        />
        {actionLabel || actionContent ? (
          <Pressable
            onPress={onActionPress}
            disabled={actionDisabled}
            style={[
              s.fieldAction,
              actionLabel === 'Current Address' ? s.fieldActionWide : null,
              actionContent ? s.fieldActionIcon : null,
              actionDisabled ? s.fieldActionDisabled : null,
            ]}
          >
            {actionContent ?? <Text style={[s.fieldActionText, actionDisabled ? s.fieldActionTextDisabled : null]}>{actionLabel}</Text>}
          </Pressable>
        ) : null}
      </View>
      {error ? <Info text={error} kind="error" /> : null}
    </View>
  );
}

function Button({
  label,
  onPress,
  disabled,
  secondary,
  colors,
  shadowColor,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  secondary?: boolean;
  colors?: [string, string];
  shadowColor?: string;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={s.btnOuter}>
      <LinearGradient
        colors={
          disabled
            ? ['#D0D8E4', '#D0D8E4']
            : colors
              ? colors
            : secondary
              ? [C.accentA, C.accentB]
              : [C.warmB, C.warmA]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[s.btn, secondary ? s.btnSecondary : null, shadowColor ? { shadowColor } : null]}
      >
        <Text style={[s.btnText, secondary ? s.btnTextSecondary : null]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function Tabs({ mode, role, onChange }: { mode: AuthMode; role: UserRole; onChange: (mode: AuthMode) => void }) {
  return (
    <View style={s.tabs}>
      {(['login', 'signup'] as AuthMode[]).map((item) => (
        <Pressable
          key={item}
          style={[
            s.tab,
            mode === item ? (role === 'electrician' ? s.tabElectricianActive : s.tabDealerActive) : null,
          ]}
          onPress={() => onChange(item)}
        >
          <Text style={[s.tabText, mode === item ? s.tabTextActive : null]}>{item === 'login' ? 'Login' : 'Create Account'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function RoleCard({ role, selected, onPress }: { role: UserRole; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.roleCard,
        role === 'electrician' ? s.roleCardElectrician : s.roleCardDealer,
        selected ? (role === 'electrician' ? s.roleCardElectricianActive : s.roleCardDealerActive) : null,
      ]}
    >
      <View style={s.roleFrame}>
        <Image source={roleImages[role]} style={s.roleImage} resizeMode="contain" />
      </View>
      <Text style={[s.roleTitle, selected ? s.roleTitleActive : s.roleTitleDefault]}>{roleMeta[role].title}</Text>
      <Text style={[s.roleSubtitle, selected ? s.roleSubtitleActive : s.roleSubtitleDefault]}>{roleMeta[role].subtitle}</Text>
    </Pressable>
  );
}

export function OnboardingScreen({
  onGetStarted,
}: {
  onGetStarted: (role: UserRole, options?: { passwordConfigured?: boolean; passwordValue?: string }) => void;
}) {
  const reveal = useReveal();
  const scrollRef = useRef<ScrollView | null>(null);
  const loginPhoneRef = useRef<TextInput | null>(null);
  const loginOtpRef = useRef<TextInput | null>(null);
  const loginPassRef = useRef<TextInput | null>(null);
  const signupDealerRef = useRef<TextInput | null>(null);
  const signupAddressRef = useRef<TextInput | null>(null);
  const signupPhoneRef = useRef<TextInput | null>(null);
  const signupOtpRef = useRef<TextInput | null>(null);
  const signupStateRef = useRef<TextInput | null>(null);
  const signupCityRef = useRef<TextInput | null>(null);
  const signupPincodeRef = useRef<TextInput | null>(null);
  const signupGstNumberRef = useRef<TextInput | null>(null);
  const signupPanNumberRef = useRef<TextInput | null>(null);
  const signupGstHolderRef = useRef<TextInput | null>(null);
  const signupPanHolderRef = useRef<TextInput | null>(null);
  const signupPassRef = useRef<TextInput | null>(null);
  const signupConfirmPassRef = useRef<TextInput | null>(null);

  const [phase, setPhase] = useState<'role' | 'auth'>('role');
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('electrician');
  const [authSelectionOpen, setAuthSelectionOpen] = useState(false);
  const [electricianLoginMethod, setElectricianLoginMethod] = useState<ElectricianLoginMethod>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginStep, setLoginStep] = useState<LoginStep>('phone');
  const [loginOtpVerified, setLoginOtpVerified] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDealerPhone, setSignupDealerPhone] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupState, setSignupState] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupPincode, setSignupPincode] = useState('');
  const [signupGstNumber, setSignupGstNumber] = useState('');
  const [signupPanNumber, setSignupPanNumber] = useState('');
  const [signupGstHolderName, setSignupGstHolderName] = useState('');
  const [signupPanHolderName, setSignupPanHolderName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirmPass, setSignupConfirmPass] = useState('');
  const [signupStep, setSignupStep] = useState<SignupStep>('name');
  const [dealerVerified, setDealerVerified] = useState(false);
  const [verifiedDealerName, setVerifiedDealerName] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  useEffect(() => {
    if (loginStep === 'otp') {
      const timer = setTimeout(() => loginOtpRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [loginStep]);

  useEffect(() => {
    if (!signupOtpSent || signupOtpVerified) return;
    const shouldFocusOtp =
      (role === 'dealer' && signupStep === 'holders') ||
      (role === 'electrician' && signupStep === 'otp');
    if (!shouldFocusOtp) return;
    const timer = setTimeout(() => signupOtpRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [role, signupOtpSent, signupOtpVerified, signupStep]);

  useEffect(() => {
    if (loginOtpVerified || signupOtpVerified) {
      dismissKeyboard();
    }
  }, [loginOtpVerified, signupOtpVerified]);

  const matchedDealer = signupDealerPhone.length === 10 ? dealerDirectory[signupDealerPhone] : undefined;
  const setError = (key: string, value?: string) => setErrors((current) => {
    if (!value) {
      const next = { ...current };
      delete next[key];
      return next;
    }
    return { ...current, [key]: value };
  });

  const scrollToForm = () => setTimeout(() => scrollRef.current?.scrollTo({ y: 420, animated: true }), 120);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    [
      loginPhoneRef,
      loginOtpRef,
      loginPassRef,
      signupDealerRef,
      signupAddressRef,
      signupPhoneRef,
      signupOtpRef,
      signupStateRef,
      signupCityRef,
      signupPincodeRef,
      signupGstNumberRef,
      signupPanNumberRef,
      signupGstHolderRef,
      signupPanHolderRef,
      signupPassRef,
      signupConfirmPassRef,
    ].forEach((ref) => ref.current?.blur());
  };

  const resetForm = () => {
    setErrors({});
    setLoading(false);
    setShowPassword(false);
    setAuthSelectionOpen(false);
    setElectricianLoginMethod(null);
    setLoginPhone('');
    setLoginOtp('');
    setLoginPass('');
    setLoginStep('phone');
    setLoginOtpVerified(false);
    setSignupName('');
    setSignupEmail('');
    setSignupDealerPhone('');
    setSignupAddress('');
    setSignupState('');
    setSignupCity('');
    setSignupPincode('');
    setSignupGstNumber('');
    setSignupPanNumber('');
    setSignupGstHolderName('');
    setSignupPanHolderName('');
    setSignupPhone('');
    setSignupOtp('');
    setSignupOtpSent(false);
    setSignupOtpVerified(false);
    setSignupPass('');
    setSignupConfirmPass('');
    setSignupStep('name');
    setDealerVerified(false);
    setVerifiedDealerName('');
    setLocationLoading(false);
    setLocationMessage('');
  };

  const handlePhone = (setter: (value: string) => void) => (value: string) => setter(value.replace(/\D/g, '').slice(0, 10));
  const handleOtp = (setter: (value: string) => void) => (value: string) => setter(value.replace(/\D/g, '').slice(0, 4));
  const handleSignupEmail = (value: string) => {
    setSignupEmail(value);
    setError('signupEmail', isValidEmail(value) ? undefined : 'Please enter a valid email address like name@example.com.');
  };
  const handleSignupPhone = (value: string) => {
    const nextPhone = value.replace(/\D/g, '').slice(0, 10);
    setSignupPhone(nextPhone);
    setSignupOtp('');
    setSignupOtpSent(false);
    setSignupOtpVerified(false);
    setError('signupPhone');
    setError('signupOtp');
  };
  const signupPasswordReady =
    (signupPass.length === 0 && signupConfirmPass.length === 0) ||
    (signupPass.length >= 6 && signupConfirmPass === signupPass);

  const canContinue = useMemo(() => {
    if (mode === 'login') {
      if (role === 'electrician') {
        if (electricianLoginMethod === 'otp') return loginPhone.length === 10 && loginOtp.length === 4 && loginOtpVerified;
        if (electricianLoginMethod === 'password') return loginPhone.length === 10 && loginStep === 'password' && loginPass.length >= 6;
        return false;
      }
      return loginPhone.length === 10 && loginOtp.length === 4 && loginPass.length >= 6;
    }
    if (role === 'dealer') {
      return signupName.trim().length >= 3 && isValidEmail(signupEmail) && signupAddress.trim().length >= 5 && signupState.trim().length >= 2 && signupCity.trim().length >= 2 && signupPincode.trim().length >= 4 && signupPhone.length === 10 && signupOtpVerified && signupPasswordReady;
    }
    return signupName.trim().length >= 3 && dealerVerified && signupAddress.trim().length >= 5 && signupPhone.length === 10 && signupOtpVerified && signupPasswordReady;
  }, [dealerVerified, electricianLoginMethod, loginOtp, loginOtpVerified, loginPass, loginPhone, loginStep, mode, role, signupAddress, signupCity, signupConfirmPass, signupEmail, signupName, signupOtpVerified, signupPass, signupPasswordReady, signupPincode, signupPhone, signupState]);
  const dealerSignupContent = role === 'dealer' ? dealerSignupMeta[signupStep] ?? dealerSignupMeta.name : null;

  const submitAuth = () => {
    dismissKeyboard();
    if (mode === 'login') {
      if (role === 'electrician') {
        if (electricianLoginMethod === 'otp') {
          if (!loginOtpVerified) return setError('loginOtp', 'Please verify the OTP before logging in.');
          setError('loginOtp');
        }
        if (electricianLoginMethod === 'password') {
          if (loginPass.length < 6) return setError('loginPass', 'Password must be at least 6 characters long.');
          setError('loginPass');
        }
        if (!electricianLoginMethod) return setError('loginMode', 'Please choose a login option.');
      } else if (loginPass.length < 6) {
        return setError('loginPass', 'Password must be at least 6 characters long.');
      }
    }
    if (mode === 'signup' && role === 'dealer') {
      if (signupPhone.length !== 10) return setError('signupPhone', 'Please enter a valid 10-digit mobile number.');
      if (!signupOtpVerified) return setError('signupOtp', 'Please verify the OTP before creating your account.');
      setError('signupPhone');
      setError('signupOtp');
    }
    if (mode === 'signup' && (signupPass.length > 0 || signupConfirmPass.length > 0)) {
      if (signupPass.length < 6) return setError('signupPass', 'Password must be at least 6 characters long.');
      if (signupConfirmPass !== signupPass) return setError('signupConfirmPass', 'Passwords do not match. Please re-enter the same password.');
    }
    setError('loginPass');
    setError('loginMode');
    setError('signupPass');
    setError('signupConfirmPass');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const passwordConfigured =
        mode === 'signup'
          ? signupPass.length >= 6
          : role === 'dealer'
            ? true
            : electricianLoginMethod === 'password'
              ? true
              : undefined;
      const passwordValue =
        mode === 'signup'
          ? (signupPass.length >= 6 ? signupPass : '')
          : loginPass.length >= 6
            ? loginPass
            : undefined;
      onGetStarted(
        role,
        typeof passwordConfigured === 'boolean'
          ? { passwordConfigured, passwordValue }
          : typeof passwordValue === 'string'
            ? { passwordValue }
            : undefined
      );
    }, 900);
  };

  const useCurrentLocation = async () => {
    dismissKeyboard();
    if (locationLoading) return;
    setLocationLoading(true);
    setLocationMessage('');
    setError('signupAddress');
    setError('signupState');
    setError('signupCity');
    setError('signupPincode');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setError('signupAddress', 'Location permission is required to fetch the current address. You can still enter the details manually.');
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const reverseLookup = await Location.reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
      const currentAddress = reverseLookup[0];

      if (!currentAddress) {
        setError('signupAddress', 'We could not detect the current address. Please enter the address manually.');
        return;
      }

      const addressParts = Array.from(new Set([
        currentAddress.name,
        currentAddress.streetNumber,
        currentAddress.street,
        currentAddress.district,
        currentAddress.subregion,
      ].map((part) => part?.trim()).filter(Boolean))) as string[];
      const resolvedAddress = addressParts.join(', ');
      const resolvedState = currentAddress.region?.trim() ?? '';
      const resolvedCity = currentAddress.city?.trim() || currentAddress.subregion?.trim() || currentAddress.district?.trim() || '';
      const resolvedPincode = currentAddress.postalCode?.replace(/\D/g, '').slice(0, 6) ?? '';

      if (!resolvedAddress && !resolvedState && !resolvedCity && !resolvedPincode) {
        setError('signupAddress', 'We could not detect the current address. Please enter the address manually.');
        return;
      }

      if (resolvedAddress) setSignupAddress(resolvedAddress);
      if (resolvedState) setSignupState(resolvedState);
      if (resolvedCity) setSignupCity(resolvedCity);
      if (resolvedPincode) setSignupPincode(resolvedPincode);
      setLocationMessage('Current address details were fetched successfully. You can review and update them if needed.');
    } catch {
      setError('signupAddress', 'Current address could not be fetched right now. Please try again shortly or enter the details manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const continueLoginPhone = () => {
    dismissKeyboard();
    if (loginPhone.length !== 10) return setError('loginPhone', 'Please enter a valid 10-digit mobile number.');
    setError('loginPhone');
    if (role === 'electrician') {
      if (!electricianLoginMethod) return setError('loginMode', 'Please choose a login option.');
      setError('loginMode');
      setLoginOtp('');
      setLoginPass('');
      setLoginOtpVerified(false);
      setLoginStep(electricianLoginMethod === 'otp' ? 'otp' : 'password');
      return;
    }
    setLoginStep('otp');
  };

  const verifyLoginOtp = () => {
    dismissKeyboard();
    if (loginOtp.length !== 4) return setError('loginOtp', 'Enter the 4-digit OTP to continue.');
    setError('loginOtp');
    if (role === 'electrician' && electricianLoginMethod === 'otp') {
      setLoginOtpVerified(true);
      return;
    }
    setLoginStep('password');
  };

  const verifyDealer = () => {
    dismissKeyboard();
    if (signupDealerPhone.length !== 10) return setError('signupDealerPhone', 'Enter a valid 10-digit dealer number.');
    setError('signupDealerPhone');
    setDealerVerified(true);
    setVerifiedDealerName(matchedDealer?.dealerName ?? 'SRV Premium Dealer');
  };

  const sendSignupOtp = () => {
    dismissKeyboard();
    if (signupPhone.length !== 10) return setError('signupPhone', 'Please enter a valid 10-digit mobile number.');
    setError('signupPhone');
    setError('signupOtp');
    setSignupOtp('');
    setSignupOtpSent(true);
    setSignupOtpVerified(false);
    if (role === 'electrician') setSignupStep('otp');
  };

  const verifySignupOtp = () => {
    dismissKeyboard();
    if (!signupOtpSent) return setError('signupOtp', 'Please verify your mobile number first.');
    if (signupOtp.length !== 4) return setError('signupOtp', 'Enter the 4-digit OTP to verify your number.');
    setError('signupOtp');
    setSignupOtpVerified(true);
    setSignupStep('password');
  };

  const continueSignup = () => {
    dismissKeyboard();
    if (role === 'dealer') {
      if (signupStep === 'name') {
        if (signupName.trim().length < 3) return setError('signupName', 'Please fill the full name field.');
        if (!isValidEmail(signupEmail)) return setError('signupEmail', 'Please enter a valid email address like name@example.com.');
        if (signupAddress.trim().length < 5) return setError('signupAddress', 'Please fill the address field.');
        setError('signupName');
        setError('signupEmail');
        setError('signupAddress');
        setSignupStep('location');
        return;
      }

      if (signupStep === 'location') {
        if (signupState.trim().length < 2) return setError('signupState', 'Please enter state.');
        if (signupCity.trim().length < 2) return setError('signupCity', 'Please enter city.');
        if (signupPincode.trim().length < 4) return setError('signupPincode', 'Please enter a valid pincode.');
        setError('signupState');
        setError('signupCity');
        setError('signupPincode');
        setSignupStep('identity');
        return;
      }

      if (signupStep === 'identity') {
        setError('signupGstNumber');
        setError('signupGstHolderName');
        setSignupStep('holders');
        return;
      }

      if (signupStep === 'holders') {
        if (!signupOtpSent) {
          sendSignupOtp();
          return;
        }
        if (!signupOtpVerified) {
          verifySignupOtp();
          return;
        }
        setSignupStep('password');
      }
      return;
    }

    if (signupStep === 'name') {
      if (signupName.trim().length < 3) return setError('signupName', 'Please fill the name field.');
      setError('signupName');
      setSignupStep('dealer');
      return;
    }
    if (signupStep === 'dealer') {
      if (!dealerVerified) return setError('signupDealerPhone', 'Please verify the dealer number before continuing.');
      setSignupStep('address');
      return;
    }
    if (signupStep === 'address') {
      if (signupAddress.trim().length < 5) return setError('signupAddress', 'Please fill the address field.');
      setError('signupAddress');
      setSignupStep('phone');
      return;
    }
    if (signupStep === 'phone') {
      sendSignupOtp();
      return;
    }
    if (signupStep === 'otp') {
      verifySignupOtp();
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
      <StatusBar hidden />
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <LinearGradient colors={[C.heroA, C.heroB, C.heroC]} style={s.bg}>
          <View style={s.glow1} />
          <View style={s.glow2} />
          <View style={s.glow3} />
          <ScrollView ref={scrollRef} contentContainerStyle={[s.content, phase === 'role' ? s.contentRole : null]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'} automaticallyAdjustKeyboardInsets scrollEnabled={phase !== 'role'}>
            <Animated.View style={[reveal, phase === 'role' ? s.revealRole : null]}>
            <View style={s.topRow}>
              <View style={s.brandBlock}>
                <View style={s.logoWrap}><Image source={require('../../../assets/srv-login-logo.png')} style={s.logo} resizeMode="contain" /></View>
              </View>
              {phase === 'auth' ? <Pressable onPress={() => { dismissKeyboard(); resetForm(); setPhase('role'); }} style={s.back}><BackArrowIcon /></Pressable> : null}
            </View>

            <View style={s.welcomeBadge}>
              <LinearGradient colors={['rgba(14,165,233,0.12)', 'rgba(139,92,246,0.12)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.welcomeBadgeFill}>
                <Text style={s.eyebrow}>Welcome to SRV</Text>
              </LinearGradient>
            </View>
            <Text style={[s.bigTitle, role === 'electrician' ? s.bigTitleElectrician : s.bigTitleDealer]}>{roleMeta[role].title}</Text>
            <Text style={s.subtext}>{phase === 'role' ? 'Choose your role to start the onboarding journey.' : 'Professional authentication flow aligned with the app design system.'}</Text>

            {phase === 'role' ? (
              <View style={[s.card, s.roleSetupCard]}>
                <Text style={s.sectionEyebrow}>Account Setup</Text>
                <Text style={s.sectionTitle}>CHOOSE YOUR ROLE</Text>
                <Text style={s.sectionText}>This keeps rewards, verification and account setup perfectly aligned.</Text>
                <View style={s.roleGrid}>
                  <RoleCard role="electrician" selected={role === 'electrician'} onPress={() => setRole('electrician')} />
                  <RoleCard role="dealer" selected={role === 'dealer'} onPress={() => setRole('dealer')} />
                </View>
                <Button
                  label="Continue"
                  onPress={() => {
                    resetForm();
                    setMode('login');
                    setPhase('auth');
                    setAuthSelectionOpen(true);
                  }}
                  disabled={!role}
                  colors={role === 'electrician' ? ['#159A6F', '#47C98B'] : ['#2C6BE7', '#5DAAF8']}
                  shadowColor={role === 'electrician' ? '#159A6F' : '#2C6BE7'}
                />
              </View>
            ) : (
              <View style={s.card}>
                <Text style={s.sectionEyebrow}>Authentication</Text>
                <Text style={s.sectionTitle}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>
                <Text style={s.sectionText}>Smooth inputs, full-screen layout, and no keyboard overlap while typing.</Text>
                <Tabs
                  mode={mode}
                  role={role}
                  onChange={(next) => {
                    dismissKeyboard();
                    resetForm();
                    setMode(next);
                    setPhase('auth');
                    setAuthSelectionOpen(true);
                  }}
                />

                {!authSelectionOpen ? null : mode === 'login' ? (
                  <View style={s.form}>
                    {role === 'electrician' ? (
                      <>
                        <Text style={s.label}>Select Login Method</Text>
                        <View style={s.loginChoiceRow}>
                          <Pressable
                            onPress={() => {
                              setElectricianLoginMethod('otp');
                              setLoginStep('phone');
                              setLoginOtp('');
                              setLoginPass('');
                              setLoginOtpVerified(false);
                              setError('loginMode');
                              setError('loginOtp');
                              setError('loginPass');
                            }}
                            style={[s.loginChoiceCard, electricianLoginMethod === 'otp' ? s.loginChoiceCardActive : null]}
                          >
                            <Text style={[s.loginChoiceText, electricianLoginMethod === 'otp' ? s.loginChoiceTextActive : null]}>Login with OTP</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setElectricianLoginMethod('password');
                              setLoginStep('password');
                              setLoginOtp('');
                              setLoginPass('');
                              setLoginOtpVerified(false);
                              setError('loginMode');
                              setError('loginPhone');
                              setError('loginOtp');
                              setError('loginPass');
                            }}
                            style={[s.loginChoiceCard, electricianLoginMethod === 'password' ? s.loginChoiceCardActive : null]}
                          >
                            <Text style={[s.loginChoiceText, electricianLoginMethod === 'password' ? s.loginChoiceTextActive : null]}>Login with Password</Text>
                          </Pressable>
                        </View>
                        {errors.loginMode ? <Info text={errors.loginMode} kind="error" /> : null}
                        {electricianLoginMethod ? (
                          <>
                            <Field label="Mobile Number" value={loginPhone} onChangeText={handlePhone(setLoginPhone)} placeholder="Enter mobile number" keyboardType="phone-pad" prefix="+91" error={errors.loginPhone} onFocus={scrollToForm} inputRef={loginPhoneRef} onSubmitEditing={electricianLoginMethod === 'otp' ? continueLoginPhone : undefined} actionLabel={electricianLoginMethod === 'otp' && loginStep === 'phone' ? 'Verify' : undefined} onActionPress={electricianLoginMethod === 'otp' ? continueLoginPhone : undefined} actionDisabled={electricianLoginMethod === 'otp' ? loginPhone.length !== 10 : undefined} />
                            {electricianLoginMethod === 'otp' && loginStep !== 'phone' ? <Field label="OTP" value={loginOtp} onChangeText={handleOtp(setLoginOtp)} placeholder="Enter 4 digit OTP" keyboardType="numeric" error={errors.loginOtp} onFocus={scrollToForm} inputRef={loginOtpRef} onSubmitEditing={verifyLoginOtp} /> : null}
                            {electricianLoginMethod === 'otp' && loginStep !== 'phone' && !loginOtpVerified ? <Button label="Verify OTP" onPress={verifyLoginOtp} disabled={loginOtp.length !== 4} secondary /> : null}
                            {electricianLoginMethod === 'otp' && loginOtpVerified ? <Info text="OTP verified successfully." kind="success" /> : null}
                            {electricianLoginMethod === 'otp' && loginOtpVerified ? <Button label={loading ? 'Logging In...' : 'Login'} onPress={submitAuth} disabled={!canContinue || loading} /> : null}
                            {electricianLoginMethod === 'password' && loginStep === 'password' ? <Field label="Password" value={loginPass} onChangeText={setLoginPass} placeholder="Enter password" secureTextEntry={!showPassword} error={errors.loginPass} onFocus={scrollToForm} inputRef={loginPassRef} actionContent={<EyeIcon open={showPassword} />} onActionPress={() => setShowPassword((current) => !current)} /> : null}
                            {electricianLoginMethod === 'password' && loginStep === 'password' ? <Button label={loading ? 'Logging In...' : 'Login'} onPress={submitAuth} disabled={!canContinue || loading} /> : null}
                          </>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Field label="Mobile Number" value={loginPhone} onChangeText={handlePhone(setLoginPhone)} placeholder="Enter mobile number" keyboardType="phone-pad" prefix="+91" error={errors.loginPhone} onFocus={scrollToForm} inputRef={loginPhoneRef} onSubmitEditing={continueLoginPhone} actionLabel={loginStep === 'phone' ? 'Verify' : undefined} onActionPress={continueLoginPhone} actionDisabled={loginPhone.length !== 10} />
                        {loginStep !== 'phone' ? <Field label="OTP" value={loginOtp} onChangeText={handleOtp(setLoginOtp)} placeholder="Enter 4 digit OTP" keyboardType="numeric" error={errors.loginOtp} onFocus={scrollToForm} inputRef={loginOtpRef} onSubmitEditing={verifyLoginOtp} /> : null}
                        {loginStep !== 'phone' ? <Button label="Verify OTP" onPress={verifyLoginOtp} disabled={loginOtp.length !== 4} secondary /> : null}
                        {loginStep === 'password' ? <Info text="OTP verification successful." kind="success" /> : null}
                        {loginStep === 'password' ? <Field label="Password" value={loginPass} onChangeText={setLoginPass} placeholder="Enter password" secureTextEntry={!showPassword} error={errors.loginPass} onFocus={scrollToForm} inputRef={loginPassRef} onSubmitEditing={dismissKeyboard} actionContent={<EyeIcon open={showPassword} />} onActionPress={() => setShowPassword((current) => !current)} /> : null}
                        {loginStep === 'password' ? <Button label={loading ? 'Opening...' : 'Continue'} onPress={submitAuth} disabled={!canContinue || loading} /> : null}
                      </>
                    )}
                  </View>
                ) : (
                  <View style={s.form}>
                    {role === 'dealer' ? (
                      <>
                        {dealerSignupContent ? (
                          <View style={s.formIntroCard}>
                            <View style={s.formStepChip}>
                              <Text style={s.formStepChipText}>{dealerSignupContent.stepLabel}</Text>
                            </View>
                            <Text style={s.formStepTitle}>{dealerSignupContent.title}</Text>
                            <Text style={s.formStepText}>{dealerSignupContent.description}</Text>
                          </View>
                        ) : null}

                        {signupStep === 'name' ? (
                          <>
                            <Field label="Full Name" value={signupName} onChangeText={setSignupName} placeholder="Enter owner or business name" error={errors.signupName} onFocus={scrollToForm} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => scrollToForm()} />
                            <Field label="Email Address" value={signupEmail} onChangeText={handleSignupEmail} placeholder="name@business.com" error={errors.signupEmail} onFocus={scrollToForm} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => scrollToForm()} />
                            <Field label="Business Address" value={signupAddress} onChangeText={(value) => { setSignupAddress(value); setLocationMessage(''); setError('signupAddress'); }} placeholder={locationLoading ? 'Fetching current address...' : 'Enter complete business address'} error={errors.signupAddress} onFocus={scrollToForm} inputRef={signupAddressRef} onPressIn={() => { if (!locationLoading && !signupAddress.trim()) { void useCurrentLocation(); } }} onSubmitEditing={continueSignup} actionLabel={locationLoading ? 'Locating' : 'Current Address'} onActionPress={() => void useCurrentLocation()} actionDisabled={locationLoading} />
                            {locationMessage ? <Info text={locationMessage} kind="success" /> : null}
                            <Button label={dealerSignupContent?.buttonLabel ?? 'Continue'} onPress={continueSignup} disabled={signupName.trim().length < 3 || !isValidEmail(signupEmail) || signupAddress.trim().length < 5} secondary />
                          </>
                        ) : null}

                        {signupStep === 'location' ? (
                          <>
                            <Field label="State" value={signupState} onChangeText={setSignupState} placeholder="State" error={errors.signupState} onFocus={scrollToForm} inputRef={signupStateRef} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => signupCityRef.current?.focus()} />
                            <Field label="City" value={signupCity} onChangeText={setSignupCity} placeholder="City" error={errors.signupCity} onFocus={scrollToForm} inputRef={signupCityRef} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => signupPincodeRef.current?.focus()} />
                            <Field label="Pincode" value={signupPincode} onChangeText={(value) => setSignupPincode(value.replace(/\D/g, '').slice(0, 6))} placeholder="Pincode" keyboardType="numeric" error={errors.signupPincode} onFocus={scrollToForm} inputRef={signupPincodeRef} onSubmitEditing={continueSignup} />
                            <Button label={dealerSignupContent?.buttonLabel ?? 'Continue'} onPress={continueSignup} disabled={signupState.trim().length < 2 || signupCity.trim().length < 2 || signupPincode.trim().length < 4} secondary />
                          </>
                        ) : null}

                        {signupStep === 'identity' ? (
                          <>
                            <Field label="GST / PAN Number" value={signupGstNumber} onChangeText={(value) => { setSignupGstNumber(value.toUpperCase()); setError('signupGstNumber'); }} placeholder="Enter GST or PAN number" error={errors.signupGstNumber} onFocus={scrollToForm} inputRef={signupGstNumberRef} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => signupGstHolderRef.current?.focus()} />
                            <Field label="GST / PAN Holder Name" value={signupGstHolderName} onChangeText={(value) => { setSignupGstHolderName(value); setError('signupGstHolderName'); }} placeholder="Enter holder name" error={errors.signupGstHolderName} onFocus={scrollToForm} inputRef={signupGstHolderRef} onSubmitEditing={continueSignup} />
                            <Button label={dealerSignupContent?.buttonLabel ?? 'Continue'} onPress={continueSignup} disabled={false} secondary />
                            <Pressable style={s.skipBtn} onPress={continueSignup}>
                              <Text style={s.skipBtnText}>Skip for Now</Text>
                            </Pressable>
                          </>
                        ) : null}

                        {signupStep === 'holders' ? (
                          <>
                            <Field label="Mobile Number" value={signupPhone} onChangeText={handleSignupPhone} placeholder="Enter mobile number" keyboardType="phone-pad" prefix="+91" error={errors.signupPhone} onFocus={scrollToForm} inputRef={signupPhoneRef} onSubmitEditing={sendSignupOtp} actionLabel={signupPhone.length > 0 && !signupOtpVerified ? (signupOtpSent ? 'Resend' : 'Verify') : undefined} onActionPress={sendSignupOtp} actionDisabled={signupPhone.length !== 10} />
                            {signupOtpSent && !signupOtpVerified ? <Info text={`OTP sent to +91 ${signupPhone}.`} kind="success" /> : null}
                            {signupOtpSent && !signupOtpVerified ? <Field label="OTP" value={signupOtp} onChangeText={handleOtp(setSignupOtp)} placeholder="Enter 4 digit OTP" keyboardType="numeric" error={errors.signupOtp} onFocus={scrollToForm} inputRef={signupOtpRef} onSubmitEditing={verifySignupOtp} actionLabel={signupOtp.length > 0 ? 'Verify' : undefined} onActionPress={verifySignupOtp} actionDisabled={signupOtp.length !== 4} /> : null}
                          </>
                        ) : null}

                        {signupStep === 'password' ? (
                          <>
                            {signupOtpVerified ? <Info text="Phone verification successful." kind="success" /> : null}
                            <Text style={s.helperText}>Password is optional. Leave both fields blank if you want to skip it.</Text>
                            <Field label="Password (Optional)" value={signupPass} onChangeText={setSignupPass} placeholder="Create password if you want" secureTextEntry={!showPassword} error={errors.signupPass} onFocus={scrollToForm} inputRef={signupPassRef} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => signupConfirmPassRef.current?.focus()} actionContent={<EyeIcon open={showPassword} />} onActionPress={() => setShowPassword((current) => !current)} />
                            <Field label="Confirm Password (Optional)" value={signupConfirmPass} onChangeText={setSignupConfirmPass} placeholder="Re-enter password" secureTextEntry={!showPassword} error={errors.signupConfirmPass} onFocus={scrollToForm} inputRef={signupConfirmPassRef} actionContent={<EyeIcon open={showPassword} />} onActionPress={() => setShowPassword((current) => !current)} />
                            <Text style={s.helperText}>By creating an account, you agree to the Terms & Conditions and Privacy Policy.</Text>
                            <Button label={loading ? 'Creating Account...' : dealerSignupContent?.buttonLabel ?? 'Create Account'} onPress={submitAuth} disabled={!canContinue || loading} />
                          </>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Field label="Full Name" value={signupName} onChangeText={setSignupName} placeholder="Enter your full name" error={errors.signupName} onFocus={scrollToForm} onSubmitEditing={continueSignup} />
                        {signupStep === 'name' ? <Button label="Continue" onPress={continueSignup} disabled={signupName.trim().length < 3} secondary /> : null}

                        {signupStep !== 'name' ? <Field label="Dealer Verification Number" value={signupDealerPhone} onChangeText={(value) => { handlePhone(setSignupDealerPhone)(value); setDealerVerified(false); setVerifiedDealerName(''); setError('signupDealerPhone'); }} placeholder="Enter dealer mobile number" keyboardType="phone-pad" error={errors.signupDealerPhone} onFocus={scrollToForm} inputRef={signupDealerRef} onSubmitEditing={verifyDealer} /> : null}
                        {signupStep === 'dealer' ? <Button label="Verify" onPress={verifyDealer} disabled={signupDealerPhone.length !== 10} secondary /> : null}
                        {dealerVerified ? <Info text={`${verifiedDealerName} verification successfully done.`} kind="success" /> : null}
                        {dealerVerified && signupStep === 'dealer' ? <Button label="Continue" onPress={continueSignup} disabled={!dealerVerified} secondary /> : null}

                        {['address', 'phone', 'otp', 'password'].includes(signupStep) ? <Field label="Address" value={signupAddress} onChangeText={(value) => { setSignupAddress(value); setLocationMessage(''); setError('signupAddress'); }} placeholder={locationLoading ? 'Fetching current address...' : 'Enter your complete address'} error={errors.signupAddress} onFocus={scrollToForm} inputRef={signupAddressRef} onPressIn={() => { if (!locationLoading && !signupAddress.trim()) { void useCurrentLocation(); } }} onSubmitEditing={signupStep === 'address' ? continueSignup : undefined} actionLabel={locationLoading ? 'Locating' : 'Current Address'} onActionPress={() => void useCurrentLocation()} actionDisabled={locationLoading} /> : null}
                        {signupStep === 'address' && locationMessage ? <Info text={locationMessage} kind="success" /> : null}
                        {['address', 'phone', 'otp', 'password'].includes(signupStep) && (signupState || signupCity || signupPincode) ? (
                          <View style={s.locationSummaryCard}>
                            <Text style={s.locationSummaryTitle}>Detected Location Details</Text>
                            {signupState ? (
                              <View style={s.locationRow}>
                                <Text style={s.locationKey}>State</Text>
                                <Text style={s.locationValue}>{signupState}</Text>
                              </View>
                            ) : null}
                            {signupCity ? (
                              <View style={s.locationRow}>
                                <Text style={s.locationKey}>City</Text>
                                <Text style={s.locationValue}>{signupCity}</Text>
                              </View>
                            ) : null}
                            {signupPincode ? (
                              <View style={s.locationRow}>
                                <Text style={s.locationKey}>Pincode</Text>
                                <Text style={s.locationValue}>{signupPincode}</Text>
                              </View>
                            ) : null}
                          </View>
                        ) : null}
                        {signupStep === 'address' ? <Button label="Continue" onPress={continueSignup} disabled={signupAddress.trim().length < 5 || locationLoading} secondary /> : null}

                        {['phone', 'otp', 'password'].includes(signupStep) ? <Field label="Your Phone Number" value={signupPhone} onChangeText={handleSignupPhone} placeholder="Enter your phone number" keyboardType="phone-pad" prefix="+91" error={errors.signupPhone} onFocus={scrollToForm} inputRef={signupPhoneRef} onSubmitEditing={sendSignupOtp} actionLabel={signupPhone.length > 0 && !signupOtpVerified ? (signupOtpSent ? 'Resend' : 'Verify') : undefined} onActionPress={sendSignupOtp} actionDisabled={signupPhone.length !== 10} /> : null}
                        {signupOtpSent && !signupOtpVerified ? <Info text={`OTP sent to +91 ${signupPhone}.`} kind="success" /> : null}
                        {['otp', 'password'].includes(signupStep) ? <Field label="OTP" value={signupOtp} onChangeText={handleOtp(setSignupOtp)} placeholder="Enter 4 digit OTP" keyboardType="numeric" error={errors.signupOtp} onFocus={scrollToForm} inputRef={signupOtpRef} onSubmitEditing={verifySignupOtp} /> : null}
                        {signupStep === 'otp' ? <Button label="Verify OTP" onPress={continueSignup} disabled={signupOtp.length !== 4} secondary /> : null}
                        {signupStep === 'password' ? <Info text="OTP verification successful." kind="success" /> : null}
                        {signupStep === 'password' ? <Text style={s.helperText}>Password is optional. Leave both fields blank if you want to skip it.</Text> : null}
                        {signupStep === 'password' ? <Field label="Password (Optional)" value={signupPass} onChangeText={setSignupPass} placeholder="Create password if you want" secureTextEntry={!showPassword} error={errors.signupPass} onFocus={scrollToForm} inputRef={signupPassRef} returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => signupConfirmPassRef.current?.focus()} actionContent={<EyeIcon open={showPassword} />} onActionPress={() => setShowPassword((current) => !current)} /> : null}
                        {signupStep === 'password' ? <Field label="Confirm Password (Optional)" value={signupConfirmPass} onChangeText={setSignupConfirmPass} placeholder="Re-enter password" secureTextEntry={!showPassword} error={errors.signupConfirmPass} onFocus={scrollToForm} inputRef={signupConfirmPassRef} actionContent={<EyeIcon open={showPassword} />} onActionPress={() => setShowPassword((current) => !current)} /> : null}
                        {signupStep === 'password' ? <Button label={loading ? 'Opening...' : 'Continue'} onPress={submitAuth} disabled={!canContinue || loading} /> : null}
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  bg: { flex: 1, overflow: 'hidden' },
  glow1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(59,130,246,0.18)', top: -60, right: -35 },
  glow2: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(236,72,153,0.14)', bottom: 120, left: -28 },
  glow3: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(34,197,94,0.1)', top: 90, left: '34%' },
  content: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 22, paddingBottom: 24 },
  contentRole: { flexGrow: 1 },
  revealRole: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative', minHeight: 100 },
  brandBlock: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  logoWrap: { width: 182, height: 102, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '100%', height: '100%' },
  back: { position: 'absolute', right: 0, top: 30, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.2)', alignItems: 'center', justifyContent: 'center' },
  welcomeBadge: { alignSelf: 'flex-start', marginBottom: 8, marginTop: 0 },
  welcomeBadgeFill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(14,165,233,0.12)' },
  eyebrow: { color: C.muted2, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2 },
  bigTitle: { fontSize: 32, fontWeight: '900', marginBottom: 8, letterSpacing: -0.4 },
  bigTitleElectrician: { color: 'rgba(21,154,111,0.84)' },
  bigTitleDealer: { color: 'rgba(44,107,231,0.84)' },
  subtext: { color: C.muted, fontSize: 13.5, lineHeight: 20, marginBottom: 16, maxWidth: '96%' },
  card: { backgroundColor: C.white, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: C.line, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 6 },
  roleSetupCard: { marginTop: 6, flex: 1, justifyContent: 'space-between', paddingTop: 16, paddingBottom: 14 },
  sectionEyebrow: { color: '#7D8AA5', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 5 },
  sectionTitle: { color: C.title, fontSize: 13, fontWeight: '900', marginBottom: 6 },
  sectionText: { color: C.muted, fontSize: 12.5, lineHeight: 18 },
  roleGrid: { flexDirection: 'row', gap: 12, marginTop: 14, marginBottom: 14 },
  roleCard: { flex: 1, borderRadius: 22, padding: 12, borderWidth: 1.5, borderColor: '#243554' },
  roleCardElectrician: { backgroundColor: '#F1FBF7', borderColor: '#B9E7D4' },
  roleCardDealer: { backgroundColor: '#F2F7FF', borderColor: '#BED4F7' },
  roleCardElectricianActive: { borderColor: '#63D79C', backgroundColor: '#CFF3DE', shadowColor: '#63D79C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 4 },
  roleCardDealerActive: { borderColor: '#69B8FF', backgroundColor: '#D8EBFF', shadowColor: '#4D9FFF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 4 },
  roleFrame: { height: 112, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden', padding: 6 },
  roleImage: { width: '100%', height: '100%' },
  roleFrameText: { color: '#D3DFF5', fontSize: 12, fontWeight: '700' },
  roleTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  roleTitleDefault: { color: C.text },
  roleTitleActive: { color: C.text },
  roleSubtitle: { fontSize: 12, lineHeight: 18 },
  roleSubtitleDefault: { color: C.muted2 },
  roleSubtitleActive: { color: C.muted2 },
  tabs: { flexDirection: 'row', backgroundColor: '#F1F6FD', borderRadius: 18, padding: 4, marginTop: 18, marginBottom: 18 },
  tab: { flex: 1, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  tabElectricianActive: { backgroundColor: '#CFF3DE', borderWidth: 1, borderColor: '#63D79C', shadowColor: '#63D79C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 2 },
  tabDealerActive: { backgroundColor: '#D8EBFF', borderWidth: 1, borderColor: '#69B8FF', shadowColor: '#4D9FFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 2 },
  tabText: { color: C.muted, fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: C.text },
  loginChoiceRow: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 2 },
  loginChoiceCard: { flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 1.2, borderColor: C.fieldLine, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  loginChoiceCardActive: { borderColor: C.accentA, backgroundColor: '#EEF7FF' },
  loginChoiceText: { color: C.text, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  loginChoiceTextActive: { color: C.accentA },
  form: { gap: 12 },
  formIntroCard: { borderRadius: 20, padding: 14, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: '#D8E7FB', gap: 6 },
  formStepChip: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#E3EEFF' },
  formStepChipText: { color: '#2C6BE7', fontSize: 11, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  formStepTitle: { color: C.title, fontSize: 16, fontWeight: '900' },
  formStepText: { color: C.muted, fontSize: 12.5, lineHeight: 18 },
  group: { gap: 6 },
  helperText: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: -2, marginBottom: 2 },
  label: { color: C.muted2, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  skipBtn: { height: 46, borderRadius: 14, borderWidth: 1.2, borderColor: '#D8E2F0', backgroundColor: '#F8FBFF', alignItems: 'center', justifyContent: 'center' },
  skipBtnText: { color: C.accentA, fontSize: 13, fontWeight: '800' },
  locationSummaryCard: { borderRadius: 16, borderWidth: 1, borderColor: '#D7E4F4', backgroundColor: '#F7FAFF', padding: 12, gap: 8 },
  locationSummaryTitle: { color: C.title, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  locationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  locationKey: { flex: 1, color: C.muted2, fontSize: 12, fontWeight: '700' },
  locationValue: { flex: 1, color: C.text, fontSize: 12.5, fontWeight: '800', textAlign: 'right' },
  shell: { height: 52, borderRadius: 16, borderWidth: 1.2, borderColor: C.fieldLine, backgroundColor: C.field, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  shellError: { borderColor: C.error, backgroundColor: C.errorSoft },
  prefixWrap: { height: '100%', justifyContent: 'center', paddingHorizontal: 12, borderRightWidth: 1, borderRightColor: '#DFE7F1' },
  prefix: { color: C.text, fontSize: 14, fontWeight: '700' },
  input: { flex: 1, height: '100%', paddingHorizontal: 14, color: C.text, fontSize: 15, fontWeight: '600' },
  fieldAction: { alignSelf: 'center', marginRight: 8, paddingHorizontal: 10, minWidth: 74, height: 36, borderRadius: 12, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' },
  fieldActionWide: { minWidth: 112 },
  fieldActionIcon: { minWidth: 42, width: 42, paddingHorizontal: 0 },
  fieldActionDisabled: { backgroundColor: '#E3E9F2' },
  fieldActionText: { color: C.accentA, fontSize: 12, fontWeight: '800' },
  fieldActionTextDisabled: { color: '#97A6BE' },
  btnOuter: { marginTop: 2 },
  btn: { minHeight: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, shadowColor: '#F97316', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 4 },
  btnSecondary: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', shadowColor: '#0EA5E9', shadowOpacity: 0.14, backgroundColor: '#FFFFFF' },
  btnText: { color: C.white, fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },
  btnTextSecondary: { color: C.white },
  info: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  infoError: { backgroundColor: C.errorSoft },
  infoSuccess: { backgroundColor: C.successSoft },
  infoText: { fontSize: 12, lineHeight: 18, fontWeight: '700' },
  infoErrorText: { color: C.error },
  infoSuccessText: { color: C.success },
  checkboxCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 18, borderWidth: 1, borderColor: '#DCE6F3', backgroundColor: '#F9FBFE', padding: 14 },
  checkboxCardTextWrap: { flex: 1, gap: 4 },
  checkboxCardTitle: { color: C.text, fontSize: 13, fontWeight: '800' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.4, borderColor: C.fieldLine, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
  check: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  checkboxText: { flex: 1, color: C.text, fontSize: 12, lineHeight: 19, fontWeight: '500' },
});
