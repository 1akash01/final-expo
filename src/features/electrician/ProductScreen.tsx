import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Path, Rect, Circle, Ellipse, Line, G, Polygon,
} from 'react-native-svg';
import { usePreferenceContext } from '@/features/profile/ProfileShared';
import type { AppLanguage } from '@/features/profile/ProfileShared';

const Colors = {
  primary: '#E8453C',
  background: '#F2F3F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
};

const CAT_COLORS: Record<string, { gradient: [string, string, string]; scanBg: string; scanText: string; cardGradient: [string, string, string]; iconBg: string }> = {
  fanbox:       { gradient: ['#C84E1B', '#E87820', '#F6B94B'], scanBg: '#FFF3E0', scanText: '#D2641A', cardGradient: ['#FFF8EA', '#FDE7C3', '#F8D78F'], iconBg: '#FFE0B2' },
  concealedbox: { gradient: ['#0E4AA8', '#1E88E5', '#6CC5FF'], scanBg: '#E3F2FD', scanText: '#1565C0', cardGradient: ['#F2F8FF', '#D9EFFF', '#B8DDFF'], iconBg: '#BBDEFB' },
  modular:      { gradient: ['#5B178B', '#8E37B9', '#D08AF8'], scanBg: '#F3E5F5', scanText: '#6A1B9A', cardGradient: ['#FAF2FF', '#E9D5FF', '#D8B4FE'], iconBg: '#E1BEE7' },
  mcb:          { gradient: ['#005B4F', '#15937D', '#4DD2BC'], scanBg: '#E0F2F1', scanText: '#00695C', cardGradient: ['#ECFFFA', '#CFF7EE', '#A7ECE0'], iconBg: '#B2DFDB' },
  busbar:       { gradient: ['#971616', '#D92D20', '#FF7A59'], scanBg: '#FFEBEE', scanText: '#B71C1C', cardGradient: ['#FFF4F2', '#FFD9D2', '#FFB5A7'], iconBg: '#FFCDD2' },
  exhaust:      { gradient: ['#045A8D', '#0284C7', '#67D4FF'], scanBg: '#E1F5FE', scanText: '#0277BD', cardGradient: ['#F0FBFF', '#D2F4FF', '#AFE8FF'], iconBg: '#B3E5FC' },
  led:          { gradient: ['#C24A00', '#FF8F00', '#FFD54F'], scanBg: '#FFF8E1', scanText: '#E65100', cardGradient: ['#FFFCEF', '#FFEFC2', '#FFDF8A'], iconBg: '#FFE082' },
  changeover:   { gradient: ['#1F2937', '#475569', '#94A3B8'], scanBg: '#ECEFF1', scanText: '#37474F', cardGradient: ['#F8FAFC', '#E2E8F0', '#CBD5E1'], iconBg: '#CFD8DC' },
  mainswitch:   { gradient: ['#3B0764', '#7B1FA2', '#D946EF'], scanBg: '#EDE7F6', scanText: '#6B21A8', cardGradient: ['#FBF5FF', '#E9D5FF', '#D8B4FE'], iconBg: '#CE93D8' },
  louver:       { gradient: ['#14532D', '#2F855A', '#86EFAC'], scanBg: '#E8F5E9', scanText: '#1B5E20', cardGradient: ['#F3FFF5', '#DCFCE7', '#BBF7D0'], iconBg: '#A5D6A7' },
};

