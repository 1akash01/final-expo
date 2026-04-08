import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import type { Screen } from '@/shared/types/navigation';

function HomeIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M9 21V12h6v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ProductIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function WalletIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2.4" stroke={color} strokeWidth={2} />
      <Path d="M15.5 11.5H21V16h-5.5a2.25 2.25 0 010-4.5z" stroke={color} strokeWidth={2} />
      <Circle cx="16.8" cy="13.75" r="1.05" fill={color} />
      <Path d="M7 6V4.8A1.8 1.8 0 018.8 3h7.7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ProfileIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.2" r="3.5" stroke={color} strokeWidth={2} />
      <Path d="M5 19.2c1.52-3.02 4.12-4.53 7-4.53 2.88 0 5.48 1.5 7 4.53" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ElectricianIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
      <Circle cx="8" cy="9" r="2.5" stroke="white" strokeWidth={1.8} />
      <Circle cx="16.5" cy="8" r="2" stroke="white" strokeWidth={1.8} />
      <Path d="M4.6 18.2c.9-2.2 2.8-3.6 5.2-3.6 2.3 0 4.2 1.2 5.2 3.6" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M15.5 16.2c.53-1.35 1.7-2.2 3.2-2.2 1.04 0 1.95.41 2.7 1.2" stroke="white" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function CenterButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.35)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.35, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.35, duration: 0, useNativeDriver: true }),
        ]),
        Animated.delay(200),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [ringOpacity, ringScale]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 180, friction: 7, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <View style={centerStyles.wrapper}>
      <Animated.View style={[centerStyles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
      <Pressable onPress={handlePress} style={centerStyles.pressArea}>
        <Animated.View style={[centerStyles.button, active && centerStyles.buttonActive, { transform: [{ scale: btnScale }] }]}>
          <ElectricianIcon />
        </Animated.View>
      </Pressable>
      <Text style={[centerStyles.label, active && centerStyles.labelActive]}>Electricians</Text>
    </View>
  );
}

const centerStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', width: 92 },
  ring: {
    position: 'absolute',
    top: -26,
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: '#194A9C',
  },
  pressArea: { marginTop: -24, marginBottom: 6, zIndex: 1 },
  button: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: '#275CC0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#275CC0',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  buttonActive: { backgroundColor: '#143B7A' },
  label: { fontSize: 10, fontWeight: '800', color: '#8FA1B7', marginTop: 1 },
  labelActive: { color: '#194A9C' },
});

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
  const iconColor = active ? '#194A9C' : '#97A5B6';
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.84, duration: 70, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 180, friction: 7, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const icon = (() => {
    switch (id) {
      case 'home':
        return <HomeIcon color={iconColor} />;
      case 'product':
        return <ProductIcon color={iconColor} />;
      case 'wallet':
        return <WalletIcon color={iconColor} />;
      case 'profile':
        return <ProfileIcon color={iconColor} />;
      default:
        return null;
    }
  })();

  return (
    <Pressable onPress={handlePress} style={styles.tab}>
      <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
        {icon}
      </Animated.View>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

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
  const { darkMode } = usePreferenceContext();
  return (
    <View style={[styles.wrap, darkMode ? styles.wrapDark : null]}>
      <View style={styles.side}>
        {LEFT.map((item) => (
          <NavTab key={item.id} id={item.id} label={item.label} active={currentScreen === item.id} onPress={() => onNavigate(item.id)} />
        ))}
      </View>

      <CenterButton active={currentScreen === 'electricians'} onPress={() => onNavigate('electricians')} />

      <View style={styles.side}>
        {RIGHT.map((item) => (
          <NavTab key={item.id} id={item.id} label={item.label} active={currentScreen === item.id} onPress={() => onNavigate(item.id)} />
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
    backgroundColor: '#FCFDFE',
    borderTopWidth: 1,
    borderTopColor: '#E6ECF4',
    shadowColor: '#27456A',
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
  side: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    gap: 3,
    minWidth: 50,
    minHeight: 48,
    justifyContent: 'flex-end',
  },
  iconWrap: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, fontWeight: '600', color: '#97A5B6' },
  labelActive: { color: '#194A9C', fontWeight: '800' },
});

