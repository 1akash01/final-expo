import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const Colors = {
  primary: '#E8453C',
  primaryLight: '#FFF0F0',
  background: '#F2F3F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  success: '#22c55e',
  gold: '#F59E0B',
};

const defaultProfile = {
  name: 'Harshvardhan',
  phone: '9162038214',
  email: '',
  state: 'Punjab',
  city: 'Mansa',
  pincode: '151505',
  address: 'YOUR+PC8, Green Valley',
  gstHolderName: 'Harshvardhan',
  gstNumber: 'BIBPB7675A',
  panHolderName: '',
  panNumber: '',
  dealerCode: '215548',
};

type Profile = typeof defaultProfile;
type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';

const menuItems = [
  { label: 'My Redemption', icon: 'MR', bg: Colors.primaryLight, screen: 'wallet' as Screen },
  { label: 'Gift Store', icon: 'GS', bg: '#FFF8E1', screen: 'rewards' as Screen },
  { label: 'Transfer Points', icon: 'TP', bg: Colors.primaryLight, screen: null },
  { label: 'My Orders', icon: 'MO', bg: Colors.primaryLight, screen: null },
  { label: 'Bank Details', icon: 'BD', bg: '#FFF8E1', screen: null },
  { label: 'Refer To A Friend', icon: 'RF', bg: '#EFF6FF', screen: null },
  { label: 'Need Help', icon: 'NH', bg: '#E6FDF0', screen: null },
  { label: 'Offers', icon: 'OF', bg: '#FFF8E1', screen: null },
];

const settingsItems = [
  { label: 'Notifications', icon: 'NT', bg: '#FFF8E1', badge: true },
  { label: 'App Settings', icon: 'AS', bg: '#F3F0FF', badge: false },
  { label: 'Scan History', icon: 'SH', bg: Colors.primaryLight, badge: false },
  { label: 'Contact Support', icon: 'CS', bg: '#E6FDF0', badge: false },
];

function PinIcon({ color = '#1C1E2E', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21s6-5.33 6-11a6 6 0 10-12 0c0 5.67 6 11 6 11z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="10" r="2.2" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function PencilIcon({ color = '#1C1E2E', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20l4.2-1 9-9a2.1 2.1 0 10-3-3l-9 9L4 20z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M13 7l4 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function StarIcon({ color = '#92400E', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l2.8 5.68 6.27.91-4.53 4.42 1.07 6.25L12 17.27 6.39 20.26l1.07-6.25L2.93 9.6l6.27-.91L12 3z" fill={color} />
    </Svg>
  );
}

function LogoutIcon({ color = '#E8453C', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 17l5-5-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 12H4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M20 4v16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MenuIcon({ kind, color = '#1C1E2E', size = 18 }: { kind: string; color?: string; size?: number }) {
  switch (kind) {
    case 'MR':
    case 'GS':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="8" width="18" height="4" rx="1.2" stroke={color} strokeWidth={1.8} />
          <Path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" stroke={color} strokeWidth={1.8} />
          <Path d="M12 8v13M12 8C12 8 9 6 9 4.5a3 3 0 016 0C15 6 12 8 12 8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'TP':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 7h10M7 7l3-3M7 7l3 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M17 17H7m10 0l-3-3m3 3l-3 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'MO':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 6h15l-1.4 7.2a2 2 0 01-2 1.6H9a2 2 0 01-2-1.6L5.5 4H3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="10" cy="19" r="1.5" fill={color} />
          <Circle cx="17" cy="19" r="1.5" fill={color} />
        </Svg>
      );
    case 'BD':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="6" width="18" height="12" rx="2.2" stroke={color} strokeWidth={1.8} />
          <Path d="M3 10h18" stroke={color} strokeWidth={1.8} />
          <Rect x="6" y="13" width="5" height="2" rx="1" fill={color} />
        </Svg>
      );
    case 'RF':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="9" cy="9" r="3" stroke={color} strokeWidth={1.8} />
          <Circle cx="17" cy="10" r="2.5" stroke={color} strokeWidth={1.8} />
          <Path d="M4.5 19c1.2-2.5 3.3-3.8 5.7-3.8 2.4 0 4.5 1.3 5.7 3.8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    case 'NH':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
          <Path d="M9.7 9.2a2.8 2.8 0 015.1 1.6c0 1.9-2.1 2.4-2.8 3.7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx="12" cy="17.2" r="1" fill={color} />
        </Svg>
      );
    case 'OF':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 12l-8 8-8-8 8-8 8 8z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
          <Circle cx="12" cy="12" r="2" fill={color} />
        </Svg>
      );
    case 'NT':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 16.5V11a6 6 0 1112 0v5.5l1.2 1.2a.8.8 0 01-.57 1.36H5.37a.8.8 0 01-.57-1.36L6 16.5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
          <Path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    case 'AS':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth={1.8} />
          <Path d="M19 12a7 7 0 00-.1-1l2-1.6-2-3.5-2.4 1a7 7 0 00-1.7-1L14.5 3h-5L9 5.9a7 7 0 00-1.7 1l-2.4-1-2 3.5 2 1.6a7 7 0 000 2.1l-2 1.6 2 3.5 2.4-1a7 7 0 001.7 1l.5 2.9h5l.5-2.9a7 7 0 001.7-1l2.4 1 2-3.5-2-1.6c.07-.34.1-.68.1-1z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
        </Svg>
      );
    case 'SH':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
          <Rect x="14" y="4" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
          <Rect x="4" y="14" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
          <Path d="M14 14h2v2h-2zM18 14h2v6h-6v-2h4v-4z" fill={color} />
        </Svg>
      );
    case 'CS':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 15a3 3 0 01-3 3H9l-5 3V7a3 3 0 013-3h10a3 3 0 013 3v8z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
          <Path d="M9 10h6M9 14h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    default:
      return <Circle cx="12" cy="12" r="4" fill={color} />;
  }
}

