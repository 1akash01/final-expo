import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIcon, C, PageHeader, PrimaryBtn, usePreferenceContext } from './ProfileShared';

export function NeedHelpPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const subjectOptions = ['Normal Inquiry', 'Bulk Inquiry', 'Electrician Related Inquiry', 'QR Related Inquiry'];

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission required', 'Please allow gallery access.');
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) setPendingPhoto(res.assets[0].uri);
  };

  const confirmPhoto = () => {
    if (!pendingPhoto) return;
    setPhoto(pendingPhoto);
    setPendingPhoto(null);
  };

  const cancelPhoto = () => {
    setPendingPhoto(null);
  };

  const submitHelp = () => {
    if (!subject.trim() || !comment.trim()) return Alert.alert(t('incompleteForm'), t('fillSubjectComment'));
    Alert.alert(t('submitted'), 'Your support request has been submitted.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('needHelp')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.iconWrap}>
              <AppIcon name="support" size={24} color={C.teal} />
            </View>
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Support Request</Text>
              <Text style={[styles.sub, { color: theme.textMuted }]}>We typically respond within 24 hours</Text>
            </View>
          </View>
          <Text style={[styles.label, { color: theme.textMuted }]}>Subject</Text>
          <TouchableOpacity
            style={[styles.input, styles.dropdownTrigger, { backgroundColor: theme.soft, borderColor: theme.border }]}
            onPress={() => setShowSubjectDropdown(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.dropdownValue, { color: subject ? theme.textPrimary : theme.textMuted }]} numberOfLines={1}>
              {subject || 'Select subject'}
            </Text>
            <AppIcon name="chevronDown" size={18} color={theme.textMuted} />
          </TouchableOpacity>
          <Text style={[styles.label, { color: theme.textMuted }]}>Comment</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.soft, borderColor: theme.border, color: theme.textPrimary, height: 110, textAlignVertical: 'top', paddingTop: 14 }]}
            placeholder="Describe your issue in detail..."
            placeholderTextColor={theme.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity style={[styles.uploadBox, { backgroundColor: theme.soft, borderColor: theme.border }]} onPress={pickPhoto} activeOpacity={0.8}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadInner}>
                <AppIcon name="gallery" size={20} color={C.muted} />
                <Text style={styles.uploadText}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <PrimaryBtn label={t('save')} onPress={submitHelp} />
      </ScrollView>

      <Modal visible={showSubjectDropdown} animationType="fade" transparent onRequestClose={() => setShowSubjectDropdown(false)}>
        <Pressable style={styles.dropdownOverlay} onPress={() => setShowSubjectDropdown(false)}>
          <View style={[styles.dropdownSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.dropdownTitle, { color: theme.textPrimary }]}>Select Subject</Text>
            {subjectOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[styles.dropdownItem, index < subjectOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
                onPress={() => {
                  setSubject(option);
                  setShowSubjectDropdown(false);
                }}
                activeOpacity={0.85}
              >
                <Text style={[styles.dropdownItemText, { color: theme.textPrimary }]}>{option}</Text>
                {subject === option ? <AppIcon name="check" size={16} color={C.primary} /> : null}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={!!pendingPhoto} animationType="fade" transparent onRequestClose={cancelPhoto}>
        <View style={styles.dropdownOverlay}>
          <View style={[styles.dropdownSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {pendingPhoto ? <Image source={{ uri: pendingPhoto }} style={styles.confirmPreview} /> : null}
            <Text style={[styles.dropdownTitle, { color: theme.textPrimary }]}>Use this photo?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={cancelPhoto} activeOpacity={0.85}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDoneBtn} onPress={confirmPhoto} activeOpacity={0.85}>
                <Text style={styles.confirmDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 14, paddingBottom: 32 },
  card: { borderRadius: 28, padding: 20, borderWidth: 1, gap: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.tealLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '900' },
  sub: { fontSize: 13, marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 52, borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 16, fontSize: 14, fontWeight: '500' },
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownValue: { flex: 1, fontSize: 14, fontWeight: '500', marginRight: 12 },
  uploadBox: { height: 110, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', overflow: 'hidden' },
  uploadInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  uploadText: { fontSize: 14, color: C.muted, fontWeight: '600' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  dropdownOverlay: { flex: 1, backgroundColor: 'rgba(15,17,32,0.45)', justifyContent: 'center', paddingHorizontal: 24 },
  dropdownSheet: { borderRadius: 24, borderWidth: 1, padding: 20 },
  dropdownTitle: { fontSize: 17, fontWeight: '900', marginBottom: 12 },
  dropdownItem: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  dropdownItemText: { fontSize: 14, fontWeight: '600', flex: 1, marginRight: 12 },
  confirmPreview: { width: 220, height: 220, borderRadius: 20, alignSelf: 'center', marginBottom: 16 },
  confirmActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  confirmCancelBtn: { flex: 1, height: 52, borderRadius: 16, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  confirmCancelText: { fontSize: 15, fontWeight: '700', color: C.dark },
  confirmDoneBtn: { flex: 1, height: 52, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  confirmDoneText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
