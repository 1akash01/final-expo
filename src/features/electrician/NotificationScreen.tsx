import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { Screen } from '@/shared/types/navigation';

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
    title: 'New reward campaign is live',
    body: 'Redeem bonus gifts on selected scanned products this week.',
    time: '2 min ago',
    type: 'Offers',
    colors: ['#FFF4E8', '#FDE1B7'],
    icon: OfferIcon,
  },
  {
    title: 'Scan approved successfully',
    body: 'Your last QR scan has been credited with +50 points.',
    time: '15 min ago',
    type: 'Scans',
    colors: ['#EBF8FF', '#CBE7FF'],
    icon: ScanIcon,
  },
  {
    title: 'Wallet payout updated',
    body: 'Your reward wallet balance summary has been refreshed.',
    time: '1 hr ago',
    type: 'Wallet',
    colors: ['#EEF7F0', '#D2F0DA'],
    icon: WalletIcon,
  },
  {
    title: 'Important SRV announcement',
    body: 'New premium product range banners and updates are now available.',
    time: 'Today',
    type: 'Alerts',
    colors: ['#F2EEFF', '#DDD2FF'],
    icon: BellIcon,
  },
];

export function NotificationScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#09111F', '#12284A', '#18396A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Notification Center</Text>
            <Text style={styles.heroTitle}>Stay updated with SRV</Text>
            <Text style={styles.heroSub}>Important activity, scans, wallet updates, and offers in one place.</Text>
          </View>
          <View style={styles.heroIconWrap}>
            <BellIcon color="#FFFFFF" size={26} />
          </View>
        </View>

        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroActionBtn} activeOpacity={0.85} onPress={() => onNavigate('home')}>
            <Text style={styles.heroActionText}>Back Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroGhostBtn} activeOpacity={0.85} onPress={() => onNavigate('profile')}>
            <Text style={styles.heroGhostText}>More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Latest updates</Text>
        <View style={styles.unreadPill}>
          <Text style={styles.unreadText}>4 new</Text>
        </View>
      </View>

      {notifications.map((item) => {
        const Icon = item.icon;
        return (
          <LinearGradient key={item.title} colors={item.colors as [string, string]} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconWrap}>
                <Icon />
              </View>
              <View style={styles.meta}>
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </LinearGradient>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF3F8' },
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
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cardType: { color: '#10254A', fontSize: 12.5, fontWeight: '800' },
  cardTime: { color: '#5F718E', fontSize: 11.5, fontWeight: '700' },
  cardTitle: { color: '#10254A', fontSize: 17, fontWeight: '900' },
  cardBody: { color: '#41536F', fontSize: 12.5, lineHeight: 19, marginTop: 8 },
});

