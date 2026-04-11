import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, PrimaryBtn, usePreferenceContext } from './ProfileShared';

const bankOptions = ['State Bank of India', 'Punjab National Bank', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'Kotak Mahindra Bank', 'IDFC FIRST Bank'];

export function BankDetailsPage({ onBack }: { onBack: () => void }) {
  const { t, tx, theme } = usePreferenceContext();
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upi, setUpi] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankOptions, setShowBankOptions] = useState(false);
  const [upiError, setUpiError] = useState('');
  const [fieldPositions, setFieldPositions] = useState<Record<string, number>>({});
  const [scrollRef, setScrollRef] = useState<ScrollView | null>(null);

  const isValidUpi = (value: string) => /^[A-Za-z0-9._-]{2,}@[A-Za-z0-9.-]{2,}$/.test(value.trim());

  const scrollToField = (fieldKey: string) => {
    const y = fieldPositions[fieldKey];
    if (scrollRef && typeof y === 'number') {
      scrollRef.scrollTo({ y: Math.max(0, y - 120), animated: true });
    }
  };

  const saveFieldPosition = (fieldKey: string, y: number) => {
    setFieldPositions((current) => ({ ...current, [fieldKey]: y }));
  };

  const handleSave = () => {
    if (!accountHolderName.trim() || !accountNumber.trim() || !ifsc.trim() || !selectedBank.trim() || !upi.trim()) {
      return Alert.alert(tx('Required fields'), tx('Please fill all required fields.'));
    }
    if (!/^[A-Za-z ]+$/.test(accountHolderName.trim())) {
      return Alert.alert(tx('Invalid account holder name'), tx('Account holder name should contain only letters and spaces.'));
    }
    if (!/^\d+$/.test(accountNumber.trim())) {
      return Alert.alert(tx('Invalid account number'), tx('Account number should contain only numbers.'));
    }
    if (!isValidUpi(upi.trim())) {
      setUpiError(tx('Please enter a valid UPI ID in the format name@bank.'));
      return Alert.alert(tx('Invalid UPI ID'), tx('Please enter a valid UPI ID in the format name@bank.'));
    }
    setUpiError('');
    Alert.alert(tx('Saved'), tx('Bank details saved successfully!'));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <PageHeader title={t('bankDetails')} onBack={onBack} />
      <ScrollView
        ref={setScrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.assetPoster}>
            <View style={styles.posterGlow} />
            <View style={styles.posterTopRow}>
              <View style={styles.posterBadge}>
                <AppIcon name="bank" size={22} color={C.gold} />
              </View>
              <View>
                <Text style={styles.posterEyebrow}>{tx('BANK TRANSFER')}</Text>
                <Text style={styles.posterHeading}>{tx('Secure payouts to your bank')}</Text>
              </View>
            </View>
            <View style={styles.posterBankWrap}>
              <View style={styles.posterBankRoof} />
              <View style={styles.posterColumnsRow}>
                <View style={styles.posterColumn} />
                <View style={styles.posterColumn} />
                <View style={styles.posterColumn} />
              </View>
              <View style={styles.posterBankBase} />
            </View>
          </View>

          <View style={styles.headerRow}>
            <View style={styles.iconWrap}>
              <AppIcon name="bank" size={24} color={C.gold} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{t('bankDetails')}</Text>
              <Text style={[styles.sub, { color: theme.textMuted }]}>{tx('Add your bank account and UPI ID for smooth payouts')}</Text>
            </View>
          </View>

          <View onLayout={({ nativeEvent }) => saveFieldPosition('accountHolderName', nativeEvent.layout.y)}>
            <Text style={[styles.label, { color: theme.textMuted }]}>{tx('Account Holder Name')} *</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}>
              <AppIcon name="bank" size={18} color={C.gold} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder={tx('Enter Account Holder Name')}
                placeholderTextColor={theme.textMuted}
                value={accountHolderName}
                onChangeText={(value) => setAccountHolderName(value.replace(/[^A-Za-z ]/g, ''))}
                onFocus={() => scrollToField('accountHolderName')}
              />
            </View>
          </View>
          <View onLayout={({ nativeEvent }) => saveFieldPosition('accountNumber', nativeEvent.layout.y)}>
            <Text style={[styles.label, { color: theme.textMuted }]}>{tx('Account Number')} *</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}>
              <AppIcon name="bank" size={18} color={C.gold} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder={tx('Enter Account Number')}
                placeholderTextColor={theme.textMuted}
                value={accountNumber}
                onChangeText={(value) => setAccountNumber(value.replace(/\D/g, ''))}
                keyboardType="number-pad"
                onFocus={() => scrollToField('accountNumber')}
              />
            </View>
          </View>
          <View onLayout={({ nativeEvent }) => saveFieldPosition('ifsc', nativeEvent.layout.y)}>
            <Text style={[styles.label, { color: theme.textMuted }]}>{tx('IFSC Code')} *</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}>
              <AppIcon name="bank" size={18} color={C.gold} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder={tx('Enter IFSC Code')}
                placeholderTextColor={theme.textMuted}
                value={ifsc}
                onChangeText={(value) => setIfsc(value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                autoCapitalize="characters"
                onFocus={() => scrollToField('ifsc')}
                maxLength={11}
              />
            </View>
          </View>
          <View onLayout={({ nativeEvent }) => saveFieldPosition('selectBank', nativeEvent.layout.y)}>
            <Text style={[styles.label, { color: theme.textMuted }]}>{tx('Select Bank')} *</Text>
            <TouchableOpacity
              style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={() => {
                setShowBankOptions((current) => !current);
                scrollToField('selectBank');
              }}
            >
              <AppIcon name="bank" size={18} color={C.gold} />
              <Text style={[styles.input, { color: selectedBank ? theme.textPrimary : theme.textMuted }]}>{selectedBank || tx('Select Bank')}</Text>
            </TouchableOpacity>
            {showBankOptions ? (
              <View style={[styles.bankOptionsWrap, { borderColor: theme.border }]}>
                {bankOptions.map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    style={[styles.bankOption, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedBank(bank);
                      setShowBankOptions(false);
                    }}
                  >
                    <Text style={[styles.bankOptionText, { color: theme.textPrimary }]}>{bank}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
          <View onLayout={({ nativeEvent }) => saveFieldPosition('upi', nativeEvent.layout.y)}>
            <Text style={[styles.label, { color: theme.textMuted }]}>{tx('UPI ID')} *</Text>
            <View
              style={[
                styles.inputWrap,
                { backgroundColor: theme.soft, borderColor: theme.border },
                upiError ? styles.inputWrapError : null,
              ]}
            >
              <AppIcon name="link" size={18} color={C.gold} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder={tx('Enter UPI ID')}
                placeholderTextColor={theme.textMuted}
                value={upi}
                onChangeText={(value) => {
                  const nextValue = value.replace(/\s/g, '');
                  setUpi(nextValue);
                  if (upiError) {
                    setUpiError(nextValue && !isValidUpi(nextValue) ? tx('Please enter a valid UPI ID in the format name@bank.') : '');
                  }
                }}
                autoCapitalize="none"
                onFocus={() => scrollToField('upi')}
              />
            </View>
            {upiError ? <Text style={styles.errorText}>{upiError}</Text> : null}
          </View>
        </View>
        <PrimaryBtn label={t('save')} onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 16, paddingBottom: 32 },
  card: { borderRadius: 28, padding: 20, borderWidth: 1, gap: 14 },
  assetPoster: { width: '100%', height: 132, borderRadius: 24, backgroundColor: '#FFF7E8', overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'space-between', borderWidth: 1, borderColor: '#F4DFC0' },
  posterGlow: { position: 'absolute', right: -18, top: -18, width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFE5AB' },
  posterTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  posterBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF1CC', alignItems: 'center', justifyContent: 'center' },
  posterEyebrow: { fontSize: 11, fontWeight: '800', color: '#B07A12', letterSpacing: 1 },
  posterHeading: { fontSize: 18, fontWeight: '900', color: '#6A4800', maxWidth: 170, lineHeight: 22 },
  posterBankWrap: { alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'flex-end' },
  posterBankRoof: { width: 86, height: 0, borderLeftWidth: 43, borderRightWidth: 43, borderBottomWidth: 24, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#D89A1A' },
  posterColumnsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: '#FFE8B8', paddingHorizontal: 10, paddingTop: 8 },
  posterColumn: { width: 12, height: 28, borderRadius: 4, backgroundColor: '#C88807' },
  posterBankBase: { width: 106, height: 10, borderRadius: 4, backgroundColor: '#B87900' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  headerCopy: { flex: 1, minWidth: 0 },
  iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '900' },
  sub: { fontSize: 11, marginTop: 2, lineHeight: 16, flexShrink: 1 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 54, borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 14, gap: 8 },
  inputWrapError: { borderColor: '#B42318', backgroundColor: '#FFF4F2' },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
  errorText: { marginTop: 7, fontSize: 12, fontWeight: '700', color: '#B42318', lineHeight: 18 },
  bankOptionsWrap: { marginTop: 8, borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  bankOption: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  bankOptionText: { fontSize: 14, fontWeight: '600' },
});
