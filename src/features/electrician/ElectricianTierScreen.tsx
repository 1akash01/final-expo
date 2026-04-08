import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type ElectricianTierName = 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

type TierInfo = {
  tier: ElectricianTierName;
  range: string;
  accent: string;
  soft: string;
  gradient: [string, string, string];
  detail: string;
};

function BackIcon({ color = '#173E80', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ElectricianTierIcon({ tier, size = 26 }: { tier: ElectricianTierName; size?: number }) {
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
      <Path d="M12 3.7l5.4 3.8-1.7 6.2-3.7 2.7-3.7-2.7-1.7-6.2L12 3.7z" fill="#CFFAFE" stroke="#0891B2" strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M10 10.2l2-2.1 2 2.1-2 4.4-2-4.4z" fill="#0E7490" />
      <Rect x="9.2" y="16.2" width="5.6" height="1.8" rx="0.9" fill="#0E7490" />
    </Svg>
  );
}

const tierLevels: TierInfo[] = [
  {
    tier: 'Silver',
    range: '0 - 1000 points',
    accent: '#64748B',
    soft: '#E2E8F0',
    gradient: ['#F8FAFC', '#EEF2F7', '#E2E8F0'],
    detail: 'Starting level for electricians building up their first reward points.',
  },
  {
    tier: 'Gold',
    range: '1001 - 5000 points',
    accent: '#B45309',
    soft: '#FEF3C7',
    gradient: ['#FFF8E6', '#FEF0C7', '#FDE68A'],
    detail: 'Strong reward status with steady scanning and reward collection.',
  },
  {
    tier: 'Platinum',
    range: '5001 - 10000 points',
    accent: '#1D4ED8',
    soft: '#DBEAFE',
    gradient: ['#EFF6FF', '#DBEAFE', '#BFDBFE'],
    detail: 'Premium level for electricians with high reward point activity.',
  },
  {
    tier: 'Diamond',
    range: '10000+ points',
    accent: '#0E7490',
    soft: '#CFFAFE',
    gradient: ['#ECFEFF', '#CFFAFE', '#A5F3FC'],
    detail: 'Top elite reward level for electricians with the strongest point balance.',
  },
];

export function getElectricianTier(points: number): TierInfo {
  if (points <= 1000) return tierLevels[0];
  if (points <= 5000) return tierLevels[1];
  if (points <= 10000) return tierLevels[2];
  return tierLevels[3];
}

export function ElectricianTierScreen({ onBack }: { onBack: () => void }) {
  const points = 4250;
  const currentTier = useMemo(() => getElectricianTier(points), [points]);
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
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.85}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Tier</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateY: floatY }] }}>
          <LinearGradient colors={currentTier.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <Animated.View style={[styles.heroGlow, { opacity: glowOpacity, backgroundColor: currentTier.soft }]} />
            <View style={styles.heroIconWrap}>
              <ElectricianTierIcon tier={currentTier.tier} size={36} />
            </View>
            <Text style={[styles.heroEyebrow, { color: currentTier.accent }]}>Current Reward Level</Text>
            <Text style={styles.heroTitle}>{currentTier.tier}</Text>
            <Text style={styles.heroSub}>
              Your electrician grading is based on total reward points earned through scans and redemptions.
            </Text>
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatValue}>{points}</Text>
                <Text style={styles.heroStatLabel}>Current points</Text>
              </View>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatValue}>{currentTier.range}</Text>
                <Text style={styles.heroStatLabel}>Tier range</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Points grading system</Text>
          {tierLevels.map((level) => {
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
                  <ElectricianTierIcon tier={level.tier} />
                </View>
                <View style={styles.tierCopy}>
                  <View style={styles.tierTitleRow}>
                    <Text style={[styles.tierName, { color: active ? level.accent : '#17324D' }]}>{level.tier} Member</Text>
                    {active ? <Text style={[styles.currentChip, { color: level.accent, backgroundColor: level.soft }]}>Current</Text> : null}
                  </View>
                  <Text style={styles.tierRange}>{level.range}</Text>
                  <Text style={styles.tierDetail}>{level.detail}</Text>
                </View>
              </LinearGradient>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF3F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 4 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#17324D' },
  headerSpacer: { width: 44 },
  content: { padding: 16, paddingTop: 6, gap: 16, paddingBottom: 34 },
  heroCard: { borderRadius: 30, overflow: 'hidden', padding: 22 },
  heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, top: -26, right: -26 },
  heroIconWrap: { width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: '#FFFFFFCC' },
  heroEyebrow: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#17324D' },
  heroSub: { marginTop: 8, fontSize: 14, lineHeight: 22, color: '#4F6482' },
  heroStatsRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  heroStatBox: { flex: 1, borderRadius: 20, backgroundColor: '#FFFFFFC7', padding: 14 },
  heroStatValue: { fontSize: 18, fontWeight: '900', color: '#17324D' },
  heroStatLabel: { fontSize: 11.5, lineHeight: 17, color: '#5D7391', marginTop: 4, fontWeight: '700' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 18, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#17324D', marginBottom: 14 },
  tierRow: { flexDirection: 'row', gap: 14, borderRadius: 22, padding: 14, borderWidth: 1.4, marginBottom: 12 },
  tierRowActive: { shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 },
  tierRowIdle: { borderColor: '#E2E8F0' },
  tierIconHolder: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tierCopy: { flex: 1 },
  tierTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  tierName: { fontSize: 16, fontWeight: '900' },
  currentChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, fontSize: 11, fontWeight: '800' },
  tierRange: { marginTop: 4, fontSize: 12, fontWeight: '800', color: '#52667F' },
  tierDetail: { marginTop: 6, fontSize: 12.5, lineHeight: 19, color: '#6A7E98' },
});
