import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { featuredProducts } from '@/shared/data/mock';
import ProfileFlipCard from '@/features/electrician/ProfileFlipCard';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import type { Screen } from '@/shared/types/navigation';
import { associatedElectricians, dealerProfile } from './dealerData';

const logoImage = require('../../../assets/banners/srv-logo.jpeg');

function BellIcon({ color = '#10254A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 16.5V11a6 6 0 1112 0v5.5l1.2 1.2a.8.8 0 01-.57 1.36H5.37a.8.8 0 01-.57-1.36L6 16.5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function UserPlusIcon({ color = '#0F4BA8', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="8" r="3.2" stroke={color} strokeWidth={1.8} />
      <Path d="M4.6 18.5c1.1-2.3 3-3.6 5.4-3.6 2.3 0 4.2 1.2 5.4 3.6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M18 8v6M15 11h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function PhoneIcon({ color = '#A34A13', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7.2 4.8h2.4l1.1 3.4-1.5 1.5a14.8 14.8 0 005.1 5.1l1.5-1.5 3.4 1.1v2.4a1.5 1.5 0 01-1.5 1.5A14.9 14.9 0 014.2 6.3 1.5 1.5 0 015.7 4.8h1.5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}

function WalletIcon({ color = '#7A4D14', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2.4" stroke={color} strokeWidth={2} />
      <Path d="M15.5 11.5H21V16h-5.5a2.25 2.25 0 010-4.5z" stroke={color} strokeWidth={2} />
      <Circle cx="16.8" cy="13.75" r="1.05" fill={color} />
    </Svg>
  );
}

function TierBadgeIcon({ tier, size = 24 }: { tier: string; size?: number }) {
  const colorMap: Record<string, { ring: string; fill: string; accent: string }> = {
    Silver: { ring: '#94A3B8', fill: '#E2E8F0', accent: '#64748B' },
    Gold: { ring: '#D97706', fill: '#FEF3C7', accent: '#B45309' },
    Platinum: { ring: '#2563EB', fill: '#DBEAFE', accent: '#1D4ED8' },
    Diamond: { ring: '#0891B2', fill: '#CFFAFE', accent: '#0E7490' },
  };
  const palette = colorMap[tier] ?? colorMap.Gold;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" fill={palette.fill} stroke={palette.ring} strokeWidth={1.8} />
      <Path d="M12 5.8l1.9 3.85 4.25.62-3.07 3 0.72 4.23L12 15.6l-3.8 1.9.73-4.23-3.08-3 4.25-.62L12 5.8z" fill={palette.accent} />
    </Svg>
  );
}

function WhatsAppIcon({ color = '#1A8F58', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4.25A7.75 7.75 0 005.21 15.7L4 19.75l4.17-1.1A7.75 7.75 0 1012 4.25z" stroke={color} strokeWidth={1.9} strokeLinejoin="round" />
      <Path d="M9.15 8.95c.18-.4.39-.42.57-.42h.49c.15 0 .36.06.54.46.18.4.6 1.45.66 1.56.06.11.1.24.02.38-.08.15-.13.25-.25.38-.11.13-.24.29-.34.39-.11.11-.22.22-.09.42.13.2.58.95 1.25 1.54.86.76 1.58 1 1.8 1.1.22.1.35.09.48-.07.13-.16.54-.64.68-.86.14-.22.29-.18.48-.11.2.07 1.24.59 1.45.7.21.1.35.16.4.25.05.09.05.54-.13 1.04-.18.51-1.02.98-1.42 1.03-.37.06-.85.09-1.36-.07-.31-.1-.71-.23-1.23-.46-2.15-.94-3.56-3.16-3.67-3.32-.11-.16-.89-1.18-.89-2.25 0-1.07.56-1.6.76-1.82z" fill={color} />
    </Svg>
  );
}

function ChevronRight({ color = '#173E80', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M6 3.5L10.5 8 6 12.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FilterIcon({ color = '#173E80', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16M7 12h10M10 17h4" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Circle cx="9" cy="7" r="2" fill="#FFFFFF" stroke={color} strokeWidth={1.7} />
      <Circle cx="15" cy="12" r="2" fill="#FFFFFF" stroke={color} strokeWidth={1.7} />
      <Circle cx="12" cy="17" r="2" fill="#FFFFFF" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

function FeaturedProductImage({ uri, size }: { uri: string; size: number }) {
  const floatY = useRef(new Animated.Value(0)).current;
  const imgScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -7, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(imgScale, { toValue: 1.04, duration: 2100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(imgScale, { toValue: 1, duration: 2100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );

    floatLoop.start();
    scaleLoop.start();
    return () => {
      floatLoop.stop();
      scaleLoop.stop();
    };
  }, [floatY, imgScale]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ translateY: floatY }, { scale: imgScale }] }}>
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

function FeaturedCard({
  title,
  subtitle,
  image,
  width,
  accent,
  badge,
  onPress,
}: {
  title: string;
  subtitle: string;
  image: string;
  width: number;
  accent: readonly [string, string, string];
  badge: string;
  onPress: () => void;
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const tilt = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, tension: 115, friction: 8 }),
      Animated.spring(tilt, { toValue: 1, useNativeDriver: true, tension: 115, friction: 8 }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 115, friction: 8 }),
      Animated.spring(tilt, { toValue: 0, useNativeDriver: true, tension: 115, friction: 8 }),
    ]).start();
  };

  const rotateY = tilt.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '4deg'] });

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.productCard,
          {
            width,
            transform: [{ scale: pressScale }, { perspective: 900 }, { rotateY }],
          },
        ]}
      >
        <LinearGradient colors={accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.productImageWrap}>
          <View style={styles.productBadge}>
            <Text style={styles.productBadgeText}>{badge}</Text>
          </View>
          <View style={styles.productShine} />
          <FeaturedProductImage uri={image} size={width + 6} />
        </LinearGradient>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.productSub} numberOfLines={2}>{subtitle}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function getTier(count: number) {
  if (count <= 100) {
    return {
      tier: 'Silver',
      nextAt: 101,
      gradient: ['#EEF2F7', '#DDE4ED', '#CFD6E0'] as [string, string, string],
      accent: '#64748B',
      chip: '#F8FAFC',
    };
  }
  if (count <= 300) {
    return {
      tier: 'Gold',
      nextAt: 301,
      gradient: ['#FFF4D8', '#FFE6A8', '#FFD375'] as [string, string, string],
      accent: '#B45309',
      chip: '#FFF8E6',
    };
  }
  if (count <= 500) {
    return {
      tier: 'Platinum',
      nextAt: 501,
      gradient: ['#E9F0F8', '#D3E0EF', '#B7CADF'] as [string, string, string],
      accent: '#1D4ED8',
      chip: '#EFF6FF',
    };
  }
  return {
    tier: 'Diamond',
    nextAt: null,
    gradient: ['#EAF4FF', '#CEE7FF', '#9FCEFF'] as [string, string, string],
    accent: '#0E7490',
    chip: '#ECFEFF',
  };
}

