import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

type PasswordMode = 'set' | 'change';

type PasswordSettingsPageProps = {
  hasPasswordConfigured: boolean;
  storedPassword: string;
  onBack: () => void;
  onPasswordConfiguredChange: (configured: boolean) => void;
  onPasswordChange: (password: string) => void;
};

type PasswordErrors = {
  setPassword?: string;
  confirmSetPassword?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export function PasswordSettingsPage({
  hasPasswordConfigured,
  storedPassword,
  onBack,
  onPasswordConfiguredChange,
  onPasswordChange,
}: PasswordSettingsPageProps) {
  const { theme } = usePreferenceContext();
  const [mode, setMode] = useState<PasswordMode>(hasPasswordConfigured ? 'change' : 'set');
  const [setPassword, setSetPassword] = useState('');
  const [confirmSetPassword, setConfirmSetPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [showConfirmSetPassword, setShowConfirmSetPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const setPasswordRef = useRef<TextInput | null>(null);
  const confirmSetPasswordRef = useRef<TextInput | null>(null);
  const currentPasswordRef = useRef<TextInput | null>(null);
  const newPasswordRef = useRef<TextInput | null>(null);
  const confirmNewPasswordRef = useRef<TextInput | null>(null);
  const isSetDisabled = hasPasswordConfigured && mode === 'set';
  const isChangeDisabled = !hasPasswordConfigured && mode === 'change';

  useEffect(() => {
    setMode(hasPasswordConfigured ? 'change' : 'set');
    setSetPassword('');
    setConfirmSetPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrors({});
    setSuccessMessage('');
  }, [hasPasswordConfigured, storedPassword]);

  const clearFieldError = (field: keyof PasswordErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const selectMode = (nextMode: PasswordMode) => {
    Keyboard.dismiss();
    setMode(nextMode);
    setErrors({});
    setSuccessMessage('');
  };

  const handleSave = () => {
    Keyboard.dismiss();
    const nextErrors: PasswordErrors = {};

    if (mode === 'set') {
      if (hasPasswordConfigured) {
        setSuccessMessage('');
        return;
      }

      if (setPassword.trim().length < 6) {
        nextErrors.setPassword = 'Please enter a password with at least 6 characters.';
      }

      if (confirmSetPassword.trim().length === 0) {
        nextErrors.confirmSetPassword = 'Please confirm your password to continue.';
      } else if (confirmSetPassword !== setPassword) {
        nextErrors.confirmSetPassword = 'Passwords do not match. Please enter the same password again.';
      }

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        setSuccessMessage('');
        return;
      }

      onPasswordChange(setPassword.trim());
      onPasswordConfiguredChange(true);
      setSuccessMessage('Password saved successfully.');
      setSetPassword('');
      setConfirmSetPassword('');
      return;
    }

    if (!hasPasswordConfigured) {
      nextErrors.currentPassword = 'Set a password first before trying to change it.';
    } else if (currentPassword.trim().length === 0) {
      nextErrors.currentPassword = 'Please enter your current password.';
    } else if (storedPassword && currentPassword !== storedPassword) {
      nextErrors.currentPassword = 'The current password you entered is incorrect.';
    }

    if (newPassword.trim().length < 6) {
      nextErrors.newPassword = 'Please enter a new password with at least 6 characters.';
    } else if (storedPassword && newPassword === storedPassword) {
      nextErrors.newPassword = 'Please choose a new password that is different from the current password.';
    }

    if (confirmNewPassword.trim().length === 0) {
      nextErrors.confirmNewPassword = 'Please confirm your new password to continue.';
    } else if (confirmNewPassword !== newPassword) {
      nextErrors.confirmNewPassword = 'Passwords do not match. Please enter the same password again.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage('');
      return;
    }

    onPasswordChange(newPassword.trim());
    onPasswordConfiguredChange(true);
    setSuccessMessage('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const PasswordField = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    onToggle,
    error,
    placeholder,
    inputRef,
    returnKeyType,
    onSubmitEditing,
  }: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    secureTextEntry: boolean;
    onToggle: () => void;
    error?: string;
    placeholder: string;
    inputRef?: React.RefObject<TextInput | null>;
    returnKeyType?: 'done' | 'next';
    onSubmitEditing?: () => void;
  }) => (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.inputWrap, { borderColor: error ? C.primary : theme.border, backgroundColor: theme.soft }]}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(nextValue) => {
            onChangeText(nextValue);
            setSuccessMessage('');
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          submitBehavior="submit"
          returnKeyType={returnKeyType}
          blurOnSubmit={returnKeyType !== 'next'}
          onSubmitEditing={onSubmitEditing}
          style={[styles.input, { color: theme.textPrimary }]}
        />
        <TouchableOpacity onPress={onToggle} style={styles.eyeBtn} activeOpacity={0.8}>
          <AppIcon name={secureTextEntry ? 'eye' : 'eyeOff'} size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PageHeader title="Password" onBack={onBack} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
        >
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.heroIconWrap}>
              <AppIcon name="lock" size={22} color={C.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Manage your password</Text>
              <Text style={[styles.heroSub, { color: theme.textMuted }]}>
                Set a password if you skipped it earlier, or change it anytime from here.
              </Text>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.surface, borderColor: mode === 'set' ? C.blue : theme.border },
                mode === 'set' ? styles.optionCardActive : null,
              ]}
              onPress={() => selectMode('set')}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconWrap, { backgroundColor: C.blueLight }]}>
                <AppIcon name="lock" size={18} color={C.blue} />
              </View>
              <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>Set Password</Text>
              <Text style={[styles.optionSub, { color: theme.textMuted }]}>Create a password for future login access.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.surface, borderColor: mode === 'change' ? C.primary : theme.border },
                mode === 'change' ? styles.optionCardActive : null,
              ]}
              onPress={() => selectMode('change')}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconWrap, { backgroundColor: C.primaryLight }]}>
                <AppIcon name="edit" size={18} color={C.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>Change Password</Text>
              <Text style={[styles.optionSub, { color: theme.textMuted }]}>Update your current password whenever needed.</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{mode === 'set' ? 'Set Password' : 'Change Password'}</Text>
            <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
              {mode === 'set'
                ? hasPasswordConfigured
                  ? 'A password is already active for this account. Use Change Password to update it.'
                  : 'Use at least 6 characters so your account stays secure.'
                : hasPasswordConfigured
                  ? 'Enter your current password and then create a new one.'
                  : 'You can change a password after you create one from the Set Password option.'}
            </Text>

            {mode === 'set' ? (
              <>
                <PasswordField
                  label="Password"
                  value={setPassword}
                  onChangeText={(value) => {
                    setSetPassword(value);
                    clearFieldError('setPassword');
                  }}
                  secureTextEntry={!showSetPassword}
                  onToggle={() => setShowSetPassword((current) => !current)}
                  error={errors.setPassword}
                  placeholder="Enter at least 6 characters"
                  inputRef={setPasswordRef}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmSetPasswordRef.current?.focus()}
                />
                <PasswordField
                  label="Confirm Password"
                  value={confirmSetPassword}
                  onChangeText={(value) => {
                    setConfirmSetPassword(value);
                    clearFieldError('confirmSetPassword');
                  }}
                  secureTextEntry={!showConfirmSetPassword}
                  onToggle={() => setShowConfirmSetPassword((current) => !current)}
                  error={errors.confirmSetPassword}
                  placeholder="Re-enter the same password"
                  inputRef={confirmSetPasswordRef}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </>
            ) : (
              <>
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={(value) => {
                    setCurrentPassword(value);
                    clearFieldError('currentPassword');
                  }}
                  secureTextEntry={!showCurrentPassword}
                  onToggle={() => setShowCurrentPassword((current) => !current)}
                  error={errors.currentPassword}
                  placeholder="Enter current password"
                  inputRef={currentPasswordRef}
                  returnKeyType="next"
                  onSubmitEditing={() => newPasswordRef.current?.focus()}
                />

                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);
                    clearFieldError('newPassword');
                  }}
                  secureTextEntry={!showNewPassword}
                  onToggle={() => setShowNewPassword((current) => !current)}
                  error={errors.newPassword}
                  placeholder="Enter a new password"
                  inputRef={newPasswordRef}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmNewPasswordRef.current?.focus()}
                />
                <PasswordField
                  label="Confirm New Password"
                  value={confirmNewPassword}
                  onChangeText={(value) => {
                    setConfirmNewPassword(value);
                    clearFieldError('confirmNewPassword');
                  }}
                  secureTextEntry={!showConfirmNewPassword}
                  onToggle={() => setShowConfirmNewPassword((current) => !current)}
                  error={errors.confirmNewPassword}
                  placeholder="Re-enter the new password"
                  inputRef={confirmNewPasswordRef}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </>
            )}

            {successMessage ? (
              <View style={styles.successCard}>
                <AppIcon name="check" size={16} color={C.success} />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryBtn, isSetDisabled || isChangeDisabled ? styles.primaryBtnDisabled : null]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={isSetDisabled || isChangeDisabled}
            >
              <Text style={styles.primaryBtnText}>{mode === 'set' ? 'Save Password' : 'Update Password'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 14, paddingBottom: 32 },
  heroCard: { flexDirection: 'row', gap: 14, borderRadius: 24, borderWidth: 1, padding: 18, alignItems: 'center' },
  heroIconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 17, fontWeight: '800' },
  heroSub: { fontSize: 13, lineHeight: 19, marginTop: 3 },
  optionsRow: { flexDirection: 'row', gap: 12 },
  optionCard: { flex: 1, borderRadius: 22, borderWidth: 1.5, padding: 16 },
  optionCardActive: { shadowColor: '#0F1120', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 8 }, shadowRadius: 18, elevation: 2 },
  optionIconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  optionTitle: { fontSize: 14, fontWeight: '800' },
  optionSub: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  card: { borderRadius: 24, borderWidth: 1, padding: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  sectionSub: { fontSize: 12, lineHeight: 18, marginTop: 4, marginBottom: 18 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  inputWrap: { minHeight: 54, borderRadius: 16, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 14, fontWeight: '500', paddingVertical: 14 },
  eyeBtn: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: C.primary, fontSize: 12, lineHeight: 17, marginTop: 6, fontWeight: '600' },
  successCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.successLight, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  successText: { color: C.success, fontSize: 13, fontWeight: '700', flex: 1 },
  primaryBtn: { height: 56, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
