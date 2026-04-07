import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, PrimaryBtn, usePreferenceContext } from './ProfileShared';

const bankOptions = ['State Bank of India', 'Punjab National Bank', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'Kotak Mahindra Bank', 'IDFC FIRST Bank'];

export function BankDetailsPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('bank');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upi, setUpi] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankOptions, setShowBankOptions] = useState(false);
  const [verifiedUpiName, setVerifiedUpiName] = useState('');
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

  const verifyUpi = () => {
    const trimmedUpi = upi.trim();
    if (!trimmedUpi) {
      setVerifiedUpiName('');
      setUpiError('Please enter a valid UPI ID in the format name@bank.');
      return;
    }
    if (!isValidUpi(trimmedUpi)) {
      setVerifiedUpiName('');
      setUpiError('Please enter a valid UPI ID in the format name@bank.');
      return;
    }
    setUpiError('');
    const namePart = trimmedUpi.split('@')[0].replace(/[^A-Za-z ]/g, ' ').trim();
    const fetchedName = namePart
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ') || 'Verified User';
    setVerifiedUpiName(fetchedName);
  };

  const saveFieldPosition = (fieldKey: string, y: number) => {
    setFieldPositions((current) => ({ ...current, [fieldKey]: y }));
  };

  const handleSave = () => {
    if (!accountHolderName.trim() || !accountNumber.trim() || !ifsc.trim() || !selectedBank.trim()) {
      return Alert.alert('Required fields', 'Please fill all required fields.');
    }
    if (!/^[A-Za-z ]+$/.test(accountHolderName.trim())) {
      return Alert.alert('Invalid account holder name', 'Account holder name should contain only letters and spaces.');
    }
    if (!/^\d+$/.test(accountNumber.trim())) {
      return Alert.alert('Invalid account number', 'Account number should contain only numbers.');
    }
    Alert.alert('Saved', 'Bank details saved successfully!');
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
                <Text style={styles.posterEyebrow}>BANK TRANSFER</Text>
                <Text style={styles.posterHeading}>Secure payouts to your bank</Text>
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
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>UPI / Bank Transfer</Text>
              <Text style={[styles.sub, { color: theme.textMuted }]}>Add your UPI ID for instant payouts</Text>
            </View>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, { backgroundColor: activeTab === 'upi' ? C.primaryLight : theme.soft, borderColor: activeTab === 'upi' ? C.primary : theme.border }]}
              activeOpacity={0.85}
              onPress={() => setActiveTab('upi')}
            >
              <AppIcon name="link" size={16} color={activeTab === 'upi' ? C.primary : C.mid} />
              <Text style={[styles.tabText, activeTab === 'upi' && styles.tabTextActive]}>UPI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, { backgroundColor: activeTab === 'bank' ? C.primaryLight : theme.soft, borderColor: activeTab === 'bank' ? C.primary : theme.border }]}
              activeOpacity={0.85}
              onPress={() => setActiveTab('bank')}
            >
              <AppIcon name="bank" size={16} color={activeTab === 'bank' ? C.primary : C.mid} />
              <Text style={[styles.tabText, activeTab === 'bank' && styles.tabTextActive]}>Bank Details</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'upi' ? (
            <>
              <View onLayout={({ nativeEvent }) => saveFieldPosition('upi', nativeEvent.layout.y)}>
                <Text style={[styles.label, { color: theme.textMuted }]}>UPI ID *</Text>
                <View
                  style={[
                    styles.inputWrap,
                    { backgroundColor: theme.soft, borderColor: theme.border },
                    upiError ? styles.inputWrapError : null,
                  ]}
                >
                  <AppIcon name="bank" size={18} color={C.gold} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Enter Your UPI ID"
                    placeholderTextColor={theme.textMuted}
                    value={upi}
                    onChangeText={(value) => {
                      const nextValue = value.replace(/\s/g, '');
                      setUpi(nextValue);
                      setVerifiedUpiName('');
                      if (upiError) {
                        setUpiError(nextValue && !isValidUpi(nextValue) ? 'Please enter a valid UPI ID in the format name@bank.' : '');
                      }
                    }}
                    autoCapitalize="none"
                    onFocus={() => scrollToField('upi')}
                  />
                </View>
                {upiError ? <Text style={styles.errorText}>{upiError}</Text> : null}
              </View>
              <PrimaryBtn label="Verify" onPress={verifyUpi} />
              {verifiedUpiName ? (
                <View style={styles.verifiedCard}>
                  <Text style={styles.verifiedLabel}>Verified Name</Text>
                  <Text style={styles.verifiedValue}>{verifiedUpiName}</Text>
                </View>
              ) : null}
            </>
          ) : (
            <>
              <View onLayout={({ nativeEvent }) => saveFieldPosition('accountHolderName', nativeEvent.layout.y)}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Account Holder Name *</Text>
                <View style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}>
                  <AppIcon name="bank" size={18} color={C.gold} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Enter Account Holder Name"
                    placeholderTextColor={theme.textMuted}
                    value={accountHolderName}
                    onChangeText={(value) => setAccountHolderName(value.replace(/[^A-Za-z ]/g, ''))}
                    onFocus={() => scrollToField('accountHolderName')}
                  />
                </View>
              </View>
              <View onLayout={({ nativeEvent }) => saveFieldPosition('accountNumber', nativeEvent.layout.y)}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Account Number *</Text>
                <View style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}>
                  <AppIcon name="bank" size={18} color={C.gold} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Enter Account Number"
                    placeholderTextColor={theme.textMuted}
                    value={accountNumber}
                    onChangeText={(value) => setAccountNumber(value.replace(/\D/g, ''))}
                    keyboardType="number-pad"
                    onFocus={() => scrollToField('accountNumber')}
                  />
                </View>
              </View>
              <View onLayout={({ nativeEvent }) => saveFieldPosition('ifsc', nativeEvent.layout.y)}>
                <Text style={[styles.label, { color: theme.textMuted }]}>IFSC Code *</Text>
                <View style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}>
                  <AppIcon name="bank" size={18} color={C.gold} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Enter IFSC Code"
                    placeholderTextColor={theme.textMuted}
                    value={ifsc}
                    onChangeText={(value) => setIfsc(value.toUpperCase())}
                    autoCapitalize="characters"
                    onFocus={() => scrollToField('ifsc')}
                  />
                </View>
              </View>
              <View onLayout={({ nativeEvent }) => saveFieldPosition('selectBank', nativeEvent.layout.y)}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Select Bank *</Text>
                <TouchableOpacity
                  style={[styles.inputWrap, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setShowBankOptions((current) => !current);
                    scrollToField('selectBank');
                  }}
                >
                  <AppIcon name="bank" size={18} color={C.gold} />
                  <Text style={[styles.input, { color: selectedBank ? theme.textPrimary : theme.textMuted }]}>{selectedBank || 'Select Bank'}</Text>
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
            </>
          )}
        </View>
        {activeTab === 'bank' ? <PrimaryBtn label={t('save')} onPress={handleSave} /> : null}
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
  iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '900' },
  sub: { fontSize: 13, marginTop: 2 },
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  tabBtn: { flex: 1, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexDirection: 'row', gap: 8 },
  tabText: { fontSize: 14, fontWeight: '700', color: C.mid },
  tabTextActive: { color: C.primary },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 54, borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 14, gap: 8 },
  inputWrapError: { borderColor: '#B42318', backgroundColor: '#FFF4F2' },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
  errorText: { marginTop: 7, fontSize: 12, fontWeight: '700', color: '#B42318', lineHeight: 18 },
  bankOptionsWrap: { marginTop: 8, borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  bankOption: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  bankOptionText: { fontSize: 14, fontWeight: '600' },
  verifiedCard: { backgroundColor: C.goldLight, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F1C46A' },
  verifiedLabel: { fontSize: 12, fontWeight: '700', color: '#9A6700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  verifiedValue: { fontSize: 16, fontWeight: '800', color: C.dark },
});
