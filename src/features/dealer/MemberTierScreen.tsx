import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import { associatedElectricians } from './dealerData';

function BackIcon({ color = '#173E80', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TierIcon({ tier, size = 26 }: { tier: TierInfo['tier']; size?: number }) {
  if (tier === 'Silver') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" fill="#E2E8F0" stroke="#94A3B8" strokeWidth={1.8} />
        <Path d="M8.2 12.5l2.4 2.4 5.1-5.4" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (tier === 'Gold') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth={1.8} />
        <Path d="M12 5.8l1.9 3.85 4.25.62-3.07 3 .72 4.23L12 15.6l-3.8 1.9.73-4.23-3.08-3 4.25-.62L12 5.8z" fill="#B45309" />
      </Svg>
    );
  }

  if (tier === 'Platinum') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 3.8l3 3 4.2.6-1.7 4.1 1 4.4-4.5-.4L12 20.2l-2-4.7-4.5.4 1-4.4-1.7-4.1 4.2-.6 3-3z"
          fill="#DBEAFE"
          stroke="#2563EB"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Path d="M8.6 13.7l2.1-3.8 1.6 1.9 1.9-2.7 1.2 4.6H8.6z" fill="#1D4ED8" />
        <Path d="M9.7 7.9h4.6" stroke="#60A5FA" strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.8l5.3 4.1-2 6.6H8.7l-2-6.6L12 3.8z" fill="#CFFAFE" stroke="#0891B2" strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M9.5 16.3h5l1.4 2.8H8.1l1.4-2.8z" fill="#0E7490" />
    </Svg>
  );
}

type TierInfo = {
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  range: string;
  accent: string;
  soft: string;
  gradient: [string, string, string];
  detail: string;
};

const tierLevels: TierInfo[] = [
  {
    tier: 'Silver',
    range: '0 - 100 electricians',
    accent: '#64748B',
    soft: '#E2E8F0',
    gradient: ['#F8FAFC', '#EEF2F7', '#E2E8F0'],
    detail: 'Starting tier for dealers building their first electrician network.',
  },
  {
    tier: 'Gold',
    range: '101 - 300 electricians',
    accent: '#B45309',
    soft: '#FEF3C7',
    gradient: ['#FFF8E6', '#FEF0C7', '#FDE68A'],
    detail: 'Strong network coverage with better visibility and recognition.',
  },
  {
    tier: 'Platinum',
    range: '301 - 500 electricians',
    accent: '#1D4ED8',
    soft: '#DBEAFE',
    gradient: ['#EFF6FF', '#DBEAFE', '#BFDBFE'],
    detail: 'Advanced tier for high-performing dealers with wide electrician reach.',
  },
  {
    tier: 'Diamond',
    range: '500+ electricians',
    accent: '#0E7490',
    soft: '#CFFAFE',
    gradient: ['#ECFEFF', '#CFFAFE', '#A5F3FC'],
    detail: 'Top network class for leading dealers with a large connected base.',
  },
];

function getTier(count: number): TierInfo {
  if (count <= 100) return tierLevels[0];
  if (count <= 300) return tierLevels[1];
  if (count <= 500) return tierLevels[2];
  return tierLevels[3];
}