// ── Real SVG Category Icons ───────────────────────────────────────────
function CatIcon({ id, size = 28, color = '#fff' }: { id: string; size?: number; color?: string }) {
  const s = size;
  switch (id) {
    case 'fanbox':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="4" y="8" width="24" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M4 13h24" stroke={color} strokeWidth="2" />
          <Circle cx="16" cy="21" r="3" stroke={color} strokeWidth="1.8" />
          <Path d="M16 16v2M16 24v2M11 21h2M21 21h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M12 8V6a4 4 0 018 0v2" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'concealedbox':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="3" y="3" width="26" height="26" rx="4" stroke={color} strokeWidth="2" />
          <Rect x="8" y="8" width="16" height="16" rx="2" stroke={color} strokeWidth="1.8" strokeDasharray="3 2" />
          <Circle cx="16" cy="16" r="3" stroke={color} strokeWidth="1.8" />
          <Path d="M16 11v2M16 19v2M11 16h2M19 16h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      );
    case 'modular':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="3" y="3" width="12" height="12" rx="2.5" stroke={color} strokeWidth="2" />
          <Rect x="17" y="3" width="12" height="12" rx="2.5" stroke={color} strokeWidth="2" />
          <Rect x="3" y="17" width="12" height="12" rx="2.5" stroke={color} strokeWidth="2" />
          <Rect x="17" y="17" width="12" height="12" rx="2.5" stroke={color} strokeWidth="2" />
          <Circle cx="9" cy="9" r="2" stroke={color} strokeWidth="1.5" />
          <Circle cx="23" cy="9" r="2" stroke={color} strokeWidth="1.5" />
          <Circle cx="9" cy="23" r="2" stroke={color} strokeWidth="1.5" />
          <Circle cx="23" cy="23" r="2" stroke={color} strokeWidth="1.5" />
        </Svg>
      );
    case 'mcb':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="5" y="3" width="22" height="26" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="9" y="7" width="6" height="8" rx="1.5" stroke={color} strokeWidth="1.6" />
          <Rect x="17" y="7" width="6" height="8" rx="1.5" stroke={color} strokeWidth="1.6" />
          <Path d="M9 20h14M9 23h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M14 7V5M18 7V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      );
    case 'busbar':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="3" y="5" width="26" height="22" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M3 12h26M3 20h26" stroke={color} strokeWidth="1.8" />
          <Path d="M9 5v5M16 5v5M23 5v5M9 20v7M16 20v7M23 20v7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <Rect x="7" y="13.5" width="4" height="5" rx="1" stroke={color} strokeWidth="1.4" />
          <Rect x="14" y="13.5" width="4" height="5" rx="1" stroke={color} strokeWidth="1.4" />
          <Rect x="21" y="13.5" width="4" height="5" rx="1" stroke={color} strokeWidth="1.4" />
        </Svg>
      );
    case 'exhaust':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" />
          <Circle cx="16" cy="16" r="3" stroke={color} strokeWidth="1.8" />
          <Path d="M16 13c0-4 3-6 3-6s-1 4-3 6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M19 16c4 0 6 3 6 3s-4-1-6-3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M16 19c0 4-3 6-3 6s1-4 3-6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M13 16c-4 0-6-3-6-3s4 1 6 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </Svg>
      );
    case 'led':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Path d="M16 4a8 8 0 018 8c0 3-1.5 5.5-4 7v3H12v-3c-2.5-1.5-4-4-4-7a8 8 0 018-8z" stroke={color} strokeWidth="2" />
          <Path d="M12 22h8M13 25h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M16 28v1" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M8 12H6M24 12h2M10 6.5L8.5 5M22 6.5l1.5-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Circle cx="16" cy="12" r="3" stroke={color} strokeWidth="1.5" />
        </Svg>
      );
    case 'changeover':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="3" y="4" width="26" height="24" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M10 14l6-6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M22 18l-6 6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M16 8v16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        </Svg>
      );
    case 'mainswitch':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="5" y="4" width="22" height="24" rx="3" stroke={color} strokeWidth="2" />
          <Circle cx="16" cy="13" r="5" stroke={color} strokeWidth="2" />
          <Path d="M16 10v3l2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9 22h14M11 25h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      );
    case 'louver':
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <Rect x="3" y="3" width="26" height="26" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M6 10h20" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M6 16h20" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M6 22h20" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M6 10c4 2 10 2 20 0M6 16c4 2 10 2 20 0M6 22c4 2 10 2 20 0" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </Svg>
      );
    default:
      return <Text style={{ fontSize: s * 0.8 }}>📦</Text>;
  }
}

// ── Modern Camera / QR Scan Icon SVG ─────────────────────────────────
function ScanIcon({ size = 16, color = '#E87820' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Camera body */}
      <Rect x="2" y="6" width="20" height="15" rx="3" stroke={color} strokeWidth="1.8" />
      {/* Lens outer */}
      <Circle cx="12" cy="13.5" r="4" stroke={color} strokeWidth="1.8" />
      {/* Lens inner */}
      <Circle cx="12" cy="13.5" r="1.8" fill={color} />
      {/* Flash bump */}
      <Path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Top right indicator dot */}
      <Circle cx="18.5" cy="9.5" r="1" fill={color} />
    </Svg>
  );
}

function FilterIcon({ size = 18, color = '#1C1E2E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16M7 12h10M10 17h4" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <Circle cx="9" cy="7" r="1.8" fill="#fff" stroke={color} strokeWidth="1.6" />
      <Circle cx="15" cy="12" r="1.8" fill="#fff" stroke={color} strokeWidth="1.6" />
      <Circle cx="12" cy="17" r="1.8" fill="#fff" stroke={color} strokeWidth="1.6" />
    </Svg>
  );
}

const categories = [
  { id: 'fanbox',       label: 'Fan Box',       count: 6 },
  { id: 'concealedbox', label: 'Concealed Box', count: 5 },
  { id: 'modular',      label: 'Modular Box',   count: 6 },
  { id: 'mcb',          label: 'MCB DB',        count: 6 },
  { id: 'busbar',       label: 'Bus Bar',       count: 5 },
  { id: 'exhaust',      label: 'Exhaust Fan',   count: 5 },
  { id: 'led',          label: 'LED Lights',    count: 4 },
  { id: 'changeover',   label: 'Changeover',    count: 3 },
  { id: 'mainswitch',   label: 'Main Switch',   count: 3 },
  { id: 'louver',       label: 'Louvers',       count: 3 },
];

const CDN = 'https://srvelectricals.com/cdn/shop/files/';

// ── Typed product list (badge as string | null explicitly) ────────────
type Product = {
  id: string;
  category: string;
  name: string;
  sub: string;
  img: string;
  points: number;
  badge: string | null;
};

