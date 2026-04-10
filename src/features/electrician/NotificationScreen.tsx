import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import type { Screen, UserRole } from '@/shared/types/navigation';

function BellIcon({ color = '#0F172A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 16.5V11a6 6 0 1112 0v5.5l1.2 1.2a.8.8 0 01-.57 1.36H5.37a.8.8 0 01-.57-1.36L6 16.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function OfferIcon({ color = '#0F172A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.5 3.5l7 7-8.5 8.5a2 2 0 01-2.83 0L3 13.83a2 2 0 010-2.83L11.5 3.5a2 2 0 011 0z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Circle cx="15.5" cy="8.5" r="1.2" fill={color} />
    </Svg>
  );
}

function ScanIcon({ color = '#0F172A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="4" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Rect x="4" y="14" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Path d="M14 14h2v2h-2zM18 14h2v6h-6v-2h4v-4z" fill={color} />
    </Svg>
  );
}

function WalletIcon({ color = '#0F172A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M16 12h5v4h-5a2 2 0 010-4z" stroke={color} strokeWidth={1.8} />
      <Circle cx="16.8" cy="14" r="1" fill={color} />
      <Path d="M7 6V4.8A1.8 1.8 0 018.8 3h8.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

const notifications = [
  {
    title: 'Price Update',
    body: 'The price of 4 way DD has been updated to Rs.306.',
    time: '2 hr ago',
    type: 'Price Alert',
    colors: ['#FFF4E8', '#FDE1B7'] as [string, string],
    icon: OfferIcon,
  },
  {
    title: 'Price Update',
    body: 'The price of 6 Way DD has been updated to Rs.363.',
    time: '3 hr ago',
    type: 'Catalog',
    colors: ['#EBF8FF', '#CBE7FF'] as [string, string],
    icon: ScanIcon,
  },
  {
    title: 'Scheme Notice',
    body: 'Selected SRV reward schemes have updated slabs for this week.',
    time: 'Today',
    type: 'Rewards',
    colors: ['#EEF7F0', '#D2F0DA'] as [string, string],
    icon: WalletIcon,
  },
  {
    title: 'Important SRV announcement',
    body: 'Keep your profile and bank details updated for smooth redemptions and withdrawals.',
    time: 'Today',
    type: 'Alerts',
    colors: ['#F2EEFF', '#DDD2FF'] as [string, string],
    icon: BellIcon,
  },
];

const dealerNotifications = [
  {
    title: 'Price Update',
    body: 'The price of 4 way DD has been updated to Rs.306.',
    time: '2 hr ago',
    type: 'Price Alert',
    colors: ['#FFF4E8', '#FDE1B7'] as [string, string],
    icon: OfferIcon,
  },
  {
    title: 'Price Update',
    body: 'The price of 6 Way DD has been updated to Rs.363.',
    time: '3 hr ago',
    type: 'Catalog',
    colors: ['#EBF8FF', '#CBE7FF'] as [string, string],
    icon: ScanIcon,
  },
  {
    title: 'Scheme Notice',
    body: 'Selected SRV reward schemes have updated slabs for this week.',
    time: 'Today',
    type: 'Rewards',
    colors: ['#EEF7F0', '#D2F0DA'] as [string, string],
    icon: WalletIcon,
  },
  {
    title: 'Important SRV announcement',
    body: 'Keep your profile and bank details updated for smooth redemptions and withdrawals.',
    time: 'Today',
    type: 'Alerts',
    colors: ['#F2EEFF', '#DDD2FF'] as [string, string],
    icon: BellIcon,
  },
];

export function NotificationScreen({ onNavigate, role = 'electrician' }: { onNavigate: (screen: Screen) => void; role?: UserRole }) {
  const { darkMode, tx } = usePreferenceContext();
  const isDealer = role === 'dealer';
  const activeNotifications = isDealer ? dealerNotifications : notifications;
  return (
    <ScrollView style={[styles.screen, darkMode ? styles.screenDark : null]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#09111F', '#12284A', '#18396A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>{tx('Notification Center')}</Text>
            <Text style={styles.heroTitle}>{tx('Stay updated with SRV')}</Text>
            <Text style={styles.heroSub}>{tx('Important price updates, reward alerts, and account notices in one place.')}</Text>
          </View>
          <View style={styles.heroIconWrap}>
            <BellIcon color="#FFFFFF" size={26} />
          </View>
        </View>

        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroActionBtn} activeOpacity={0.85} onPress={() => onNavigate('home')}>
            <Text style={styles.heroActionText}>{tx('Back Home')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroGhostBtn} activeOpacity={0.85} onPress={() => onNavigate('profile')}>
            <Text style={styles.heroGhostText}>{tx('More')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>{tx('Latest updates')}</Text>
        <View style={styles.unreadPill}>
          <Text style={styles.unreadText}>{activeNotifications.length} {tx('new')}</Text>
        </View>
      </View>

      {activeNotifications.map((item, index) => {
        const Icon = item.icon;
        return (
          <LinearGradient key={`${item.title}-${item.time}-${index}`} colors={darkMode ? ['#182133', '#23324C'] as [string, string] : (item.colors as [string, string])} style={[styles.card, darkMode ? styles.cardDark : null]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, darkMode ? styles.iconWrapDark : null]}>
                <Icon />
              </View>
              <View style={styles.meta}>
                <Text style={[styles.cardType, darkMode ? styles.cardTypeDark : null]}>{tx(item.type)}</Text>
                <Text style={[styles.cardTime, darkMode ? styles.cardTimeDark : null]}>{tx(item.time)}</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, darkMode ? styles.cardTitleDark : null]}>{tx(item.title)}</Text>
            <Text style={[styles.cardBody, darkMode ? styles.cardBodyDark : null]}>{tx(item.body)}</Text>
          </LinearGradient>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF3F8' },
  screenDark: { backgroundColor: '#08111F' },
  content: { padding: 14, gap: 14, paddingBottom: 30 },
  hero: {
    borderRadius: 28,
    padding: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 7,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
  heroCopy: { flex: 1, paddingRight: 4 },
  heroEyebrow: { color: 'rgba(255,255,255,0.66)', fontSize: 11, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  heroTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.78)', fontSize: 12.5, lineHeight: 19, marginTop: 8, maxWidth: '86%' },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  heroActionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  heroActionText: { color: '#10254A', fontWeight: '800', fontSize: 12.5 },
  heroGhostBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  heroGhostText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12.5 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  sectionTitle: { color: '#14213D', fontSize: 20, fontWeight: '900' },
  sectionTitleDark: { color: '#F8FAFC' },
  unreadPill: { backgroundColor: '#E8453C', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  unreadText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  card: {
    borderRadius: 24,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardDark: {
    shadowColor: '#020617',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  meta: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cardType: { color: '#10254A', fontSize: 12.5, fontWeight: '800' },
  cardTime: { color: '#5F718E', fontSize: 11.5, fontWeight: '700' },
  cardTitle: { color: '#10254A', fontSize: 17, fontWeight: '900' },
  cardBody: { color: '#41536F', fontSize: 12.5, lineHeight: 19, marginTop: 8 },
  cardTypeDark: { color: '#E2E8F0' },
  cardTimeDark: { color: '#94A3B8' },
  cardTitleDark: { color: '#F8FAFC' },
  cardBodyDark: { color: '#CBD5E1' },
});