export function HomeScreen({
  onNavigate,
  onOpenProductCategory,
  profilePhotoUri,
}: {
  onNavigate: (screen: Screen) => void;
  onOpenProductCategory: (category: string) => void;
  profilePhotoUri?: string | null;
}) {
  const { darkMode } = usePreferenceContext();
  const { width } = useWindowDimensions();
  const statPulse = useRef(new Animated.Value(1)).current;
  const connectedCount = associatedElectricians.length;
  const tier = useMemo(() => getTier(connectedCount), [connectedCount]);
  const cardW = (width - 28 - 12) / 2;
  const productFilters = ['All', 'Boxes', 'Fans'] as const;
  const [selectedFilter, setSelectedFilter] = useState<(typeof productFilters)[number]>('All');

  const filteredProducts = useMemo(() => {
    const items = featuredProducts.slice(0, 6);
    if (selectedFilter === 'Boxes') {
      return items.filter((product) => {
        const source = `${product.name} ${product.description}`.toLowerCase();
        return source.includes('box');
      });
    }
    if (selectedFilter === 'Fans') {
      return items.filter((product) => {
        const source = `${product.name} ${product.description}`.toLowerCase();
        return source.includes('fan');
      });
    }
    return items;
  }, [selectedFilter]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(statPulse, { toValue: 1.03, duration: 1300, useNativeDriver: true }),
        Animated.timing(statPulse, { toValue: 1, duration: 1300, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [statPulse]);

  const quickActions = [
    {
      title: 'Associate Electrician',
      sub: `${connectedCount} connected`,
      icon: UserPlusIcon,
      iconColors: ['#E8F1FF', '#CFE0FF'] as const,
      iconTint: '#0F4BA8',
      onPress: () => onNavigate('electricians'),
    },
    {
      title: 'Wallet',
      sub: 'Payout and history',
      icon: WalletIcon,
      iconColors: ['#FFF3DB', '#FFE1B0'] as const,
      iconTint: '#9A5A0E',
      onPress: () => onNavigate('wallet'),
    },
    {
      title: 'Call Electrician',
      sub: 'Reach your network',
      icon: PhoneIcon,
      iconColors: ['#FFF0EA', '#FFD2C4'] as const,
      iconTint: '#B14B16',
      onPress: () => onNavigate('call_electrician'),
    },
    {
      title: 'WhatsApp',
      sub: 'Business support',
      icon: WhatsAppIcon,
      iconColors: ['#E8FFF1', '#C6F3D8'] as const,
      iconTint: '#1A8F58',
      onPress: () => Linking.openURL('https://wa.me/918837684004?text=Hello%20SRV%20Team,%20I%20need%20dealer%20support'),
    },
  ];

  return (
    <ScrollView style={[styles.screen, darkMode ? styles.screenDark : null]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#EDF4FF', '#E3EEFF', '#F8F4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroShell}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />

        <View style={styles.topRow}>
          <View style={styles.logoWrap}>
            <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
          </View>
          <TouchableOpacity onPress={() => onNavigate('notification')} style={styles.topActionBtn} activeOpacity={0.85}>
            <BellIcon color="#C2410C" />
          </TouchableOpacity>
        </View>

        <ProfileFlipCard profile={dealerProfile} role="dealer" photoUri={profilePhotoUri} />

        <View style={styles.statRow}>
          <Animated.View style={[styles.statCardWrap, { transform: [{ scale: statPulse }] }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => onNavigate('call_electrician')}>
              <LinearGradient colors={['#E8F1FF', '#D7E7FF', '#CEE0FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
                <Text style={styles.statLabel}>Call Electrician</Text>
                <Text style={styles.statValue}>{connectedCount} contacts</Text>
                <Text style={styles.statHint}>Open phone and WhatsApp actions</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.statCardWrap, { transform: [{ scale: statPulse }] }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => onNavigate('dealer_tier')}>
              <LinearGradient colors={tier.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
                <View style={[styles.tierIconChip, { backgroundColor: tier.chip }]}>
                  <TierBadgeIcon tier={tier.tier} size={20} />
                </View>
                <Text style={styles.statLabel}>Member Tier</Text>
                <View style={styles.tierTextStack}>
                  <Text style={styles.statValue}>{tier.tier}</Text>
                  <Text style={styles.statHint}>
                    {tier.nextAt ? `${tier.nextAt - connectedCount} more electricians for next grade` : 'Top dealer grade unlocked'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.quickGrid}>
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={item.title} style={[styles.quickCard, darkMode ? styles.quickCardDark : null, { width: cardW }]} onPress={item.onPress} activeOpacity={0.9}>
                <LinearGradient colors={item.iconColors} style={styles.quickIconBox}>
                  <Icon color={item.iconTint} size={24} />
                </LinearGradient>
                <Text style={styles.quickTitle}>{item.title}</Text>
                <Text style={styles.quickSub}>{item.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Catalog</Text>
            <Text style={styles.sectionTitle}>Featured products</Text>
          </View>
        </View>

        <View style={styles.productsTopBar}>
          <View style={styles.filterRow}>
            {productFilters.map((filter) => {
              const active = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  activeOpacity={0.86}
                >
                  {filter === 'All' ? <FilterIcon color={active ? '#FFFFFF' : '#173E80'} size={15} /> : null}
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => onNavigate('product')} style={styles.inlineAction} activeOpacity={0.85}>
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {filteredProducts.map((product, index) => (
            <FeaturedCard
              key={product.id}
              title={product.name}
              subtitle={product.description}
              image={product.image}
              width={cardW}
              accent={
                index % 3 === 0
                  ? ['#FFF8EA', '#FDE7C3', '#F8D78F']
                  : index % 3 === 1
                    ? ['#F2F8FF', '#D9EFFF', '#B8DDFF']
                    : ['#FAF2FF', '#E9D5FF', '#D8B4FE']
              }
              badge={index % 2 === 0 ? 'Top Pick' : 'Hot Deal'}
              onPress={() => onOpenProductCategory('fanbox')}
            />
          ))}
        </View>

        <View style={[styles.activityCard, darkMode ? styles.activityCardDark : null]}>
          <Text style={styles.activityTitle}>Dealer Growth</Text>
          <Text style={styles.activityCopy}>
            Dealer network is growing steadily with {connectedCount} associated electricians. Use the electricians page to manage and expand your dealer network.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF3F8' },
  screenDark: { backgroundColor: '#08111F' },
  heroShell: {
    paddingTop: 26,
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroGlowOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(59,130,246,0.16)',
    top: -60,
    right: -35,
  },
  heroGlowTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245,158,11,0.12)',
    bottom: 20,
    left: -24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  logoImage: { width: 64, height: 64 },
  topActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  statCardWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  statCard: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 96,
    justifyContent: 'center',
  },
  statLabel: { color: '#5C6F91', fontSize: 10, fontWeight: '700', marginBottom: 5 },
  statValue: { color: '#13294B', fontSize: 16, fontWeight: '900' },
  statHint: { color: '#6F819D', fontSize: 10.5, marginTop: 1, lineHeight: 14 },
  tierIconChip: { position: 'absolute', top: 10, right: 12, width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tierTextStack: { marginTop: -1, paddingRight: 28 },
  body: { paddingHorizontal: 14, paddingTop: 18 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 22 },
  quickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },
  quickCardDark: {
    backgroundColor: '#111827',
    shadowColor: '#020617',
  },
  quickIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  quickTitle: { color: '#152238', fontSize: 14, fontWeight: '800' },
  quickSub: { color: '#74829D', fontSize: 11.5, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionEyebrow: { color: '#7D8AA5', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 5 },
  sectionTitle: { color: '#14213D', fontSize: 21, fontWeight: '900' },
  productsTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E3F0',
  },
  filterChipActive: {
    backgroundColor: '#173E80',
    borderColor: '#173E80',
  },
  filterChipText: { color: '#173E80', fontSize: 11.5, fontWeight: '800' },
  filterChipTextActive: { color: '#FFFFFF' },
  inlineAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { color: '#173E80', fontSize: 13, fontWeight: '800' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6ECF5',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  productImageWrap: {
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(19,41,75,0.84)',
  },
  productBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  productShine: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.26)',
    top: -34,
    right: -22,
  },
  productInfo: { padding: 13 },
  productTitle: { color: '#152238', fontSize: 13, fontWeight: '800' },
  productSub: { color: '#70819C', fontSize: 11, marginTop: 4, lineHeight: 16 },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
  },
  activityCardDark: {
    backgroundColor: '#111827',
  },
  activityTitle: { color: '#173E80', fontSize: 16, fontWeight: '900' },
  activityCopy: { color: '#70819C', fontSize: 12.5, lineHeight: 19, marginTop: 8 },
});