const allProducts: Product[] = [
  // Fan Box
  { id: 'fb1', category: 'fanbox', name: 'FAN BOX 3"', sub: 'F8/FC/FDB — 18/40, 22/28 PC', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 10, badge: 'Popular' },
  { id: 'fb2', category: 'fanbox', name: 'FAN BOX 4"', sub: 'FC 4" — 17/30, 20/40 PC', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 12, badge: null },
  { id: 'fb3', category: 'fanbox', name: 'FAN BOX 2.5"', sub: 'FC 2.5" — 20/50 PC', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 8, badge: null },
  { id: 'fb4', category: 'fanbox', name: 'FAN BOX HEAVY', sub: 'HD Series — 25/50 PC', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 15, badge: 'New' },
  { id: 'fb5', category: 'fanbox', name: 'FAN BOX DELUXE', sub: 'Deluxe 3.5" — 20/40 PC', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 11, badge: null },
  { id: 'fb6', category: 'fanbox', name: 'FAN REGULATOR', sub: 'FRB Series with Clip Lock', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 9, badge: null },
  // Concealed Box
  { id: 'cb1', category: 'concealedbox', name: 'CONCEALED 3"', sub: 'CRD PL 3" Precision Range', img: `${CDN}CRD_PL_3.png?v=1757426566&width=300`, points: 15, badge: 'New' },
  { id: 'cb2', category: 'concealedbox', name: 'CONCEALED 4"', sub: 'CRD PL 4" Precision Range', img: `${CDN}CRD_PL_3.png?v=1757426566&width=300`, points: 18, badge: null },
  { id: 'cb3', category: 'concealedbox', name: 'CONCEALED 2.5"', sub: 'CRD 2.5" Standard Range', img: `${CDN}CRD_PL_3.png?v=1757426566&width=300`, points: 12, badge: null },
  { id: 'cb4', category: 'concealedbox', name: 'CONCEALED 4.5"', sub: 'Deep 4.5" Heavy Wiring', img: `${CDN}CRD_PL_3.png?v=1757426566&width=300`, points: 20, badge: 'Popular' },
  { id: 'cb5', category: 'concealedbox', name: 'OCTAGONAL BOX', sub: 'Round / Octagonal Shape', img: `${CDN}CRD_PL_3.png?v=1757426566&width=300`, points: 14, badge: null },
  // Modular Box
  { id: 'mb1', category: 'modular', name: 'MODULE PLATINUM', sub: 'Platinum 3×3 Range', img: `${CDN}3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300`, points: 25, badge: 'Popular' },
  { id: 'mb2', category: 'modular', name: 'MODULE GOLD', sub: 'Gold 3×3 Series', img: `${CDN}3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300`, points: 20, badge: null },
  { id: 'mb3', category: 'modular', name: 'MODULE SUPER', sub: 'Super Range Multi Size', img: `${CDN}3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300`, points: 18, badge: null },
  { id: 'mb4', category: 'modular', name: 'MODULE ZINC 2×4', sub: 'Zinc Die Cast — 2×4', img: `${CDN}3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300`, points: 22, badge: 'New' },
  { id: 'mb5', category: 'modular', name: 'MODULE 4×4 GI', sub: 'Large 4×4 GI Sheet Range', img: `${CDN}3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300`, points: 28, badge: null },
  { id: 'mb6', category: 'modular', name: 'MODULE 2×4 PREMIUM', sub: 'Compact 2×4 Premium', img: `${CDN}3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300`, points: 16, badge: null },
  // MCB DB
  { id: 'mc1', category: 'mcb', name: 'SPN SD MCB BOX', sub: 'Single Door 4/6/8 Way', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 30, badge: 'Popular' },
  { id: 'mc2', category: 'mcb', name: 'SPN DD MCB BOX', sub: 'Double Door Draw Type', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 35, badge: null },
  { id: 'mc3', category: 'mcb', name: 'NOVA SPN DD BOX', sub: 'Nova Series Double Door', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 38, badge: 'New' },
  { id: 'mc4', category: 'mcb', name: 'TPN MCB DB BOX', sub: 'Triple Pole 4/6/8 Way DD', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 45, badge: null },
  { id: 'mc5', category: 'mcb', name: 'GI TPN MCB BOX', sub: 'GI Sheet TPN Double Door', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 50, badge: null },
  { id: 'mc6', category: 'mcb', name: 'DRAW SPN DD BOX', sub: 'Draw Type SPN DD Premium', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 40, badge: null },
  // Bus Bar
  { id: 'bb1', category: 'busbar', name: 'BUS BAR 60A', sub: '4×4 — 99% Pure Copper', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 40, badge: 'Popular' },
  { id: 'bb2', category: 'busbar', name: 'BUS BAR 100A', sub: 'Super — TATA GPSP Sheet', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 50, badge: null },
  { id: 'bb3', category: 'busbar', name: 'BUS BAR 200A', sub: '200A Heavy Duty Copper', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 60, badge: null },
  { id: 'bb4', category: 'busbar', name: 'BUS BAR 32A', sub: '32A Standard Grade', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 30, badge: null },
  { id: 'bb5', category: 'busbar', name: 'BUS BAR TPN 150A', sub: 'TPN 3-Phase Distribution', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 55, badge: 'New' },
  // Exhaust Fan
  { id: 'ef1', category: 'exhaust', name: 'KITCHEN FAN ROYAL', sub: 'Premium Ventilation Series', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 45, badge: 'Popular' },
  { id: 'ef2', category: 'exhaust', name: 'VENTILATION 150 ALM', sub: 'Aluminium Blade 150mm', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 40, badge: null },
  { id: 'ef3', category: 'exhaust', name: 'EXHAUST FAN 200MM', sub: '200mm Industrial Grade', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 50, badge: null },
  { id: 'ef4', category: 'exhaust', name: 'VENTOGUARD FAN', sub: 'With Built-in Louver Flap', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 35, badge: 'New' },
  { id: 'ef5', category: 'exhaust', name: 'AXIAL FLOW FAN', sub: 'High Static Pressure Series', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 55, badge: null },
  // LED
  { id: 'ld1', category: 'led', name: 'LED FLOOD 20W', sub: 'Outdoor Waterproof IP65', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 30, badge: 'Popular' },
  { id: 'ld2', category: 'led', name: 'LED FLOOD 50W', sub: '50W High Lumen Output', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 45, badge: null },
  { id: 'ld3', category: 'led', name: 'LED STREET LIGHT', sub: 'Street/Industrial 80W', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 60, badge: null },
  { id: 'ld4', category: 'led', name: 'LED PANEL LIGHT', sub: 'Slim Panel 18W/36W Square', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 25, badge: 'New' },
  // Changeover
  { id: 'co1', category: 'changeover', name: 'AUTO CHANGEOVER 32A', sub: 'Single Phase Auto Switch', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 50, badge: 'Popular' },
  { id: 'co2', category: 'changeover', name: 'DIGITAL PANEL 3PH', sub: 'Digital Meter + Indicator', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 70, badge: null },
  { id: 'co3', category: 'changeover', name: 'CHANGEOVER 63A', sub: '63A Heavy Duty Switch', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 65, badge: 'New' },
  // Main Switch
  { id: 'ms1', category: 'mainswitch', name: 'MAIN SW REWIRABLE', sub: 'Standard Rewirable Fuse', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 20, badge: null },
  { id: 'ms2', category: 'mainswitch', name: 'MAIN SW FUSE UNIT', sub: 'HRC Fuse 32A/63A/100A', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 25, badge: 'Popular' },
  { id: 'ms3', category: 'mainswitch', name: 'DP MAIN SWITCH', sub: 'Double Pole ISI Marked', img: `${CDN}F8_3_18-40.png?v=1757426631&width=300`, points: 22, badge: null },
  // Louver
  { id: 'lv1', category: 'louver', name: 'VENTOGUARD 6"', sub: '6" Automatic Louver', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 18, badge: null },
  { id: 'lv2', category: 'louver', name: 'VENTOGUARD 8"', sub: '8" Light Weight Flapper', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 22, badge: 'Popular' },
  { id: 'lv3', category: 'louver', name: 'LOUVER SHUTTER 4"', sub: 'Compact 4" Ventilation', img: `${CDN}Kitchen-Fan-Royal.png?v=1741846906&width=300`, points: 14, badge: null },
];

