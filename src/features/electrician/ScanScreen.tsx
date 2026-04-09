import { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';

const Colors = {
  primary: '#E8453C',
  background: '#EEF0F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  success: '#22c55e',
};

type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';

function FlashlightIcon({ size = 22, color = Colors.textDark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2h12v4l-2 2H8L6 6V2z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M8 8l-2 13h12L16 8H8z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx="12" cy="16" r="2" stroke={color} strokeWidth={1.6} />
      <Path d="M10 2V1M14 2V1" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function GalleryIcon({ size = 22, color = Colors.textDark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth={1.8} />
      <Circle cx="8.5" cy="8.5" r="1.5" stroke={color} strokeWidth={1.5} />
      <Path d="M3 16l5-5 4 4 3-3 6 5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon({ size = 22, color = Colors.textDark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="14" rx="3" stroke={color} strokeWidth={1.8} />
      <Path d="M8 6l1.2-2h5.6L16 6" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function BackArrowIcon({ size = 20, color = Colors.textDark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6M9 12h10" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// â”€â”€ Real QR Code â€” fetched from quickchart.io free API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// URL: https://quickchart.io/qr?text=SRV-MCB-32A&size=400&margin=2&dark=000000&light=ffffff
// Returns a real PNG QR image â€” black dots on white, proper finder patterns
function RealQRCode({ size = 200 }: { size?: number }) {
  const px = Math.round(size * 2); // 2x for crisp rendering on high-DPI
  const uri = `https://quickchart.io/qr?text=SRV-MCB-32A-2024&size=${px}&margin=2&dark=000000&light=ffffff`;

  return (
    <View style={{ width: size, height: size, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', padding: 4 }}>
      <Image
        source={{ uri }}
        style={{ width: size - 8, height: size - 8 }}
        resizeMode="contain"
      />
    </View>
  );
}

export function ScanScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { darkMode, tx } = usePreferenceContext();
  const { width } = useWindowDimensions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const frameSize = Math.min(width - 64, 260);

  const laserY = useRef(new Animated.Value(0)).current;
  const laserOpacity = useRef(new Animated.Value(0.3)).current;
  const cornerOpacity = useRef(new Animated.Value(0.7)).current;
  const cornerScale = useRef(new Animated.Value(1)).current;
  const frameGlow = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const laserLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const cornerLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startLaser = (fast: boolean) => {
    laserLoopRef.current?.stop();
    const dur = fast ? 1100 : 2000;
    laserLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(laserY, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(laserY, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    laserLoopRef.current.start();
  };

  const startCornerIdle = () => {
    cornerLoopRef.current?.stop();
    cornerLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(cornerOpacity, { toValue: 0.35, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(cornerScale, { toValue: 0.97, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(cornerOpacity, { toValue: 0.9, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(cornerScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    cornerLoopRef.current.start();
  };

  const startCornerFast = () => {
    cornerLoopRef.current?.stop();
    cornerLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(cornerOpacity, { toValue: 0.25, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(cornerScale, { toValue: 0.94, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(cornerOpacity, { toValue: 1, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(cornerScale, { toValue: 1, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    cornerLoopRef.current.start();
  };

  useEffect(() => {
    startLaser(false);
    startCornerIdle();
    return () => {
      laserLoopRef.current?.stop();
      cornerLoopRef.current?.stop();
      glowLoopRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (scanning) {
      startLaser(true);
      startCornerFast();
      Animated.timing(laserOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      glowLoopRef.current?.stop();
      glowLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(frameGlow, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.timing(frameGlow, { toValue: 0, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        ])
      );
      glowLoopRef.current.start();
    } else if (!scanned) {
      startLaser(false);
      startCornerIdle();
      Animated.timing(laserOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }).start();
      glowLoopRef.current?.stop();
      frameGlow.setValue(0);
    }
  }, [scanning]);

  useEffect(() => {
    if (scanned) {
      laserLoopRef.current?.stop();
      cornerLoopRef.current?.stop();
      glowLoopRef.current?.stop();
      frameGlow.setValue(0);
      Animated.timing(laserOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      successScale.setValue(0.3);
      successOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      successScale.setValue(0);
      successOpacity.setValue(0);
    }
  }, [scanned]);

  const startScan = () => {
    setSelectedImage(null);
    setScanned(false);
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); }, 3000);
  };

  const handleOpenCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(tx('Permission needed'), tx('Camera access allow karo taaki aap QR scan kar sako.'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setSelectedImage(result.assets[0].uri);
    setScanned(false);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1800);
  };

  const handlePickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(tx('Permission needed'), tx('Gallery access allow karo taaki aap QR image select kar sako.'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setSelectedImage(result.assets[0].uri);
    setScanned(false);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1800);
  };

  const laserTranslate = laserY.interpolate({ inputRange: [0, 1], outputRange: [0, frameSize - 10] });
  const frameBorderColor = frameGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(232,69,60,0.3)', 'rgba(232,69,60,0.9)'],
  });

  const qrSize = frameSize - 32;

  return (
    <View style={[styles.root, darkMode ? styles.rootDark : null]}>
      <View style={[styles.header, darkMode ? styles.headerDark : null]}>
        <Pressable onPress={() => onNavigate('home')} style={[styles.backBtn, darkMode ? styles.backBtnDark : null]}>
          <BackArrowIcon color={darkMode ? '#F8FAFC' : Colors.textDark} />
        </Pressable>
        <Text style={[styles.headerTitle, darkMode ? styles.headerTitleDark : null]}>{tx('Scan QR Code')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, darkMode ? styles.subtitleDark : null]}>{tx('Point camera at the QR sticker\non any SRV product box')}</Text>

        <View style={styles.frameWrap}>
          <Animated.View
            style={[styles.frame, darkMode ? styles.frameDark : null, { width: frameSize, height: frameSize, borderColor: frameBorderColor, borderWidth: 2 }]}
          >
            <View style={[StyleSheet.absoluteFill, styles.frameInner, darkMode ? styles.frameInnerDark : null]} />

            {!scanned && (
              <View style={styles.qrCenter}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={{ width: qrSize, height: qrSize, borderRadius: 12 }} resizeMode="cover" />
                ) : (
                  <RealQRCode size={qrSize} />
                )}
              </View>
            )}

            <Animated.View
              style={[styles.laser, { width: frameSize - 28, opacity: laserOpacity, transform: [{ translateY: laserTranslate }] }]}
            />
            <Animated.View
              style={[styles.laserGlow, { width: frameSize - 28, opacity: laserOpacity, transform: [{ translateY: laserTranslate }] }]}
            />

            {scanned && (
              <Animated.View style={[styles.successOverlay, { transform: [{ scale: successScale }], opacity: successOpacity }]}>
                <Text style={styles.checkmark}>âœ…</Text>
                <Text style={styles.verifiedText}>{tx('Verify')}</Text>
              </Animated.View>
            )}

            <Animated.View
              style={[StyleSheet.absoluteFill, { opacity: cornerOpacity, transform: [{ scale: cornerScale }] }]}
              pointerEvents="none"
            >
              <View style={[styles.corner, styles.cTL]} />
              <View style={[styles.corner, styles.cTR]} />
              <View style={[styles.corner, styles.cBL]} />
              <View style={[styles.corner, styles.cBR]} />
            </Animated.View>
          </Animated.View>

          <View style={styles.statusRow}>
            {scanning && (<><View style={styles.statusDot} /><Text style={styles.statusActive}>{tx('Scanning...')}</Text></>)}
            {!scanning && !scanned && <Text style={[styles.statusIdle, darkMode ? styles.statusIdleDark : null]}>{tx('Align QR code within the frame')}</Text>}
            {scanned && <Text style={styles.statusSuccess}>{"\u2713"} {tx('QR Code detected')}</Text>}
          </View>
        </View>

        {scanned && (
          <Animated.View style={[styles.successBox, darkMode ? styles.successBoxDark : null, { transform: [{ scale: successScale }], opacity: successOpacity }]}>
            <Text style={styles.successTitle}>{"\u2705"} {tx('SRV MCB 32A detected')}</Text>
            <Text style={[styles.successSub, darkMode ? styles.successSubDark : null]}>{tx('You earned +80 reward points.')}</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          onPress={scanned ? () => onNavigate('home') : handleOpenCamera}
          disabled={scanning}
          style={[styles.primaryBtn, scanning && styles.primaryBtnDisabled]}
          activeOpacity={0.85}
        >
          {!scanned ? <CameraIcon size={20} color="#FFFFFF" /> : null}
          <Text style={styles.primaryBtnText}>
            {scanned ? tx('Claim Points & Continue') : scanning ? tx('Scanning...') : tx('Start Scanning')}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <Pressable style={[styles.secondaryAction, darkMode ? styles.secondaryActionDark : null]}>
            <FlashlightIcon size={20} color={darkMode ? '#F8FAFC' : Colors.textDark} />
            <Text style={[styles.secondaryActionText, darkMode ? styles.secondaryActionTextDark : null]}>{tx('Flashlight')}</Text>
          </Pressable>
          <Pressable style={[styles.secondaryAction, darkMode ? styles.secondaryActionDark : null]} onPress={handlePickFromGallery}>
            <GalleryIcon size={20} color={darkMode ? '#F8FAFC' : Colors.textDark} />
            <Text style={[styles.secondaryActionText, darkMode ? styles.secondaryActionTextDark : null]}>{tx('Gallery')}</Text>
          </Pressable>
        </View>

        <View style={[styles.howCard, darkMode ? styles.howCardDark : null]}>
          <Text style={[styles.howTitle, darkMode ? styles.howTitleDark : null]}>{tx('How to Scan')}</Text>
          {[
            { step: '1', text: 'Look for the QR code sticker on your SRV product box.' },
            { step: '2', text: 'Place the code inside the frame and keep the phone steady.' },
            { step: '3', text: 'Claim the points and continue to your dashboard.' },
          ].map((item) => (
            <View key={item.step} style={styles.howRow}>
              <View style={styles.howIndex}><Text style={styles.howIndexText}>{item.step}</Text></View>
              <Text style={[styles.howText, darkMode ? styles.howTextDark : null]}>{tx(item.text)}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CORNER_LEN = 30;
const CORNER_THICK = 4;
const CORNER_RADIUS = 8;
const CORNER_OFFSET = 14;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  rootDark: { backgroundColor: '#08111F' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerDark: { backgroundColor: '#0F172A', borderBottomColor: '#243043' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F2F3F7', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  backBtnDark: { backgroundColor: '#182133', borderColor: '#243043' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  headerTitleDark: { color: '#F8FAFC' },
  scroll: { flex: 1 },
  content: { alignItems: 'center', padding: 20, gap: 16 },
  subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 21 },
  subtitleDark: { color: '#94A3B8' },
  frameWrap: { alignItems: 'center', gap: 14, marginTop: 4 },
  frame: { borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  frameInner: { backgroundColor: '#FFFFFF', borderRadius: 24 },
  frameDark: { backgroundColor: '#111827' },
  frameInnerDark: { backgroundColor: '#111827' },
  qrCenter: { alignItems: 'center', justifyContent: 'center' },
  laser: {
    position: 'absolute', top: CORNER_OFFSET, left: CORNER_OFFSET, height: 3, borderRadius: 3,
    backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 8,
  },
  laserGlow: { position: 'absolute', top: CORNER_OFFSET - 7, left: CORNER_OFFSET, height: 18, borderRadius: 9, backgroundColor: Colors.primary, opacity: 0.18 },
  corner: { position: 'absolute', width: CORNER_LEN, height: CORNER_LEN },
  cTL: { top: CORNER_OFFSET, left: CORNER_OFFSET, borderTopWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK, borderColor: Colors.primary, borderTopLeftRadius: CORNER_RADIUS },
  cTR: { top: CORNER_OFFSET, right: CORNER_OFFSET, borderTopWidth: CORNER_THICK, borderRightWidth: CORNER_THICK, borderColor: Colors.primary, borderTopRightRadius: CORNER_RADIUS },
  cBL: { bottom: CORNER_OFFSET, left: CORNER_OFFSET, borderBottomWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK, borderColor: Colors.primary, borderBottomLeftRadius: CORNER_RADIUS },
  cBR: { bottom: CORNER_OFFSET, right: CORNER_OFFSET, borderBottomWidth: CORNER_THICK, borderRightWidth: CORNER_THICK, borderColor: Colors.primary, borderBottomRightRadius: CORNER_RADIUS },
  successOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 },
  checkmark: { fontSize: 52 },
  verifiedText: { fontSize: 18, fontWeight: '800', color: Colors.success },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 22 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  statusActive: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  statusIdle: { fontSize: 13, color: Colors.textMuted },
  statusIdleDark: { color: '#94A3B8' },
  statusSuccess: { fontSize: 14, fontWeight: '700', color: Colors.success },
  successBox: { width: '100%', padding: 16, borderRadius: 18, backgroundColor: '#E8FEF0', borderWidth: 1, borderColor: '#bbf7d0' },
  successTitle: { fontSize: 15, fontWeight: '800', color: Colors.success },
  successSub: { marginTop: 4, fontSize: 13, color: '#5E7A69' },
  successBoxDark: { backgroundColor: '#0F2A1C', borderColor: '#166534' },
  successSubDark: { color: '#BBF7D0' },
  primaryBtn: {
    width: '100%', backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 17, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  primaryBtnDisabled: { backgroundColor: '#C0C0CC', shadowOpacity: 0 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  secondaryAction: {
    flex: 1, minHeight: 54, borderRadius: 16, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  secondaryActionText: { color: Colors.textDark, fontSize: 13, fontWeight: '700' },
  secondaryActionDark: { backgroundColor: '#111827', borderColor: '#243043', shadowOpacity: 0 },
  secondaryActionTextDark: { color: '#F8FAFC' },
  howCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  howCardDark: { backgroundColor: '#111827', borderColor: '#243043' },
  howTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark, marginBottom: 4 },
  howTitleDark: { color: '#F8FAFC' },
  howRow: { flexDirection: 'row', gap: 14, marginTop: 16, alignItems: 'flex-start' },
  howIndex: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  howIndexText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  howText: { flex: 1, fontSize: 13, lineHeight: 20, color: Colors.textMuted },
  howTextDark: { color: '#94A3B8' },
});



