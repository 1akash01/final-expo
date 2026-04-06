import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, Screen, usePreferenceContext } from './ProfileShared';

const transferImage = require('./assets/transfer.png');

const knownUsers: Record<string, string> = {
  '6201920599': 'Sneha Jha',
  '9162038214': 'Harshvardhan',
  '9876543210': 'Dealer Partner',
};

export function TransferPointsPage({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: Screen) => void }) {
  const { t, theme } = usePreferenceContext();
  const [mobile, setMobile] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const handleSearch = () => {
    if (mobile.trim().length !== 10) {
      return Alert.alert('Invalid number', 'Please enter a valid 10-digit mobile number.');
    }
    const name = knownUsers[mobile] || 'User Found';
    setSearchResult(`${mobile} (${name})`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('transferPoint')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.posterCard, { backgroundColor: '#F4F8FF', borderColor: '#D8E5FF' }]}>
          <Image source={transferImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={[styles.searchCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Enter Mobile Number"
              placeholderTextColor={theme.textMuted}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
              <AppIcon name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {searchResult ? (
            <View style={[styles.resultBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <Text style={[styles.resultText, { color: theme.textPrimary }]}>{searchResult}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.scannerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.scannerTitle, { color: theme.textPrimary }]}>Scan QR</Text>
          <Text style={[styles.scannerSub, { color: theme.textMuted }]}>Open the main scan page to scan the QR code from the middle bottom navigation.</Text>

          <TouchableOpacity style={[styles.scanQrBtn, { backgroundColor: C.blueLight, borderColor: theme.border }]} onPress={() => onNavigate('scan')} activeOpacity={0.85}>
            <View style={styles.scanQrIcon}>
              <AppIcon name="scan" size={22} color={C.blue} />
            </View>
            <View style={styles.scanQrContent}>
              <Text style={styles.scanQrTitle}>Open Scan Page</Text>
              <Text style={[styles.scanQrSub, { color: theme.textMuted }]}>Go to the center QR scanner page</Text>
            </View>
            <AppIcon name="chevronRight" size={18} color={C.blue} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 16, paddingBottom: 32 },
  posterCard: { alignItems: 'center', justifyContent: 'center', borderRadius: 28, borderWidth: 1, paddingVertical: 18, overflow: 'hidden' },
  heroImage: { width: 310, height: 250, maxWidth: '100%' },
  searchCard: { borderRadius: 24, borderWidth: 1, padding: 16, gap: 12 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchInput: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontSize: 14, fontWeight: '600' },
  searchBtn: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
  resultBox: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14 },
  resultText: { fontSize: 15, fontWeight: '700' },
  scannerCard: { borderRadius: 24, borderWidth: 1, padding: 16, gap: 14 },
  scannerTitle: { fontSize: 16, fontWeight: '800' },
  scannerSub: { fontSize: 13, lineHeight: 20 },
  scanQrBtn: { minHeight: 84, borderRadius: 20, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  scanQrIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  scanQrContent: { flex: 1 },
  scanQrTitle: { color: C.blue, fontSize: 15, fontWeight: '800' },
  scanQrSub: { fontSize: 13, marginTop: 3, lineHeight: 18 },
});
