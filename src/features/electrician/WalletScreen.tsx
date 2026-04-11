import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import { colors } from '@/shared/theme/colors';
import type { Screen, UserRole } from '@/shared/types/navigation';

type WalletScreenProps = {
  role?: UserRole;
  onNavigate?: (screen: Screen) => void;
};

function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5L8 12L15 19" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WalletGlyph() {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Rect x="3" y="7" width="22" height="15" rx="5" fill="#FFFFFF" fillOpacity="0.18" />
      <Path d="M8 10.5H20.5C22.43 10.5 24 12.07 24 14C24 15.93 22.43 17.5 20.5 17.5H8C6.07 17.5 4.5 15.93 4.5 14C4.5 12.07 6.07 10.5 8 10.5Z" stroke="#FFF7EA" strokeWidth="1.8" />
      <Circle cx="19.5" cy="14" r="1.6" fill="#FFD58B" />
    </Svg>
  );
}

function HistoryGlyph() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 7V12L15.5 14" stroke="#7A4A22" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 12A8 8 0 1 1 17.66 6.34" stroke="#7A4A22" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 4V9H15" stroke="#7A4A22" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GiftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="10" width="16" height="9" rx="2.5" stroke="#6B3E16" strokeWidth={1.8} />
      <Path d="M12 10V19M4 13H20M12 10H9.8C8.81 10 8 9.19 8 8.2C8 7.21 8.81 6.4 9.8 6.4C11.78 6.4 12 10 12 10ZM12 10H14.2C15.19 10 16 9.19 16 8.2C16 7.21 15.19 6.4 14.2 6.4C12.22 6.4 12 10 12 10Z" stroke="#6B3E16" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TransferIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M7 7H19M19 7L15.5 3.5M19 7L15.5 10.5" stroke="#234975" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 17H5M5 17L8.5 13.5M5 17L8.5 20.5" stroke="#234975" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SparkIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12.5 3L6.5 12H11L10.5 21L17.5 10.5H13L12.5 3Z" fill="#B53324" />
    </Svg>
  );
}

const historyItems = [
  { id: 'h1', title: 'Referral reward credited', time: 'Today, 10:42 AM', points: '+120', accent: '#1F9C5D' },
  { id: 'h2', title: 'Bank transfer processed', time: 'Yesterday, 06:20 PM', points: '-250', accent: '#B44A3A' },
  { id: 'h3', title: 'Scheme bonus unlocked', time: '02 Apr 2026', points: '+80', accent: '#35538E' },
];

const dealerHistoryItems = [
  { id: 'dh1', title: 'Referral reward credited', time: 'Today, 10:42 AM', points: '+120', accent: '#1F9C5D' },
  { id: 'dh2', title: 'Bank transfer processed', time: 'Yesterday, 06:20 PM', points: '-250', accent: '#B44A3A' },
  { id: 'dh3', title: 'Scheme bonus unlocked', time: '02 Apr 2026', points: '+80', accent: '#35538E' },
];

