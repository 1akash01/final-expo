import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, Screen, usePreferenceContext } from './ProfileShared';

const noDataImage = require('./assets/nodata.png');
const buySchemeImage = require('./assets/giftstore.png');
const bankTransferImage = require('./assets/upi.png');
const transferPointImage = require('./assets/transferpoint.png');

type RedemptionTab = 'Buy Schemes' | 'Bank Transfer' | 'Transfer Point';
type FilterRange = 'This Month' | 'Last 30 Days' | 'All';

const redemptions = [
  { type: 'Buy Schemes' as RedemptionTab, title: 'Premium Fan Box Scheme', points: '-1200', date: '03 Apr 2026', status: 'Processed' },
  { type: 'Bank Transfer' as RedemptionTab, title: 'Bank Transfer Request', points: '-2500', date: '29 Mar 2026', status: 'Completed' },
  { type: 'Transfer Point' as RedemptionTab, title: 'Points Sent to Dealer', points: '-450', date: '18 Mar 2026', status: 'Success' },
  { type: 'Buy Schemes' as RedemptionTab, title: 'Festival Reward Scheme', points: '-850', date: '11 Mar 2026', status: 'Processed' },
];

export function RedemptionPage({
  onBack,
  onNavigate,
  onOpenBankDetails,
  onOpenTransferPoints,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onOpenBankDetails: () => void;
  onOpenTransferPoints: () => void;
}) {
  const { t, theme } = usePreferenceContext();
  const [activeTab, setActiveTab] = useState<RedemptionTab>('Buy Schemes');
  const [activeFilter, setActiveFilter] = useState<FilterRange>('This Month');
  const tabs: RedemptionTab[] = ['Buy Schemes', 'Bank Transfer', 'Transfer Point'];
  const filters: FilterRange[] = ['This Month', 'Last 30 Days', 'All'];

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return redemptions.filter((item) => item.type === activeTab);
    if (activeFilter === 'This Month') return redemptions.filter((item) => item.type === activeTab && item.date.includes('Apr 2026'));
    return redemptions.filter((item) => item.type === activeTab && (item.date.includes('Apr 2026') || item.date.includes('Mar 2026')));
  }, [activeFilter, activeTab]);

  const openTabDestination = (tab: RedemptionTab) => {
    setActiveTab(tab);
    if (tab === 'Buy Schemes') return onNavigate('rewards');
    if (tab === 'Bank Transfer') return onOpenBankDetails();
    onOpenTransferPoints();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('redemptionHistory')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Redeem Product</Text>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>02</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Lifetime Redeem</Text>
            <Text style={[styles.summaryValue, { color: C.primary }]}>04</Text>
          </View>
        </View>

        <View style={[styles.pointsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.pointsVal, { color: theme.textPrimary }]}>0 {t('points')}</Text>
          <Text style={styles.pointsSub}>Redeemable Points</Text>
          <View style={styles.tabRow}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, { backgroundColor: isActive ? C.primaryLight : theme.soft, borderColor: isActive ? C.primary : 'transparent' }]}
                  onPress={() => openTabDestination(tab)}
                  activeOpacity={0.8}
                >
                  <Image source={tab === 'Buy Schemes' ? buySchemeImage : tab === 'Bank Transfer' ? bankTransferImage : transferPointImage} style={styles.tabAsset} resizeMode="contain" />
                  <Text style={[styles.tabText, { color: isActive ? C.primary : theme.textSecondary }]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.filterWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Filter</Text>
          <View style={styles.filterRow}>
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, { backgroundColor: isActive ? C.primary : theme.soft }]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, { color: isActive ? '#fff' : theme.textSecondary }]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {filteredItems.length > 0 ? filteredItems.map((item, index) => (
          <View key={`${item.title}-${index}`} style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.historyHead}>
              <View style={[styles.historyIcon, { backgroundColor: item.type === 'Bank Transfer' ? C.goldLight : item.type === 'Transfer Point' ? C.blueLight : C.tealLight }]}>
                <AppIcon name={item.type === 'Bank Transfer' ? 'bank' : item.type === 'Transfer Point' ? 'transfer' : 'gift'} size={18} color={item.type === 'Bank Transfer' ? C.gold : item.type === 'Transfer Point' ? C.blue : C.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historyTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.historyDate, { color: theme.textMuted }]}>{item.date}</Text>
              </View>
              <Text style={styles.pointsText}>{item.points}</Text>
            </View>
            <View style={[styles.statusRow, { backgroundColor: theme.soft }]}>
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>{item.type}</Text>
              <Text style={[styles.dot, { color: theme.textMuted }]}>|</Text>
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>{item.status}</Text>
            </View>
          </View>
        )) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Image source={noDataImage} style={styles.emptyImage} resizeMode="contain" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, borderRadius: 22, borderWidth: 1, padding: 16 },
  summaryLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 24, fontWeight: '900', marginTop: 6 },
  pointsCard: { borderRadius: 24, padding: 18, borderWidth: 1 },
  pointsVal: { fontSize: 22, fontWeight: '900' },
  pointsSub: { fontSize: 14, fontWeight: '700', marginBottom: 16, marginTop: 2, color: C.primary },
  tabRow: { flexDirection: 'row', gap: 10 },
  tab: { flex: 1, borderRadius: 18, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1.5 },
  tabAsset: { width: 40, height: 40 },
  tabText: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  filterWrap: { borderRadius: 22, borderWidth: 1, padding: 16, gap: 12 },
  filterLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  filterRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  filterChipText: { fontSize: 12, fontWeight: '800' },
  historyCard: { borderRadius: 22, borderWidth: 1, padding: 16, gap: 14 },
  historyHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  historyTitle: { fontSize: 14, fontWeight: '800' },
  historyDate: { fontSize: 12, marginTop: 3 },
  pointsText: { fontSize: 14, fontWeight: '900', color: C.primary },
  statusRow: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' },
  statusText: { fontSize: 12, fontWeight: '700' },
  dot: { marginHorizontal: 8, fontSize: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, borderRadius: 22, borderWidth: 1 },
  emptyImage: { width: 240, height: 240 },
});
