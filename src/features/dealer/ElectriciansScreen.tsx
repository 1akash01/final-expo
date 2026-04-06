import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { Screen } from '@/shared/types/navigation';

type ElectricianStatus = 'Active' | 'Pending';

type Electrician = {
  id: string;
  name: string;
  phone: string;
  city: string;
  joinedAt: string;
  totalScans: number;
  points: number;
  status: ElectricianStatus;
};

const DEMO_OTP = '2468';

const seedElectricians: Electrician[] = [
  { id: 'el-101', name: 'Harshvardhan', phone: '9162038214', city: 'Mansa, Punjab', joinedAt: 'Connected today', totalScans: 24, points: 4250, status: 'Active' },
  { id: 'el-102', name: 'Rohit Kumar', phone: '9876543210', city: 'Bathinda, Punjab', joinedAt: 'Connected 3 days ago', totalScans: 18, points: 2870, status: 'Active' },
  { id: 'el-103', name: 'Aman Sharma', phone: '9810012345', city: 'Ludhiana, Punjab', joinedAt: 'Invite pending', totalScans: 0, points: 0, status: 'Pending' },
];

function TeamIcon({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="8" cy="9" r="2.7" stroke={color} strokeWidth={1.9} />
      <Circle cx="16.5" cy="8.2" r="2.2" stroke={color} strokeWidth={1.9} />
      <Path d="M4.6 18.3c1.02-2.37 3.02-3.75 5.53-3.75 2.49 0 4.46 1.28 5.54 3.75" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M15.4 16.15c.62-1.32 1.82-2.1 3.27-2.1 1.05 0 2 .36 2.86 1.08" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function BoltIcon({ color = '#194A9C', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12.5 3L6.5 12H11L10.5 21L17.5 10.5H13L12.5 3Z" fill={color} />
    </Svg>
  );
}

function PlusIcon({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={2.1} strokeLinecap="round" />
    </Svg>
  );
}

