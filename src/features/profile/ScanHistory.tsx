import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

export function ScanHistoryPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const scanHistory = [
    { product: 'Fan Box 3"', points: '+10', time: 'Today, 10:23 AM', code: 'SRV-001' },
    { product: 'Junction Box', points: '+15', time: 'Yesterday, 3:45 PM', code: 'SRV-002' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('scanHistory')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.totalCard, { borderColor: theme.border }]}>
          <View>
            <Text style={styles.totalLabel}>Total Scans</Text>
            <Text style={styles.totalValue}>24</Text>
          </View>
          <View style={styles.totalDivider} />
          <View>
            <Text style={styles.totalLabel}>Points Earned</Text>
            <Text style={[styles.totalValue, { color: '#FFD67A' }]}>4,250</Text>
          </View>
        </View>

        {scanHistory.map((item, i) => (
          <View key={i} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.iconWrap}>
              <AppIcon name="scan" size={22} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{item.product}</Text>
              <Text style={[styles.sub, { color: theme.textMuted }]}>{`Code: ${item.code} | ${item.time}`}</Text>
            </View>
            <Text style={styles.cta}>{item.points}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 10, paddingBottom: 32 },
  totalCard: { backgroundColor: C.navy, borderRadius: 28, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 20, borderWidth: 1 },
  totalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  totalValue: { fontSize: 28, fontWeight: '900', color: '#fff' },
  totalDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, padding: 16, borderWidth: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 3 },
  cta: { fontSize: 12, fontWeight: '800', color: C.primary },
});
