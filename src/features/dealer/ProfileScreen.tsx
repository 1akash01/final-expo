import React from 'react';
import { ProfileScreen as SharedProfileScreen } from '@/features/profile/ProfileScreen';
import type { Screen } from '@/shared/types/navigation';

export function ProfileScreen({
  onNavigate,
  onSignOut,
}: {
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  return <SharedProfileScreen currentRole="dealer" onNavigate={onNavigate} onSignOut={onSignOut} />;
}
