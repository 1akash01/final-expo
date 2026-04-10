import { useRef, useState, useMemo } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';

const Colors = {
  primary: '#E8453C',
  primaryLight: '#FFF0F0',
  background: '#F2F3F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  success: '#22c55e',
  successLight: '#e6fdf0',
  gold: '#F59E0B',
  goldLight: '#FFF8E1',
  blue: '#3B82F6',
  blueLight: '#EFF6FF',
  teal: '#14B8A6',
  tealLight: '#F0FDFA',
};

const TABS = ['All', 'Cashback', 'Gifts', 'More'] as const;

const rewards = [
  { id: 'r1', category: 'Cashback', name: 'Rs 100 Cashback', description: 'Direct UPI or bank transfer', points: 500, progress: 85, color: Colors.primary, bg: Colors.primaryLight, badge: 'RS' },
  { id: 'r2', category: 'Gifts', name: 'Amazon Voucher', description: 'Rs 200 gift card code', points: 1000, progress: 42, color: Colors.success, bg: Colors.successLight, badge: 'AZ' },
  { id: 'r3', category: 'Gifts', name: 'SRV Product Bundle', description: 'Free kit worth Rs 500', points: 2000, progress: 60, color: Colors.blue, bg: Colors.blueLight, badge: 'SRV' },
  { id: 'r4', category: 'Cashback', name: 'Paytm Voucher', description: 'Rs 150 wallet credit', points: 750, progress: 70, color: Colors.gold, bg: Colors.goldLight, badge: 'PY' },
  { id: 'r5', category: 'Gifts', name: 'Premium Toolkit', description: 'Professional electrician kit', points: 3000, progress: 35, color: Colors.teal, bg: Colors.tealLight, badge: 'TK' },
  { id: 'r6', category: 'Cashback', name: 'Flipkart Voucher', description: 'Rs 300 shopping voucher', points: 1500, progress: 50, color: Colors.blue, bg: Colors.blueLight, badge: 'FK' },
];