function SearchIcon({ color = '#789', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={1.8} />
      <Path d="M16 16L20 20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function HomeIcon({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M9 21V12h6v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldIcon({ color = '#1A8F58', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l7 3v5c0 5.1-3.2 8.8-7 10-3.8-1.2-7-4.9-7-10V6l7-3z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M9.2 12.3l1.9 1.9 3.9-4.1" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: [string, string, string];
}) {
  return (
    <LinearGradient colors={accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </LinearGradient>
  );
}

export function ElectriciansScreen({ onNavigate }: { onNavigate?: (screen: Screen) => void }) {
  const [electricians, setElectricians] = useState<Electrician[]>(seedElectricians);
  const [query, setQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const heroFloat = useRef(new Animated.Value(0)).current;
  const homeBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, { toValue: -8, duration: 1800, useNativeDriver: true }),
        Animated.timing(heroFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [heroFloat]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return electricians;
    return electricians.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.phone.includes(term) ||
      item.city.toLowerCase().includes(term)
    );
  }, [electricians, query]);

  const activeCount = electricians.filter((item) => item.status === 'Active').length;
  const pendingCount = electricians.filter((item) => item.status === 'Pending').length;
  const totalPoints = electricians.reduce((sum, item) => sum + item.points, 0);
  const cleanPhone = newPhone.replace(/\D/g, '').slice(0, 10);
  const canRequestOtp = cleanPhone.length === 10 && !phoneVerified;
  const canVerifyOtp = otpRequested && otp.length === 4 && !phoneVerified;
  const canAddElectrician =
    newName.trim().length >= 3 &&
    cleanPhone.length === 10 &&
    newCity.trim().length >= 2 &&
    phoneVerified;

  const resetForm = () => {
    setNewName('');
    setNewPhone('');
    setNewCity('');
    setOtp('');
    setOtpRequested(false);
    setPhoneVerified(false);
  };

  const handlePhoneChange = (value: string) => {
    const nextPhone = value.replace(/\D/g, '').slice(0, 10);
    setNewPhone(nextPhone);
    setOtp('');
    setOtpRequested(false);
    setPhoneVerified(false);
  };

  const handleRequestOtp = () => {
    if (!canRequestOtp) return;
    setOtpRequested(true);
    setPhoneVerified(false);
    setOtp('');
  };

  const handleVerifyOtp = () => {
    if (!canVerifyOtp) return;
    if (otp !== DEMO_OTP) {
      Alert.alert('Invalid OTP', 'Please enter the correct 4-digit OTP to verify the phone number.');
      return;
    }
    setPhoneVerified(true);
  };

  const handleAddElectrician = () => {
    if (!canAddElectrician) return;

    setElectricians((current) => [
      {
        id: `el-${Date.now()}`,
        name: newName.trim(),
        phone: cleanPhone,
        city: newCity.trim(),
        joinedAt: 'Added just now',
        totalScans: 0,
        points: 0,
        status: 'Active',
      },
      ...current,
    ]);
    resetForm();
    setShowAddModal(false);
  };

  const handleHomePressIn = () => {
    Animated.timing(homeBtnScale, {
      toValue: 0.9,
      duration: 90,
      useNativeDriver: true,
    }).start();
  };

  const handleHomePressOut = () => {
    Animated.spring(homeBtnScale, {
      toValue: 1,
      tension: 180,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#143A7B', '#275CC0', '#63A4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
          <View style={styles.heroGlowOne} />
          <View style={styles.heroGlowTwo} />
          <Animated.View style={[styles.homeButtonFloat, { transform: [{ scale: homeBtnScale }] }]}>
            <TouchableOpacity
              style={styles.homeBackButton}
              onPress={() => onNavigate?.('home')}
              onPressIn={handleHomePressIn}
              onPressOut={handleHomePressOut}
              activeOpacity={0.9}
            >
              <View style={styles.homeBackIcon}>
                <HomeIcon size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.heroTopRow}>
            <View />
            <Animated.View style={[styles.heroIconWrap, { transform: [{ translateY: heroFloat }] }]}>
              <TeamIcon size={28} />
            </Animated.View>
          </View>
          <Text style={styles.heroEyebrow}>Dealer Network</Text>
          <Text style={styles.heroTitle}>Connected electricians</Text>
          <Text style={styles.heroSub}>
            Dealers can review every connected electrician here and add new electricians to their network from the same page.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => {
              resetForm();
              setShowAddModal(true);
            }}
            activeOpacity={0.9}
          >
            <PlusIcon />
            <Text style={styles.heroButtonText}>Add Electrician</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatCard label="Active" value={`${activeCount}`} accent={['#E8F1FF', '#D4E4FF', '#C4DBFF']} />
          <StatCard label="Pending" value={`${pendingCount}`} accent={['#FFF4E6', '#FFE8C7', '#FFD89C']} />
          <StatCard label="Total Points" value={totalPoints.toLocaleString()} accent={['#EEFDF3', '#D7FAE3', '#B8F1CD']} />
        </View>

        <View style={styles.searchBox}>
          <SearchIcon color="#7E90A5" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name, phone, or city"
            placeholderTextColor="#97A4B3"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Electrician directory</Text>
          <Text style={styles.sectionSub}>{filtered.length} records</Text>
        </View>

        <View style={styles.listWrap}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.memberCard}>
              <View style={styles.memberTop}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>{item.name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberPhone}>+91 {item.phone}</Text>
                </View>
                <View style={[styles.statusPill, item.status === 'Active' ? styles.statusActive : styles.statusPending]}>
                  <Text style={[styles.statusText, item.status === 'Active' ? styles.statusTextActive : styles.statusTextPending]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                {/*
                <View style={styles.metaPill}>
                  <BoltIcon />
                  <Text style={styles.metaText}>{item.totalScans} scans</Text>
                </View>
                */}
                {/*
                <View style={styles.metaPill}>
                  <Text style={styles.metaPoints}>{item.points} pts</Text>
                </View>
                */}
              </View>

              <Text style={styles.memberCity}>{item.city}</Text>
              <Text style={styles.memberJoined}>{item.joinedAt}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 18 : 0}
            style={styles.modalKeyboard}
          >
            <View style={styles.modalCard}>
              <View style={styles.sheetHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add electrician</Text>
                <Text style={styles.modalSub}>
                  Verify the number first, then complete the remaining details.
                </Text>
              </View>
              <View style={styles.modalBody}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Electrician name</Text>
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Enter full name"
                    placeholderTextColor="#9A9FB1"
                    style={styles.fieldInput}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Electrician number</Text>
                  <View style={styles.phoneRow}>
                    <TextInput
                      value={newPhone}
                      onChangeText={handlePhoneChange}
                      keyboardType="phone-pad"
                      placeholder="10-digit mobile number"
                      placeholderTextColor="#9A9FB1"
                      style={[styles.fieldInput, styles.phoneInput]}
                    />
                    <Pressable
                      onPress={handleRequestOtp}
                      disabled={!canRequestOtp}
                      style={[styles.inlineButton, !canRequestOtp && styles.inlineButtonDisabled]}
                    >
                      <Text style={[styles.inlineButtonText, !canRequestOtp && styles.inlineButtonTextDisabled]}>
                        Verify
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {otpRequested ? (
                  <View style={styles.otpCard}>
                    <Text style={styles.otpInfo}>
                      OTP sent to +91 {cleanPhone}
                    </Text>
                    <Text style={styles.otpHint}>Demo OTP: {DEMO_OTP}</Text>
                    <View style={styles.fieldGroup}>
                      <TextInput
                        value={otp}
                        onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 4))}
                        keyboardType="numeric"
                        placeholder="Enter OTP"
                        placeholderTextColor="#9A9FB1"
                        style={styles.fieldInput}
                      />
                      <Pressable
                        onPress={handleVerifyOtp}
                        disabled={!canVerifyOtp}
                        style={[styles.blockButton, !canVerifyOtp && styles.inlineButtonDisabled]}
                      >
                        <Text style={[styles.inlineButtonText, !canVerifyOtp && styles.inlineButtonTextDisabled]}>
                          Confirm
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}

                {phoneVerified ? (
                  <View style={styles.verifiedRow}>
                    <ShieldIcon />
                    <Text style={styles.verifiedText}>Phone number verified successfully</Text>
                  </View>
                ) : null}

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput
                    value={newCity}
                    onChangeText={setNewCity}
                    placeholder="City or district"
                    placeholderTextColor="#9A9FB1"
                    style={styles.fieldInput}
                  />
                </View>

                <View style={styles.modalActions}>
                  <Pressable onPress={() => setShowAddModal(false)} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddElectrician}
                    disabled={!canAddElectrician}
                    style={[styles.primaryButton, !canAddElectrician && styles.primaryButtonDisabled]}
                  >
                    <Text style={styles.primaryButtonText}>Add Electrician</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F7FB' },
  content: { padding: 16, gap: 16, paddingBottom: 120 },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  homeButtonFloat: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 3,
  },
  homeBackButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  homeBackIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 30,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#163A6B',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroGlowOne: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.12)', top: -40, right: -20 },
  heroGlowTwo: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(151,202,255,0.24)', bottom: -20, left: -10 },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  heroEyebrow: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1 },
  heroTitle: { marginTop: 8, color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  heroSub: { marginTop: 8, color: 'rgba(255,255,255,0.84)', fontSize: 13, lineHeight: 20, maxWidth: '92%' },
  heroButton: {
    marginTop: 18,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heroButtonText: { color: '#17438E', fontSize: 13, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  statLabel: { fontSize: 11, color: '#5D6C82', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  statValue: { marginTop: 8, fontSize: 20, color: '#1B2D45', fontWeight: '900' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAF3',
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#20324A' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: '#1B2D45' },
  sectionSub: { fontSize: 12, fontWeight: '700', color: '#7990A8' },
  listWrap: { gap: 12 },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3EAF3',
    shadowColor: '#0F2747',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  memberTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: { color: '#17438E', fontSize: 20, fontWeight: '900' },
  memberName: { color: '#18283E', fontSize: 16, fontWeight: '800' },
  memberPhone: { marginTop: 2, color: '#7488A1', fontSize: 12.5 },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusActive: { backgroundColor: '#E8FFF0' },
  statusPending: { backgroundColor: '#FFF4E2' },
  statusText: { fontSize: 11, fontWeight: '800' },
  statusTextActive: { color: '#17834C' },
  statusTextPending: { color: '#C97910' },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F5F8FC',
  },
  metaText: { color: '#33527B', fontSize: 12, fontWeight: '700' },
  metaPoints: { color: '#17438E', fontSize: 12, fontWeight: '800' },
  memberCity: { marginTop: 12, color: '#263A56', fontSize: 13, fontWeight: '700' },
  memberJoined: { marginTop: 4, color: '#8597AC', fontSize: 12 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(12,26,49,0.38)' },
  modalKeyboard: { width: '100%' },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D4DDE8',
    marginTop: 10,
    marginBottom: 8,
  },
  modalHeader: {
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  modalBody: {
    paddingHorizontal: 18,
    paddingTop: 4,
    gap: 12,
    paddingBottom: 18,
  },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1C2E47' },
  modalSub: { color: '#6F859D', fontSize: 12, lineHeight: 17 },
  fieldGroup: { gap: 5 },
  fieldLabel: { fontSize: 11, color: '#7B8DA4', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  fieldInput: {
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDE6F1',
    backgroundColor: '#FBFDFF',
    paddingHorizontal: 14,
    color: '#1D3049',
    fontSize: 14,
  },
  phoneRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  phoneInput: { flex: 1 },
  inlineButton: {
    minWidth: 94,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17438E',
    paddingHorizontal: 14,
  },
  blockButton: {
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17438E',
  },
  inlineButtonDisabled: {
    backgroundColor: '#D7E1EE',
  },
  inlineButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  inlineButtonTextDisabled: {
    color: '#7F93A8',
  },
  otpCard: {
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#D8E7FF',
    gap: 6,
  },
  otpInfo: {
    color: '#3F5E86',
    fontSize: 12,
    lineHeight: 16,
  },
  otpHint: {
    color: '#17438E',
    fontSize: 12,
    fontWeight: '800',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#EAFBF2',
    borderWidth: 1,
    borderColor: '#C7F0D8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verifiedText: {
    color: '#1A8F58',
    fontSize: 13,
    fontWeight: '700',
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 2 },
  secondaryButton: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3F8',
  },
  secondaryButtonText: { color: '#40566F', fontSize: 15, fontWeight: '800' },
  primaryButton: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17438E',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D7E1EE',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});

