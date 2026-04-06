import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

export function NotificationsPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [readIds, setReadIds] = useState<number[]>([]);
  const notifData = [
    { title: 'Price Update', body: 'The price of 4 way DD has been updated to Rs.306', time: '2h ago' },
    { title: 'Price Update', body: 'The price of 6 Way DD has been updated to Rs.363', time: '3h ago' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('notification')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifData.map((n, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, readIds.includes(i) && { opacity: 0.65 }]}
            onPress={() => setReadIds((current) => (current.includes(i) ? current : [...current, i]))}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <AppIcon name="notification" size={20} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{n.title}</Text>
              <Text style={[styles.sub, { color: theme.textMuted }]}>{n.body}</Text>
            </View>
            <Text style={[styles.meta, { color: theme.textMuted }]}>{n.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, padding: 16, borderWidth: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 3 },
  meta: { fontSize: 11, fontWeight: '600' },
});
