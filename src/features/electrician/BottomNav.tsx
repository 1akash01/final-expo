import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import { colors } from '@/shared/theme/colors';
import type { Screen } from '@/shared/types/navigation';

// ── Icons ─────────────────────────────────────────────────────────────

function HomeIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        fill={color === colors.primary ? colors.primary + '22' : 'none'}
      />
      <Path
        d="M9 21V12h6v9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ProductIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function WalletIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2.4" stroke={color} strokeWidth={2} />
      <Path
        d="M15.5 11.5H21V16h-5.5a2.25 2.25 0 010-4.5z"
        stroke={color}
        strokeWidth={2}
      />
      <Circle cx="16.8" cy="13.75" r="1.05" fill={color} />
      <Path d="M7 6V4.8A1.8 1.8 0 018.8 3h7.7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ProfileIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.2" r="3.5" stroke={color} strokeWidth={2} />
      <Path
        d="M5 19.2c1.52-3.02 4.12-4.53 7-4.53 2.88 0 5.48 1.5 7 4.53"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ScanQRIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      {/* Top-left finder */}
      <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth={2} />
      <Rect x="5.5" y="5.5" width="2" height="2" fill="white" />
      {/* Top-right finder */}
      <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth={2} />
      <Rect x="16.5" y="5.5" width="2" height="2" fill="white" />
      {/* Bottom-left finder */}
      <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth={2} />
      <Rect x="5.5" y="16.5" width="2" height="2" fill="white" />
      {/* Bottom-right data cells */}
      <Rect x="14" y="14" width="3" height="3" rx={0.6} fill="white" />
      <Rect x="18" y="14" width="3" height="3" rx={0.6} fill="white" />
      <Rect x="14" y="18" width="3" height="3" rx={0.6} fill="white" />
      <Rect x="18" y="18" width="3" height="3" rx={0.6} fill="white" />
    </Svg>
  );
}

// ── Scan Button ───────────────────────────────────────────────────────

function ScanButton({ isActive, onPress }: { isActive: boolean; onPress: () => void }) {
  const { tx } = usePreferenceContext();
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.5)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.3)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const makeRingAnim = (
      scale: Animated.Value,
      opacity: Animated.Value,
      delay: number
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1.4,
              duration: 900,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
          ]),
          Animated.delay(200),
        ])
      );

    makeRingAnim(ring1Scale, ring1Opacity, 0).start();
    makeRingAnim(ring2Scale, ring2Opacity, 450).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.87, duration: 80, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 200, friction: 7, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <View style={scanStyles.wrapper}>
      {/* Pulse rings */}
      <Animated.View
        style={[
          scanStyles.ring,
          { transform: [{ scale: ring1Scale }], opacity: ring1Opacity },
        ]}
      />
      <Animated.View
        style={[
          scanStyles.ring,
          { transform: [{ scale: ring2Scale }], opacity: ring2Opacity },
        ]}
      />

      <Pressable onPress={handlePress} style={scanStyles.pressArea}>
        <Animated.View
          style={[scanStyles.btn, { transform: [{ scale: btnScale }] }]}
        >
          <ScanQRIcon />
        </Animated.View>
      </Pressable>

      <Text style={[scanStyles.label, isActive && scanStyles.labelActive]}>
        {tx('SCAN')}
      </Text>
    </View>
  );
}

const scanStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 72,
  },
  ring: {
    position: 'absolute',
    top: -22,
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    zIndex: 0,
  },
  pressArea: {
    marginTop: -20,
    marginBottom: 5,
    zIndex: 1,
  },
  btn: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9E9189',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  labelActive: {
    color: colors.primary,
  },
});

// ── Nav Tab ───────────────────────────────────────────────────────────

function NavTab({
  id,
  label,
  active,
  onPress,
}: {
  id: Screen;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const iconColor = active ? colors.primary : '#A89A91';
  const tabScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(tabScale, { toValue: 0.82, duration: 70, useNativeDriver: true }),
      Animated.spring(tabScale, { toValue: 1, tension: 200, friction: 7, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const renderIcon = () => {
    switch (id) {
      case 'home':    return <HomeIcon color={iconColor} />;
      case 'product': return <ProductIcon color={iconColor} />;
      case 'wallet': return <WalletIcon color={iconColor} />;
      case 'profile': return <ProfileIcon color={iconColor} />;
      default:        return null;
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.tab}>
      <Animated.View
        style={[styles.iconWrap, { transform: [{ scale: tabScale }] }]}
      >
        {renderIcon()}
      </Animated.View>
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ── BottomNav ─────────────────────────────────────────────────────────

const LEFT: Array<{ id: Screen; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'product', label: 'Product' },
];

const RIGHT: Array<{ id: Screen; label: string }> = [
  { id: 'wallet', label: 'Wallet' },
  { id: 'profile', label: 'Profile' },
];

export function BottomNav({
  currentScreen,
  onNavigate,
}: {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  const { darkMode, tx } = usePreferenceContext();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.wrap,
        darkMode ? styles.wrapDark : null,
        { marginBottom: -insets.bottom, paddingBottom: 14 + insets.bottom },
      ]}
    >
      <View style={styles.side}>
        {LEFT.map((item) => (
          <NavTab
            key={item.id}
            id={item.id}
            label={tx(item.label)}
            active={currentScreen === item.id}
            onPress={() => onNavigate(item.id)}
          />
        ))}
      </View>

      <ScanButton
        isActive={currentScreen === 'scan'}
        onPress={() => onNavigate('scan')}
      />

      <View style={styles.side}>
        {RIGHT.map((item) => (
          <NavTab
            key={item.id}
            id={item.id}
            label={tx(item.label)}
            active={currentScreen === item.id}
            onPress={() => onNavigate(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FFFDFC',
    borderTopWidth: 1,
    borderTopColor: '#EEEEF3',
    shadowColor: '#6F4C3A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  wrapDark: {
    backgroundColor: '#0F172A',
    borderTopColor: '#243043',
    shadowColor: '#020617',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    gap: 3,
    minWidth: 50,
    minHeight: 48,
    justifyContent: 'flex-end',
  },
  iconWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A89A91',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});