function BackIcon({ size = 20, color = '#1C1E2E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6M9 12h10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function RewardsScreen({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('All');
  const headerScale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { darkMode, tx, theme } = usePreferenceContext();

  const filteredRewards = useMemo(() => {
    if (activeTab === 'All') return rewards;
    if (activeTab === 'Cashback') return rewards.filter(r => r.category === 'Cashback');
    if (activeTab === 'Gifts') return rewards.filter(r => r.category === 'Gifts');
    return [];
  }, [activeTab]);

  const handleRedeem = () => {
    Animated.sequence([
      Animated.timing(headerScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(headerScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#08111F' : Colors.background }}>
      {onBack ? (
        <View style={[styles.pageHeader, { backgroundColor: darkMode ? '#111827' : Colors.surface, borderBottomColor: darkMode ? '#243043' : Colors.border, paddingTop: insets.top }]}>
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: darkMode ? '#1F2937' : Colors.background }]} activeOpacity={0.75}>
            <BackIcon color={darkMode ? '#F8FAFC' : Colors.textDark} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: darkMode ? '#F8FAFC' : Colors.textDark }]}>{tx('Gift Store')}</Text>
          <View style={{ width: 44 }} />
        </View>
      ) : null}
      <ScrollView style={[styles.screen, darkMode && styles.screenDark]} contentContainerStyle={[styles.content, onBack && { paddingTop: 0 }]} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { transform: [{ scale: headerScale }] }]}>
        <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>{tx('Rewards Store')}</Text>
        <View style={[styles.pointsBadge, darkMode && styles.pointsBadgeDark]}>
          <Text style={styles.pointsBadgeIcon}>PTS</Text>
          <Text style={styles.pointsBadgeText}>4,250 {tx('pts')}</Text>
        </View>
      </Animated.View>

      <View style={[styles.tabRow, darkMode && styles.tabRowDark]}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive, darkMode && activeTab !== tab && styles.tabTextDark]}>{tx(tab)}</Text>
            {activeTab === tab ? <View style={[styles.tabUnderline, darkMode && styles.tabUnderlineDark]} /> : null}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'More' ? (
        <View style={styles.comingSoonCard}>
          <View style={[styles.comingSoonIcon, darkMode && styles.comingSoonIconDark]}>
            <Text style={styles.comingSoonIconText}>+</Text>
          </View>
          <Text style={[styles.comingSoonTitle, darkMode && styles.comingSoonTitleDark]}>{tx('Coming Soon!')}</Text>
          <Text style={[styles.comingSoonSub, darkMode && styles.comingSoonSubDark]}>{tx('More exciting rewards are on the way. Stay tuned!')}</Text>
        </View>
      ) : (
        filteredRewards.map((reward) => (
          <View key={reward.id} style={[styles.rewardCard, darkMode && styles.rewardCardDark]}>
            <View style={styles.rewardRow}>
              <View style={[styles.rewardIcon, { backgroundColor: reward.bg }]}>
                <Text style={[styles.rewardBadgeText, { color: reward.color }]}>{reward.badge}</Text>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardName, darkMode && styles.rewardNameDark]}>{tx(reward.name)}</Text>
                <Text style={[styles.rewardDesc, darkMode && styles.rewardDescDark]}>{tx(reward.description)}</Text>
                <View style={styles.pointsRow}>
                  <Text style={[styles.rewardPts, darkMode && styles.rewardPtsDark]}>{reward.points}</Text>
                  <Text style={[styles.rewardPtsLabel, darkMode && styles.rewardPtsLabelDark]}> {tx('pts')}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleRedeem}
                style={[styles.redeemBtn, { backgroundColor: reward.color }]}
                activeOpacity={0.85}
              >
                <Text style={styles.redeemBtnText}>{tx('Redeem')}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.progressTrack, darkMode && styles.progressTrackDark]}>
              <View style={[styles.progressFill, { width: `${reward.progress}%`, backgroundColor: reward.color }]} />
            </View>
            <Text style={[styles.progressLabel, darkMode && styles.progressLabelDark]}>{reward.progress}% {tx('to unlock')}</Text>
          </View>
        ))
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 18, fontWeight: '800' },
  screen: { flex: 1, backgroundColor: Colors.background },
  screenDark: { backgroundColor: '#08111F' },
  content: { padding: 16, gap: 14 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.textDark, letterSpacing: -0.5 },
  headerTitleDark: { color: '#F8FAFC' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: Colors.success, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.successLight },
  pointsBadgeDark: { borderColor: '#22C55E', backgroundColor: '#0F2A1C' },
  pointsBadgeIcon: { fontSize: 10, fontWeight: '900', color: Colors.success },
  pointsBadgeText: { fontSize: 14, fontWeight: '800', color: Colors.success },

  tabRow: { flexDirection: 'row', marginBottom: 18, borderRadius: 16, backgroundColor: Colors.surface, padding: 4, borderWidth: 1, borderColor: Colors.border },
  tabRowDark: { backgroundColor: '#111827', borderColor: '#243043' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, position: 'relative' },
  tabItemActive: { backgroundColor: Colors.background },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontWeight: '800' },
  tabTextDark: { color: '#64748B' },
  tabUnderline: { display: 'none' },

  rewardCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  rewardCardDark: { backgroundColor: '#111827', borderColor: '#243043', shadowColor: '#020617' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  rewardIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  rewardBadgeText: { fontSize: 18, fontWeight: '900' },
  rewardInfo: { flex: 1, gap: 2 },
  rewardName: { fontSize: 16, fontWeight: '800', color: Colors.textDark },
  rewardDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 16 },
  pointsRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  rewardPts: { fontSize: 20, fontWeight: '900', color: Colors.textDark },
  rewardPtsLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  rewardNameDark: { color: '#F8FAFC' },
  rewardDescDark: { color: '#94A3B8' },
  rewardPtsDark: { color: '#F8FAFC' },
  rewardPtsLabelDark: { color: '#94A3B8' },
  redeemBtn: { borderRadius: 18, paddingHorizontal: 20, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  redeemBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  progressTrack: { height: 8, backgroundColor: '#F0F0F5', borderRadius: 6, overflow: 'hidden' },
  progressTrackDark: { backgroundColor: '#243043' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressLabel: { marginTop: 8, fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  progressLabelDark: { color: '#94A3B8' },

  comingSoonCard: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  comingSoonIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 3, borderColor: Colors.primary, borderStyle: 'dashed' },
  comingSoonIconDark: { backgroundColor: '#1F1F1F', borderColor: '#444' },
  comingSoonIconText: { fontSize: 40, fontWeight: '300', color: Colors.primary },
  comingSoonTitle: { fontSize: 24, fontWeight: '900', color: Colors.textDark, marginBottom: 10 },
  comingSoonTitleDark: { color: '#F8FAFC' },
  comingSoonSub: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
  comingSoonSubDark: { color: '#94A3B8' },
});