export function ProfileScreen({ onNavigate, onSignOut }: { onNavigate: (screen: Screen) => void; onSignOut: () => void }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const initials = useMemo(
    () => profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    [profile.name]
  );

  const saveProfile = () => {
    setProfile(draft);
    setShowEdit(false);
  };

  const confirmSignOut = () => {
    setShowSignOutConfirm(false);
    onSignOut();
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
              <View style={styles.levelBadge}><Text style={styles.levelText}>L3</Text></View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profilePhone}>{profile.phone}</Text>
              <Text style={styles.profileDealer}>Dealer: {profile.dealerCode}</Text>
              <View style={styles.inlineRow}>
                <PinIcon size={13} color={Colors.textMuted} />
                <Text style={styles.profileCity}>{profile.city}, {profile.state}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => { setDraft(profile); setShowEdit(true); }} style={styles.editBtn}>
              <PencilIcon size={15} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.goldMemberRow}>
            <View style={styles.inlineRowStrong}>
              <StarIcon />
              <Text style={styles.goldMemberText}>Gold Member</Text>
            </View>
            <Text style={styles.goldHint}>750 pts to Platinum {'>'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeadRow}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <TouchableOpacity onPress={() => { setDraft(profile); setShowEdit(true); }} style={styles.editChip}>
              <PencilIcon size={13} color={Colors.primary} />
              <Text style={styles.editChipText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.kycBanner}>
            <StarIcon size={13} color="#B45309" />
            <View style={{ flex: 1 }}>
              <Text style={styles.kycTitle}>Complete KYC to unlock all features</Text>
              <Text style={styles.kycSub}>Add PAN & GST details to get verified</Text>
            </View>
          </View>
          {[
            ['Mobile Number', profile.phone],
            ['Email ID', profile.email || 'Not provided'],
            ['State', profile.state],
            ['City', profile.city],
            ['Pincode', profile.pincode],
            ['Address', profile.address],
            ['GST Holder Name', profile.gstHolderName],
            ['GST Number', profile.gstNumber],
            ['PAN Holder Name', profile.panHolderName || 'Not provided'],
            ['PAN Number', profile.panNumber || 'Not provided'],
            ['Dealer Code', profile.dealerCode],
          ].map(([label, value], i, arr) => (
            <View key={label} style={[styles.detailRow, i < arr.length - 1 && styles.detailBorder]}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={[styles.detailValue, !value.trim() && styles.detailValueEmpty]}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => item.screen && onNavigate(item.screen)}
              style={[styles.menuRow, i < menuItems.length - 1 && styles.menuRowBorder]}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                <MenuIcon kind={item.icon} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.card}>
          {settingsItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, i < settingsItems.length - 1 && styles.menuRowBorder]}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                <MenuIcon kind={item.icon} />
                {item.badge && <View style={styles.notifDot} />}
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.inlineRowStrongSpace}>
            <StarIcon size={13} color="#FFFFFF" />
            <Text style={styles.statsTitle}>Your Stats</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: 'rgba(232,69,60,0.18)' }]}>
              <Text style={[styles.statValue, { color: Colors.primary }]}>24</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: 'rgba(245,158,11,0.18)' }]}>
              <Text style={[styles.statValue, { color: Colors.gold }]}>4,250</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: 'rgba(34,197,94,0.18)' }]}>
              <Text style={[styles.statValue, { color: Colors.success }]}>6</Text>
              <Text style={styles.statLabel}>Rewards</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowSignOutConfirm(true)} activeOpacity={0.8}>
          <LogoutIcon />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={showSignOutConfirm} animationType="fade" transparent onRequestClose={() => setShowSignOutConfirm(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <LogoutIcon size={22} />
            </View>
            <Text style={styles.confirmTitle}>Sign Out?</Text>
            <Text style={styles.confirmSub}>Are you sure you want to sign out?{"\n"}Your data will be saved.</Text>
            <View style={styles.confirmActions}>
              <Pressable onPress={() => setShowSignOutConfirm(false)} style={styles.confirmCancel}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={confirmSignOut} style={styles.confirmSignOut}>
                <Text style={styles.confirmSignOutText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEdit} animationType="slide" transparent onRequestClose={() => setShowEdit(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                ['Full Name', 'name'], ['Phone Number', 'phone'], ['Email', 'email'],
                ['City', 'city'], ['State', 'state'], ['Pincode', 'pincode'],
                ['Address', 'address'], ['GST Holder Name', 'gstHolderName'],
                ['GST Number', 'gstNumber'], ['PAN Holder Name', 'panHolderName'],
                ['PAN Number', 'panNumber'], ['Dealer Code', 'dealerCode'],
              ].map(([label, key]) => (
                <View key={key} style={styles.modalField}>
                  <Text style={styles.modalLabel}>{label}</Text>
                  <TextInput
                    value={draft[key as keyof Profile]}
                    onChangeText={(v) => setDraft((c) => ({ ...c, [key]: v }))}
                    placeholder={label}
                    placeholderTextColor="#AA9A90"
                    style={styles.modalInput}
                  />
                </View>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowEdit(false)} style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveProfile} style={styles.modalPrimary}>
                <Text style={styles.modalPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 120 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark, textAlign: 'center' },
  profileCard: { backgroundColor: Colors.surface, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  levelBadge: { position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  levelText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  profileName: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  profilePhone: { fontSize: 13, color: Colors.textMuted, marginTop: 3 },
  profileDealer: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  profileCity: { fontSize: 12, color: Colors.textMuted },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  inlineRowStrong: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineRowStrongSpace: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  goldMemberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#FEF3C7' },
  goldMemberText: { fontSize: 14, fontWeight: '800', color: '#92400E' },
  goldHint: { fontSize: 12, color: '#92400E', fontWeight: '600' },
  card: { backgroundColor: Colors.surface, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: Colors.textDark, paddingLeft: 2 },
  editChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primaryLight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  editChipText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  kycBanner: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7', borderRadius: 14, padding: 12, marginBottom: 14 },
  kycTitle: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  kycSub: { fontSize: 12, color: '#B45309', marginTop: 2 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5FB' },
  detailLabel: { fontSize: 13, color: Colors.textMuted, flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '700', color: Colors.textDark, flex: 1, textAlign: 'right' },
  detailValueEmpty: { color: Colors.textMuted, fontStyle: 'italic', fontWeight: '400' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5FB' },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, borderWidth: 1.5, borderColor: '#fff' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textDark },
  menuArrow: { fontSize: 20, color: '#C0C0D0', fontWeight: '700' },
  statsCard: { backgroundColor: '#2D3561', borderRadius: 22, padding: 20 },
  statsTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontWeight: '600' },
  signOutBtn: { backgroundColor: Colors.surface, borderRadius: 18, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: Colors.border },
  signOutText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(28,30,46,0.5)' },
  confirmCard: { backgroundColor: '#fff', borderRadius: 28, padding: 28, marginHorizontal: 32, alignItems: 'center', width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  confirmIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  confirmTitle: { fontSize: 20, fontWeight: '900', color: Colors.textDark, marginBottom: 8 },
  confirmSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  confirmActions: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmCancel: { flex: 1, height: 50, borderRadius: 16, backgroundColor: '#F3E9E1', alignItems: 'center', justifyContent: 'center' },
  confirmCancelText: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  confirmSignOut: { flex: 1, height: 50, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  confirmSignOutText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(28,30,46,0.4)' },
  modalCard: { maxHeight: '88%', backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: Colors.textDark, marginBottom: 16 },
  modalField: { marginBottom: 14 },
  modalLabel: { marginBottom: 7, fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  modalInput: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFF9F4', paddingHorizontal: 14, fontSize: 14, color: Colors.textDark },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalSecondary: { flex: 1, minHeight: 52, borderRadius: 16, backgroundColor: '#F3E9E1', alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  modalPrimary: { flex: 1, minHeight: 52, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