const normalizeCatalogText = (text: string) =>
  text
    .replace(/â€”/g, '-')
    .replace(/Ã—/g, 'x')
    .replace(/âœ•/g, 'x')
    .replace(/\s+/g, ' ')
    .trim();

const catalogPhraseMap: Record<Exclude<AppLanguage, 'English'>, Array<[string, string]>> = {
  Hindi: [
    ['FAN BOX', 'फैन बॉक्स'],
    ['FAN REGULATOR', 'फैन रेगुलेटर'],
    ['CONCEALED', 'कन्सील्ड'],
    ['OCTAGONAL BOX', 'ऑक्टागोनल बॉक्स'],
    ['MODULE', 'मॉड्यूल'],
    ['PLATINUM', 'प्लैटिनम'],
    ['GOLD', 'गोल्ड'],
    ['SUPER', 'सुपर'],
    ['ZINC', 'जिंक'],
    ['PREMIUM', 'प्रीमियम'],
    ['MCB BOX', 'एमसीबी बॉक्स'],
    ['BUS BAR', 'बस बार'],
    ['KITCHEN FAN ROYAL', 'किचन फैन रॉयल'],
    ['VENTILATION', 'वेंटिलेशन'],
    ['EXHAUST FAN', 'एग्जॉस्ट फैन'],
    ['AXIAL FLOW FAN', 'एक्सियल फ्लो फैन'],
    ['LED FLOOD', 'एलईडी फ्लड'],
    ['LED STREET LIGHT', 'एलईडी स्ट्रीट लाइट'],
    ['LED PANEL LIGHT', 'एलईडी पैनल लाइट'],
    ['AUTO CHANGEOVER', 'ऑटो चेंजओवर'],
    ['CHANGEOVER', 'चेंजओवर'],
    ['DIGITAL PANEL', 'डिजिटल पैनल'],
    ['MAIN SW', 'मेन स्विच'],
    ['FUSE UNIT', 'फ्यूज यूनिट'],
    ['DP MAIN SWITCH', 'डीपी मेन स्विच'],
    ['VENTOGUARD', 'वेंटोगार्ड'],
    ['LOUVER SHUTTER', 'लूवर शटर'],
    ['Range', 'रेंज'],
    ['Precision', 'प्रिसीजन'],
    ['Standard', 'स्टैंडर्ड'],
    ['Heavy', 'हेवी'],
    ['Deluxe', 'डीलक्स'],
    ['Series', 'सीरीज़'],
    ['Single Door', 'सिंगल डोर'],
    ['Double Door', 'डबल डोर'],
    ['Draw Type', 'ड्रॉ टाइप'],
    ['Pure Copper', 'प्योर कॉपर'],
    ['Industrial Grade', 'इंडस्ट्रियल ग्रेड'],
    ['Outdoor Waterproof', 'आउटडोर वॉटरप्रूफ'],
    ['High Lumen Output', 'हाई लुमेन आउटपुट'],
    ['Compact', 'कॉम्पैक्ट'],
    ['Automatic', 'ऑटोमैटिक'],
    ['With Built-in', 'बिल्ट-इन के साथ'],
    ['Light Weight', 'लाइट वेट'],
    ['Ventilation', 'वेंटिलेशन'],
    ['Available', 'उपलब्ध'],
  ],
  Punjabi: [
    ['FAN BOX', 'ਫੈਨ ਬਾਕਸ'],
    ['FAN REGULATOR', 'ਫੈਨ ਰੈਗੂਲੇਟਰ'],
    ['CONCEALED', 'ਕੰਸੀਲਡ'],
    ['OCTAGONAL BOX', 'ਆਕਟਾਗੋਨਲ ਬਾਕਸ'],
    ['MODULE', 'ਮੋਡੀਊਲ'],
    ['PLATINUM', 'ਪਲੈਟਿਨਮ'],
    ['GOLD', 'ਗੋਲਡ'],
    ['SUPER', 'ਸੁਪਰ'],
    ['ZINC', 'ਜ਼ਿੰਕ'],
    ['PREMIUM', 'ਪ੍ਰੀਮੀਅਮ'],
    ['MCB BOX', 'ਐਮਸੀਬੀ ਬਾਕਸ'],
    ['BUS BAR', 'ਬਸ ਬਾਰ'],
    ['KITCHEN FAN ROYAL', 'ਕਿਚਨ ਫੈਨ ਰੋਯਲ'],
    ['VENTILATION', 'ਵੈਂਟੀਲੇਸ਼ਨ'],
    ['EXHAUST FAN', 'ਐਗਜ਼ੌਸਟ ਫੈਨ'],
    ['AXIAL FLOW FAN', 'ਐਕਸੀਅਲ ਫਲੋ ਫੈਨ'],
    ['LED FLOOD', 'ਐਲਈਡੀ ਫਲੱਡ'],
    ['LED STREET LIGHT', 'ਐਲਈਡੀ ਸਟ੍ਰੀਟ ਲਾਈਟ'],
    ['LED PANEL LIGHT', 'ਐਲਈਡੀ ਪੈਨਲ ਲਾਈਟ'],
    ['AUTO CHANGEOVER', 'ਆਟੋ ਚੇਂਜਓਵਰ'],
    ['CHANGEOVER', 'ਚੇਂਜਓਵਰ'],
    ['DIGITAL PANEL', 'ਡਿਜ਼ਿਟਲ ਪੈਨਲ'],
    ['MAIN SW', 'ਮੇਨ ਸਵਿੱਚ'],
    ['FUSE UNIT', 'ਫਿਊਜ਼ ਯੂਨਿਟ'],
    ['DP MAIN SWITCH', 'ਡੀਪੀ ਮੇਨ ਸਵਿੱਚ'],
    ['VENTOGUARD', 'ਵੈਂਟੋਗਾਰਡ'],
    ['LOUVER SHUTTER', 'ਲੂਵਰ ਸ਼ਟਰ'],
    ['Range', 'ਰੇਂਜ'],
    ['Precision', 'ਪ੍ਰਿਸੀਜ਼ਨ'],
    ['Standard', 'ਸਟੈਂਡਰਡ'],
    ['Heavy', 'ਹੈਵੀ'],
    ['Deluxe', 'ਡਿਲਕਸ'],
    ['Series', 'ਸੀਰੀਜ਼'],
    ['Single Door', 'ਸਿੰਗਲ ਡੋਰ'],
    ['Double Door', 'ਡਬਲ ਡੋਰ'],
    ['Draw Type', 'ਡਰਾਅ ਟਾਈਪ'],
    ['Pure Copper', 'ਸ਼ੁੱਧ ਤਾਂਬਾ'],
    ['Industrial Grade', 'ਇੰਡਸਟਰੀਅਲ ਗ੍ਰੇਡ'],
    ['Outdoor Waterproof', 'ਆਉਟਡੋਰ ਵਾਟਰਪ੍ਰੂਫ'],
    ['High Lumen Output', 'ਹਾਈ ਲੂਮਨ ਆਉਟਪੁੱਟ'],
    ['Compact', 'ਕੌਂਪੈਕਟ'],
    ['Automatic', 'ਆਟੋਮੈਟਿਕ'],
    ['With Built-in', 'ਬਿਲਟ-ਇਨ ਨਾਲ'],
    ['Light Weight', 'ਹਲਕਾ ਵਜ਼ਨ'],
    ['Ventilation', 'ਵੈਂਟੀਲੇਸ਼ਨ'],
    ['Available', 'ਉਪਲਬਧ'],
  ],
};