export function WalletScreen({ role = 'electrician', onNavigate }: WalletScreenProps) {
  const { darkMode, tx } = usePreferenceContext();
  const isDealer = role === 'dealer';
  const dealerActions = [
    {
      id: 'bank',
      label: 'Bank Transfer',
      detail: 'Fast withdrawal',
      icon: TransferIcon,
      tint: '#DDEAFE',
      target: 'bank_details' as Screen,
    },
    {
      id: 'bonus',
      label: 'Dealer Bonus',
      detail: '5% electrician bonus',
      icon: SparkIcon,
      tint: '#FFE0DA',
      target: 'dealer_bonus' as Screen,
    },
  ];

  const electricianActions = [
    {
      id: 'buy',
      label: 'Buy Schemes',
      detail: 'Premium offers',
      icon: GiftIcon,
      tint: '#FBE4CC',
      target: 'rewards' as Screen,
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      detail: 'Fast withdrawal',
      icon: TransferIcon,
      tint: '#DDEAFE',
      target: 'bank_details' as Screen,
    },
    {
      id: 'point',
      label: 'Transfer Point',
      detail: 'Send to dealer',
      icon: SparkIcon,
      tint: '#FFE0DA',
      target: 'transfer_points' as Screen,
    },
  ];

  const actions = isDealer ? dealerActions : electricianActions;

  return (
    <ScrollView style={[styles.screen, darkMode ? styles.screenDark : null]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#18345B', '#355C95', '#E18D4E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
        <View style={styles.heroGlow} />
        <View style={styles.heroHeader}>
          <Pressable onPress={() => onNavigate?.('home')} style={styles.backButton}>
            <BackIcon />
            <Text style={styles.backLabel}>{tx('Home')}</Text>
          </Pressable>
          <Pressable onPress={() => onNavigate?.('rewards')} style={styles.storeButton}>
            <View style={styles.storeIconWrap}>
              <GiftIcon />
            </View>
          </Pressable>
        </View>

        <Text style={styles.eyebrow}>{tx(isDealer ? 'SRV Dealer Wallet' : 'SRV Premium Wallet')}</Text>
        <Text style={styles.heroTitle}>0 {tx('Total Points')}</Text>
        <Text style={styles.heroSub}>
          {tx(
            isDealer
              ? 'Dealer wallet for schemes, bank payouts, and dealer bonus tracking.'
              : 'Premium rewards dashboard for redemptions, transfers, and loyalty growth.'
          )}
        </Text>

        <View style={styles.heroStats}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatLabel}>{tx(isDealer ? 'Active Electricians' : 'Redeem Product')}</Text>
            <Text style={styles.heroStatValue}>{isDealer ? '34' : '0'}</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatLabel}>{tx(isDealer ? 'Bonus Withdrawals' : 'Lifetime Redeem')}</Text>
            <Text style={styles.heroStatValue}>{isDealer ? '12' : '0'}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.card, darkMode ? styles.cardDark : null]}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionEyebrow, darkMode ? styles.sectionEyebrowDark : null]}>{tx('Quick Actions')}</Text>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>{tx(isDealer ? 'Manage dealer payouts' : 'Move your wallet faster')}</Text>
          </View>
          <View style={styles.sectionIconWrap}>
            <SparkIcon />
          </View>
        </View>
        <View style={styles.actionGrid}>
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.actionTile, darkMode ? styles.actionTileDark : null]}
                activeOpacity={0.86}
                onPress={() => onNavigate?.(item.target)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: item.tint }]}>
                  <Icon />
                </View>
                <Text style={[styles.actionTileText, darkMode ? styles.actionTileTextDark : null]}>{tx(item.label)}</Text>
                <Text style={[styles.actionTileSub, darkMode ? styles.actionTileSubDark : null]}>{tx(item.detail)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, darkMode ? styles.cardDark : null]}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionEyebrow, darkMode ? styles.sectionEyebrowDark : null]}>{tx('Redeem Point History')}</Text>
            <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>{tx('Activity Timeline')}</Text>
          </View>
          <View style={styles.sectionIconWrap}>
            <HistoryGlyph />
          </View>
        </View>

        <View style={styles.timeline}>
          {(isDealer ? dealerHistoryItems : historyItems).map((item) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineTrack}>
                <View style={[styles.timelineDot, { backgroundColor: item.accent }]} />
              </View>
              <View style={[styles.timelineCard, darkMode ? styles.timelineCardDark : null]}>
                <View style={styles.timelineTop}>
                  <Text style={[styles.timelineTitle, darkMode ? styles.timelineTitleDark : null]}>{tx(item.title)}</Text>
                  <Text style={[styles.timelinePoints, { color: item.accent }]}>{item.points}</Text>
                </View>
                <Text style={[styles.timelineTime, darkMode ? styles.timelineTimeDark : null]}>{tx(item.time)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.emptyState, darkMode ? styles.emptyStateDark : null]}>
          <View style={styles.emptyIconWrap}>
            <HistoryGlyph />
          </View>
          <Text style={[styles.emptyTitle, darkMode ? styles.emptyTitleDark : null]}>{tx('No detailed records yet')}</Text>
          <Text style={[styles.emptySub, darkMode ? styles.emptySubDark : null]}>
            {tx(
              isDealer
                ? 'Your complete wallet history will appear here once bank payouts or dealer bonus activity starts.'
                : 'Your complete wallet history will appear here once redemption or transfer activity starts.'
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4EFE8' },
  screenDark: { backgroundColor: '#08111F' },
  content: { padding: 18, gap: 18, paddingBottom: 120 },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 34,
    padding: 22,
    minHeight: 245,
    shadowColor: '#193357',
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  heroGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -40,
    right: -20,
  },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  storeButton: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  storeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0DA',
  },
  eyebrow: { marginTop: 24, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', color: '#FDE3B8' },
  heroTitle: { marginTop: 10, fontSize: 38, fontWeight: '900', color: '#FFFFFF' },
  heroSub: { marginTop: 8, maxWidth: '88%', fontSize: 13, lineHeight: 20, color: 'rgba(255,255,255,0.84)' },
  heroStats: { marginTop: 22, flexDirection: 'row', gap: 12 },
  heroStatCard: {
    flex: 1,
    borderRadius: 22,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.74)' },
  heroStatValue: { marginTop: 8, fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  card: {
    borderRadius: 30,
    backgroundColor: '#FFFDFC',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E9DED3',
    shadowColor: '#734E2A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#111827',
    borderColor: '#243043',
    shadowColor: '#020617',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionEyebrow: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1, color: '#B57846' },
  sectionTitle: { marginTop: 4, fontSize: 18, fontWeight: '900', color: '#221C1A' },
  sectionEyebrowDark: { color: '#F59E0B' },
  sectionTitleDark: { color: '#F8FAFC' },
  sectionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFF1E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGrid: { marginTop: 18, flexDirection: 'row', gap: 12 },
  actionTile: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#FFF7F0',
    borderWidth: 1,
    borderColor: '#F1E0CF',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    minHeight: 150,
  },
  actionTileDark: {
    backgroundColor: '#182133',
    borderColor: '#243043',
  },
  actionIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileText: { marginTop: 12, textAlign: 'center', fontSize: 13, color: colors.text, fontWeight: '800' },
  actionTileSub: { marginTop: 4, textAlign: 'center', fontSize: 11, color: colors.mutedText, lineHeight: 16 },
  actionTileTextDark: { color: '#F8FAFC' },
  actionTileSubDark: { color: '#94A3B8' },
  timeline: { marginTop: 18, gap: 14 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineTrack: { width: 18, alignItems: 'center' },
  timelineDot: { marginTop: 12, width: 10, height: 10, borderRadius: 999 },
  timelineCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#FBF5EF',
    borderWidth: 1,
    borderColor: '#EEE0D5',
    padding: 15,
  },
  timelineCardDark: {
    backgroundColor: '#182133',
    borderColor: '#243043',
  },
  timelineTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  timelineTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: '#241B16' },
  timelinePoints: { fontSize: 14, fontWeight: '900' },
  timelineTime: { marginTop: 6, fontSize: 12, color: '#887B74' },
  timelineTitleDark: { color: '#F8FAFC' },
  timelineTimeDark: { color: '#94A3B8' },
  emptyState: {
    marginTop: 18,
    borderRadius: 24,
    backgroundColor: '#FFF8F2',
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E1D3',
  },
  emptyStateDark: {
    backgroundColor: '#182133',
    borderColor: '#243043',
  },
  emptyIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FBE9D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { marginTop: 14, fontSize: 20, fontWeight: '900', color: '#B04D2E' },
  emptySub: { marginTop: 8, fontSize: 13, textAlign: 'center', color: colors.mutedText, lineHeight: 19 },
  emptyTitleDark: { color: '#F8FAFC' },
  emptySubDark: { color: '#94A3B8' },
});