export function MemberTierScreen({ onBack }: { onBack: () => void }) {
  const { darkMode } = usePreferenceContext();
  const count = associatedElectricians.length;
  const currentTier = useMemo(() => getTier(count), [count]);
  const pulse = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -8, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    floatLoop.start();
    return () => {
      pulseLoop.stop();
      floatLoop.stop();
    };
  }, [floatY, pulse]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.78],
  });

  return (
    <View style={[styles.screen, darkMode ? styles.screenDark : null]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, darkMode ? styles.backBtnDark : null]} onPress={onBack} activeOpacity={0.85}>
          <BackIcon color={darkMode ? '#F8FAFC' : '#173E80'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, darkMode ? styles.headerTitleDark : null]}>Member Tier</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateY: floatY }] }}>
          <LinearGradient colors={currentTier.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <Animated.View style={[styles.heroGlow, { opacity: glowOpacity, backgroundColor: currentTier.soft }]} />
            <View style={[styles.heroIconWrap, { backgroundColor: '#FFFFFFCC' }]}>
              <TierIcon tier={currentTier.tier} size={34} />
            </View>
            <Text style={[styles.heroEyebrow, { color: currentTier.accent }]}>Current Dealer Level</Text>
            <Text style={styles.heroTitle}>{currentTier.tier}</Text>
            <Text style={styles.heroSub}>
              You have {count} connected electricians. Your current grading is based on the size of your active dealer network.
            </Text>
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatValue}>{count}</Text>
                <Text style={styles.heroStatLabel}>Connected electricians</Text>
              </View>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatValue}>{currentTier.range}</Text>
                <Text style={styles.heroStatLabel}>Tier range</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={[styles.sectionCard, darkMode ? styles.sectionCardDark : null]}>
          <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>Grading system</Text>
          {tierLevels.map((level, index) => {
            const active = level.tier === currentTier.tier;
            return (
              <LinearGradient
                key={level.tier}
                colors={active ? level.gradient : ['#FFFFFF', '#FFFFFF', '#F8FAFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.tierRow, active ? [styles.tierRowActive, { borderColor: level.accent }] : styles.tierRowIdle]}
              >
                <View style={[styles.tierIconHolder, { backgroundColor: level.soft }]}>
                  <TierIcon tier={level.tier} />
                </View>
                <View style={styles.tierCopy}>
                  <View style={styles.tierTitleRow}>
                    <Text style={[styles.tierName, { color: active ? level.accent : '#17324D' }]}>{level.tier}</Text>
                    {active ? <Text style={[styles.currentChip, { color: level.accent, backgroundColor: level.soft }]}>Current</Text> : null}
                  </View>
                  <Text style={[styles.tierRange, darkMode ? styles.tierRangeDark : null]}>{level.range}</Text>
                  <Text style={[styles.tierDetail, darkMode ? styles.tierDetailDark : null]}>{level.detail}</Text>
                </View>
              </LinearGradient>
            );
          })}
        </View>

        <View style={[styles.sectionCard, darkMode ? styles.sectionCardDark : null]}>
          <Text style={[styles.sectionTitle, darkMode ? styles.sectionTitleDark : null]}>How dealer level works</Text>
          <View style={styles.pointRow}>
            <View style={[styles.pointDot, { backgroundColor: '#CBD5E1' }]} />
            <Text style={[styles.pointText, darkMode ? styles.pointTextDark : null]}>Level is calculated from total electricians added in your dealer network.</Text>
          </View>
          <View style={styles.pointRow}>
            <View style={[styles.pointDot, { backgroundColor: '#FBBF24' }]} />
            <Text style={[styles.pointText, darkMode ? styles.pointTextDark : null]}>Each grade uses a different icon and color so status is easy to identify.</Text>
          </View>
          <View style={styles.pointRow}>
            <View style={[styles.pointDot, { backgroundColor: '#60A5FA' }]} />
            <Text style={[styles.pointText, darkMode ? styles.pointTextDark : null]}>As you add more electricians, your level updates automatically to the next tier.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF3F8' },
  screenDark: { backgroundColor: '#08111F' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  backBtnDark: { backgroundColor: '#111827', shadowColor: '#020617' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#17324D' },
  headerTitleDark: { color: '#F8FAFC' },
  headerSpacer: { width: 44 },
  content: { padding: 16, paddingTop: 6, gap: 16, paddingBottom: 34 },
  heroCard: { borderRadius: 30, overflow: 'hidden', padding: 22 },
  heroGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -26,
    right: -26,
  },
  heroIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroEyebrow: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#17324D' },
  heroSub: { marginTop: 8, fontSize: 14, lineHeight: 22, color: '#4F6482' },
  heroStatsRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  heroStatBox: { flex: 1, borderRadius: 20, backgroundColor: '#FFFFFFC7', padding: 14 },
  heroStatValue: { fontSize: 18, fontWeight: '900', color: '#17324D' },
  heroStatLabel: { fontSize: 11.5, lineHeight: 17, color: '#5D7391', marginTop: 4, fontWeight: '700' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  sectionCardDark: { backgroundColor: '#111827', shadowColor: '#020617' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#17324D', marginBottom: 14 },
  sectionTitleDark: { color: '#F8FAFC' },
  tierRow: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.4,
    marginBottom: 12,
  },
  tierRowActive: { shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 },
  tierRowIdle: { borderColor: '#E2E8F0' },
  tierIconHolder: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tierCopy: { flex: 1 },
  tierTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  tierName: { fontSize: 16, fontWeight: '900' },
  currentChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, fontSize: 11, fontWeight: '800' },
  tierRange: { marginTop: 4, fontSize: 12, fontWeight: '800', color: '#52667F' },
  tierDetail: { marginTop: 6, fontSize: 12.5, lineHeight: 19, color: '#6A7E98' },
  tierRangeDark: { color: '#CBD5E1' },
  tierDetailDark: { color: '#94A3B8' },
  pointRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  pointDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  pointText: { flex: 1, fontSize: 13.5, lineHeight: 21, color: '#52667F', fontWeight: '600' },
  pointTextDark: { color: '#94A3B8' },
});
