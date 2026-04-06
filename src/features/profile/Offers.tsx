import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

const offers = [
  { id: 'OFF-01', title: 'Festive Bonus', body: 'Get 500 extra points on selected premium range purchases.', tag: 'Hot' },
  { id: 'OFF-02', title: 'Dealer Growth Offer', body: 'Complete your monthly target and unlock a surprise gift slab.', tag: 'New' },
  { id: 'OFF-03', title: 'Scan & Win', body: 'Scan 25 products this month to get accelerated reward points.', tag: 'Live' },
];

export function OffersPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('offer')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {offers.map((offer, index) => (
          <View
            key={offer.id}
            style={[
              styles.offerCard,
              {
                backgroundColor: index === 0 ? '#FFF4E8' : theme.surface,
                borderColor: index === 0 ? '#F7D9A8' : theme.border,
              },
            ]}
          >
            <View style={styles.offerHead}>
              <View style={[styles.offerIcon, { backgroundColor: index === 0 ? '#FFE8C4' : C.goldLight }]}>
                <AppIcon name="offer" size={20} color={C.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.offerTitle, { color: theme.textPrimary }]}>{offer.title}</Text>
                <Text style={[styles.offerId, { color: theme.textMuted }]}>{offer.id}</Text>
              </View>
              <View style={styles.offerTag}>
                <Text style={styles.offerTagText}>{offer.tag}</Text>
              </View>
            </View>
            <Text style={[styles.offerBody, { color: theme.textSecondary }]}>{offer.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  offerCard: { borderRadius: 24, borderWidth: 1, padding: 18, gap: 14 },
  offerHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  offerIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 15, fontWeight: '800' },
  offerId: { fontSize: 12, marginTop: 3 },
  offerTag: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: C.primaryLight },
  offerTagText: { color: C.primary, fontSize: 11, fontWeight: '800' },
  offerBody: { fontSize: 13, lineHeight: 21, fontWeight: '600' },
});
