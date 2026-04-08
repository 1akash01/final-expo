import { useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
};

const TABS = ['All', 'Cashback', 'Gifts', 'More'];

const rewards = [
  { id: 'r1', name: '₹100 Cashback', description: 'Direct UPI / bank transfer', points: 500, progress: 85, color: '#E8453C', bg: '#FFF0F0', emoji: '💳' },
  { id: 'r2', name: 'Amazon Voucher', description: '₹200 gift card code', points: 1000, progress: 42, color: '#22c55e', bg: Colors.successLight, emoji: '🎁' },
  { id: 'r3', name: 'SRV Product Bundle', description: 'Free kit worth ₹500', points: 2000, progress: 60, color: '#3B82F6', bg: '#EFF6FF', emoji: '⭐' },
  { id: 'r4', name: 'Paytm Voucher', description: '₹150 wallet credit', points: 750, progress: 70, color: '#F59E0B', bg: '#FFF8E1', emoji: '💳' },
  { id: 'r5', name: 'Premium Toolkit', description: 'Professional electrician kit', points: 3000, progress: 35, color: '#E8453C', bg: '#FFF0F0', emoji: '⚡' },
  { id: 'r6', name: 'Flipkart Voucher', description: '₹300 shopping voucher', points: 1500, progress: 50, color: '#3B82F6', bg: '#EFF6FF', emoji: '🎁' },
];

export function RewardsScreen() {
  const [activeTab, setActiveTab] = require('react').useState('All');
  const headerScale = useRef(new Animated.Value(1)).current;
  const { darkMode } = usePreferenceContext();

  const handleRedeem = (id: string) => {
    Animated.sequence([
      Animated.timing(headerScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(headerScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <ScrollView style={[styles.screen, darkMode ? styles.screenDark : null]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, darkMode ? styles.headerTitleDark : null]}>Rewards Store</Text>
        <View style={[styles.pointsBadge, darkMode ? styles.pointsBadgeDark : null]}>
          <Text style={{ fontSize: 16 }}>⭐</Text>
          <Text style={styles.pointsBadgeText}>4,250 pts</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={[styles.tabUnderline, darkMode ? styles.tabUnderlineDark : null]} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Rewards List */}
      {rewards.map((reward) => (
        <View key={reward.id} style={[styles.rewardCard, darkMode ? styles.rewardCardDark : null]}>
          <View style={styles.rewardRow}>
            <View style={[styles.rewardIcon, { backgroundColor: reward.bg }]}>
              <Text style={{ fontSize: 26 }}>{reward.emoji}</Text>
            </View>
            <View style={styles.rewardInfo}>
              <Text style={[styles.rewardName, darkMode ? styles.rewardNameDark : null]}>{reward.name}</Text>
              <Text style={[styles.rewardDesc, darkMode ? styles.rewardDescDark : null]}>{reward.description}</Text>
              <Text style={[styles.rewardPts, darkMode ? styles.rewardPtsDark : null]}>{reward.points} pts</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRedeem(reward.id)}
              style={[styles.redeemBtn, { backgroundColor: reward.color }]}
              activeOpacity={0.85}
            >
              <Text style={styles.redeemBtnText}>Redeem</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.progressTrack, darkMode ? styles.progressTrackDark : null]}>
            <View style={[styles.progressFill, { width: `${reward.progress}%`, backgroundColor: reward.color }]} />
          </View>
          <Text style={[styles.progressLabel, darkMode ? styles.progressLabelDark : null]}>{reward.progress}% to unlock</Text>
        </View>
      ))}

      {/* Mega Event Banner */}
      <View style={[styles.eventBanner, darkMode ? styles.eventBannerDark : null]}>
        <View style={styles.eventLeft}>
          <Text style={styles.eventTitle}>Mega Rewards Event! 🎉</Text>
          <Text style={styles.eventSub}>Earn 2x points on all scans this week. Limited time offer!</Text>
          <TouchableOpacity style={styles.learnMoreBtn}>
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 52 }}>🎁</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  screenDark: { backgroundColor: '#08111F' },
  content: { padding: 16, gap: 0 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  headerTitleDark: { color: '#F8FAFC' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: Colors.success, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 7 },
  pointsBadgeDark: { borderColor: '#22C55E', backgroundColor: '#0F2A1C' },
  pointsBadgeText: { fontSize: 14, fontWeight: '800', color: Colors.success },

  tabRow: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontWeight: '800' },
  tabUnderline: { position: 'absolute', bottom: -1, left: '10%', right: '10%', height: 2, backgroundColor: Colors.primary, borderRadius: 1 },
  tabUnderlineDark: { backgroundColor: '#F87171' },

  rewardCard: { backgroundColor: Colors.surface, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  rewardCardDark: { backgroundColor: '#111827', borderColor: '#243043', shadowColor: '#020617' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  rewardIcon: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rewardInfo: { flex: 1 },
  rewardName: { fontSize: 16, fontWeight: '800', color: Colors.textDark },
  rewardDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
  rewardPts: { fontSize: 16, fontWeight: '800', color: Colors.textDark, marginTop: 6 },
  rewardNameDark: { color: '#F8FAFC' },
  rewardDescDark: { color: '#94A3B8' },
  rewardPtsDark: { color: '#F8FAFC' },
  redeemBtn: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  redeemBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  progressTrack: { height: 7, backgroundColor: '#F0F0F5', borderRadius: 4, overflow: 'hidden' },
  progressTrackDark: { backgroundColor: '#243043' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabel: { marginTop: 6, fontSize: 11, color: Colors.textMuted },
  progressLabelDark: { color: '#94A3B8' },

  eventBanner: { backgroundColor: Colors.primary, borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  eventBannerDark: { backgroundColor: '#7F1D1D' },
  eventLeft: { flex: 1, marginRight: 12 },
  eventTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  eventSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 18 },
  learnMoreBtn: { marginTop: 14, backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10, alignSelf: 'flex-start' },
  learnMoreText: { color: Colors.primary, fontSize: 13, fontWeight: '800' },
});