function localizeCatalogText(text: string, language: AppLanguage) {
  const normalized = normalizeCatalogText(text);
  if (language === 'English') return normalized;

  let localized = normalized;
  for (const [source, target] of catalogPhraseMap[language]) {
    localized = localized.replaceAll(source, target);
  }
  return localized;
}

type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';

// ── Animated Product Image (float only — NO glow circle) ──────────────
function AnimatedProductImage({ uri, size }: { uri: string; size: number }) {
  const floatY = useRef(new Animated.Value(0)).current;
  const imgScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Float up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -8, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    // Gentle breathing scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(imgScale, { toValue: 1.06, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(imgScale, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Floating image — no glow circle, full size */}
      <Animated.View style={{ transform: [{ translateY: floatY }, { scale: imgScale }] }}>
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

// ── Product Card (uniform fixed height) ──────────────────────────────
function ProductCard({
  product,
  cardW,
  catColor,
  onScan,
  showScanButton = true,
}: {
  product: Product;
  cardW: number;
  catColor: (typeof CAT_COLORS)[string];
  onScan: () => void;
  showScanButton?: boolean;
}) {
  const { darkMode, tx, language } = usePreferenceContext();
  const pressScale = useRef(new Animated.Value(1)).current;
  const tiltX = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true, tension: 100, friction: 6 }),
      Animated.spring(tiltX, { toValue: 1, useNativeDriver: true, tension: 100, friction: 6 }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 6 }),
      Animated.spring(tiltX, { toValue: 0, useNativeDriver: true, tension: 100, friction: 6 }),
    ]).start();
  };

  const rotate = tiltX.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '4deg'] });
  // Image fills full card width zone — no circle reduction
  const imgSize = cardW + 4;

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.productCard,
          darkMode ? styles.productCardDark : null,
          {
            width: cardW,
            height: showScanButton ? cardW * 1.72 : cardW * 1.56,
            transform: [{ scale: pressScale }, { perspective: 900 }, { rotateY: rotate }],
          },
        ]}
      >
        {/* Image zone - fixed height */}
        <LinearGradient
          colors={catColor.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.imgZone, { height: cardW + 18 }]}
        >
          {product.badge != null && (
            <View style={[styles.badge, { backgroundColor: catColor.scanText }]}> 
              <Text style={styles.badgeText}>{tx(product.badge)}</Text>
            </View>
          )}
          <View style={[styles.ptsBadge, { borderColor: catColor.scanText + '44' }]}>
            <Text style={[styles.ptsBadgeText, { color: catColor.scanText }]}>+{product.points} pts</Text>
          </View>
          <AnimatedProductImage uri={product.img} size={imgSize} />
        </LinearGradient>

        {/* Info zone — fixed layout */}
        <View style={[styles.infoZone, darkMode ? styles.infoZoneDark : null, !showScanButton ? styles.infoZoneCompact : null]}>
          <Text style={[styles.productName, darkMode ? styles.productNameDark : null]} numberOfLines={1}>{localizeCatalogText(product.name, language)}</Text>
          <Text style={[styles.productSub, darkMode ? styles.productSubDark : null]} numberOfLines={2}>{localizeCatalogText(product.sub, language)}</Text>
          <View style={showScanButton ? styles.infoSpacer : styles.infoCompactSpacer} />
          {showScanButton ? (
            <TouchableOpacity
              onPress={onScan}
              style={[styles.scanBtn, { backgroundColor: catColor.scanBg }]}
              activeOpacity={0.8}
            >
              <ScanIcon size={15} color={catColor.scanText} />
              <Text style={[styles.scanBtnText, { color: catColor.scanText }]}>{tx('Scan to Earn')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────
export function ProductScreen({
  onNavigate,
  initialCategory = 'fanbox',
  showBottomBanner = true,
  showScanButton = true,
}: {
  onNavigate: (screen: Screen) => void;
  initialCategory?: string;
  showBottomBanner?: boolean;
  showScanButton?: boolean;
}) {
  const { darkMode, tx, language } = usePreferenceContext();
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const PADDING = 14;
  const GAP = 12;
  const cardW = Math.floor((width - PADDING * 2 - GAP) / 2);

  // ── Global search: when searching, show results from ALL categories
  //    When not searching, filter by selected category only
  const isSearching = search.trim().length > 0;

  const filtered = useMemo(() => {
    if (isSearching) {
      // Search across ALL categories
      return allProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sub.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Normal category filter
    return allProducts.filter((p) => p.category === category);
  }, [category, search, isSearching]);

  const currentCat = categories.find((c) => c.id === category)!;
  const catColor = CAT_COLORS[category];

  // Pair products into rows of 2
  const rows: Product[][] = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  return (
    <ScrollView style={[styles.screen, darkMode ? styles.screenDark : null]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageTitle, darkMode ? styles.pageTitleDark : null]}>{tx('All Products')}</Text>

      {/* Search */}
      <View style={[styles.searchWrap, darkMode ? styles.searchWrapDark : null]}>
        <Text style={{ fontSize: 15, color: Colors.textMuted }}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={tx('Search all products...')}
          placeholderTextColor={Colors.textMuted}
          style={[styles.searchInput, darkMode ? styles.searchInputDark : null]}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Text style={{ fontSize: 15, color: Colors.textMuted }}>✕</Text>
          </Pressable>
        )}
        <TouchableOpacity
          onPress={() => setShowFilters((prev) => !prev)}
          style={[styles.filterToggleBtn, showFilters && styles.filterToggleBtnActive]}
          activeOpacity={0.82}
        >
          <FilterIcon color={showFilters ? '#FFFFFF' : Colors.textDark} />
        </TouchableOpacity>
      </View>

      {showFilters ? (
        <View style={[styles.filterPanel, darkMode ? styles.filterPanelDark : null]}>
          <View style={styles.filterPanelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.filterPanelTitle, darkMode ? styles.filterPanelTitleDark : null]}>{tx('Filter products')}</Text>
              <Text style={[styles.filterPanelSub, darkMode ? styles.filterPanelSubDark : null]}>{tx('Choose a category to see matching product names and items.')}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowFilters(false)} activeOpacity={0.8}>
              <Text style={styles.filterPanelClose}>{tx('Close')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterGrid}>
            {categories.map((cat) => {
              const active = !isSearching && cat.id === category;
              const cc = CAT_COLORS[cat.id];
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setCategory(cat.id);
                    setSearch('');
                    setShowFilters(false);
                  }}
                  style={[
                    styles.filterCard,
                    darkMode ? styles.filterCardDark : null,
                    active && { backgroundColor: cc.scanText, borderColor: cc.scanText },
                  ]}
                  activeOpacity={0.86}
                >
                  <View style={[styles.filterCardIcon, { backgroundColor: active ? 'rgba(255,255,255,0.2)' : cc.iconBg }]}>
                    <CatIcon id={cat.id} size={22} color={active ? '#fff' : cc.scanText} />
                  </View>
                    <Text style={[styles.filterCardTitle, darkMode && !active ? styles.filterCardTitleDark : null, active && styles.filterCardTitleActive]} numberOfLines={1}>
                    {localizeCatalogText(cat.label, language)}
                  </Text>
                    <Text style={[styles.filterCardMeta, darkMode && !active ? styles.filterCardMetaDark : null, active && styles.filterCardMetaActive]}>
                    {allProducts.filter((product) => product.category === cat.id).length} {tx('products')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      {/* Category Tabs — always visible, just disabled during search */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
        {categories.map((cat) => {
          const active = !isSearching && cat.id === category;
          const cc = CAT_COLORS[cat.id];
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => {
                setCategory(cat.id);
                setSearch(''); // clear search when tapping a category tab
              }}
              style={[
                styles.categoryTab,
                darkMode ? styles.categoryTabDark : null,
                active && { backgroundColor: cc.scanText, borderColor: cc.scanText },
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.tabIconWrap, { backgroundColor: active ? 'rgba(255,255,255,0.2)' : cc.iconBg }]}>
                <CatIcon id={cat.id} size={18} color={active ? '#fff' : cc.scanText} />
              </View>
              <Text style={[styles.categoryText, darkMode && !active ? styles.categoryTextDark : null, active && { color: '#fff' }]}>{localizeCatalogText(cat.label, language)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Banner — hide during search, show search result info instead */}
      {isSearching ? (
        <View style={[styles.searchResultBanner, darkMode ? styles.searchResultBannerDark : null]}>
          <Text style={[styles.searchResultText, darkMode ? styles.searchResultTextDark : null]}>
            {filtered.length > 0
              ? `${filtered.length} ${tx(filtered.length !== 1 ? 'results' : 'result')} "${search}"`
              : `${tx('No results for')} "${search}"`}
          </Text>
          {filtered.length === 0 && (
            <Text style={[styles.searchResultSub, darkMode ? styles.searchResultSubDark : null]}>{tx('Try searching by product name or size')}</Text>
          )}
        </View>
      ) : (
        <LinearGradient colors={catColor.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.catBanner}>
          <View style={styles.catBannerLeft}>
            <View style={styles.bannerIconWrap}>
              <CatIcon id={category} size={32} color="#fff" />
            </View>
            <View>
              <Text style={styles.catBannerTitle}>{localizeCatalogText(currentCat.label, language)}</Text>
              <Text style={styles.catBannerSub}>{filtered.length} {tx('products')} {tx('available')}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onNavigate('scan')} style={styles.catScanBtn}>
            <ScanIcon size={20} color="#fff" />
            <Text style={styles.catScanText}>{tx('Scan & Earn').replace(' ', '\n')}</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Product Grid — rows of 2, all equal size */}
      {rows.map((row, ri) => {
        // During global search, use the category color of each product
        return (
          <View key={ri} style={styles.row}>
            {row.map((product) => {
              const productCatColor = CAT_COLORS[product.category] ?? catColor;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cardW={cardW}
                  catColor={productCatColor}
                  onScan={() => onNavigate('scan')}
                  showScanButton={showScanButton}
                />
              );
            })}
            {row.length === 1 && <View style={{ width: cardW }} />}
          </View>
        );
      })}

      {/* Bottom Banner */}
      {showBottomBanner ? (
        <TouchableOpacity
          style={[styles.bottomBanner, darkMode ? styles.bottomBannerDark : null]}
          activeOpacity={0.88}
          onPress={() => onNavigate('scan')}
        >
          <Text style={{ fontSize: 26 }}>🏭</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomBannerTitle}>{tx("North India's Largest Manufacturer")}</Text>
            <Text style={styles.bottomBannerSub}>{tx('SRV Electricals — since 2000. Scan any QR to earn points!')}</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ) : null}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  screenDark: { backgroundColor: '#08111F' },
  content: { padding: 14, gap: 14 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark, textAlign: 'center' },
  pageTitleDark: { color: '#F8FAFC' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 14, height: 50,
  },
  searchWrapDark: { backgroundColor: '#111827', borderColor: '#243043' },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textDark },
  searchInputDark: { color: '#F8FAFC' },
  filterToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6FA',
  },
  filterToggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  filterPanel: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  filterPanelDark: { backgroundColor: '#111827', borderColor: '#243043', shadowColor: '#020617' },
  filterPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  filterPanelTitle: { fontSize: 16, fontWeight: '800', color: Colors.textDark },
  filterPanelSub: { fontSize: 12, color: Colors.textMuted, marginTop: 3, lineHeight: 17 },
  filterPanelTitleDark: { color: '#F8FAFC' },
  filterPanelSubDark: { color: '#94A3B8' },
  filterPanelClose: { fontSize: 12.5, fontWeight: '800', color: Colors.primary },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterCard: {
    width: '48%',
    backgroundColor: '#FAFBFD',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 12,
  },
  filterCardDark: { backgroundColor: '#182133', borderColor: '#243043' },
  filterCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterCardTitle: { fontSize: 13, fontWeight: '800', color: Colors.textDark },
  filterCardTitleActive: { color: '#FFFFFF' },
  filterCardMeta: { fontSize: 11.5, color: Colors.textMuted, marginTop: 4 },
  filterCardMetaActive: { color: 'rgba(255,255,255,0.86)' },
  filterCardTitleDark: { color: '#F8FAFC' },
  filterCardMetaDark: { color: '#94A3B8' },

  tabList: { gap: 10, paddingVertical: 2 },
  categoryTab: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 9, borderRadius: 22,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  categoryTabDark: { backgroundColor: '#111827', borderColor: '#243043' },
  tabIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  categoryText: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  categoryTextDark: { color: '#F8FAFC' },

  catBanner: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  bannerIconWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  catBannerTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  catBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  catScanBtn: { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', gap: 4 },
  catScanText: { color: '#fff', fontSize: 11, fontWeight: '800', textAlign: 'center' },

  // Search result banner
  searchResultBanner: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  searchResultText: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  searchResultSub: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  searchResultBannerDark: { backgroundColor: '#111827', borderColor: '#243043' },
  searchResultTextDark: { color: '#F8FAFC' },
  searchResultSubDark: { color: '#94A3B8' },

  // Grid rows
  row: { flexDirection: 'row', gap: 12 },

  // Card
  productCard: {
    backgroundColor: Colors.surface, borderRadius: 20,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  productCardDark: {
    backgroundColor: '#111827',
    borderColor: '#243043',
    shadowColor: '#020617',
  },
  imgZone: {
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  badge: {
    position: 'absolute', top: 10, left: 10, zIndex: 3,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  ptsBadge: {
    position: 'absolute', top: 10, right: 10, zIndex: 3,
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 10,
    borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3,
  },
  ptsBadgeText: { fontSize: 11, fontWeight: '800' },
  infoZone: { flex: 1, padding: 11, paddingTop: 10 },
  infoZoneDark: { backgroundColor: '#111827' },
  infoZoneCompact: { paddingBottom: 14, justifyContent: 'flex-start' },
  infoSpacer: { flex: 1 },
  infoCompactSpacer: { height: 6 },
  productName: { fontSize: 12, fontWeight: '800', color: Colors.textDark, textTransform: 'uppercase', letterSpacing: 0.2 },
  productNameDark: { color: '#F8FAFC' },
  productSub: { fontSize: 10.5, color: Colors.textMuted, marginTop: 3, lineHeight: 14 },
  productSubDark: { color: '#CBD5E1' },
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderRadius: 11, paddingVertical: 8,
  },
  scanBtnText: { fontSize: 11.5, fontWeight: '700' },

  bottomBanner: { backgroundColor: '#2D3561', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  bottomBannerDark: { backgroundColor: '#172554' },
  bottomBannerTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  bottomBannerSub: { fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, lineHeight: 16 },
});
