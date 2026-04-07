import React from 'react';
import { ProfileScreen as SharedProfileScreen } from '@/features/profile/ProfileScreen';
import type { Screen } from '@/shared/types/navigation';

export function ProfileScreen({
  onNavigate,
  onSignOut,
  hasPasswordConfigured,
  storedPassword,
  onPasswordConfiguredChange,
  onPasswordChange,
}: {
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
  hasPasswordConfigured: boolean;
  storedPassword: string;
  onPasswordConfiguredChange: (configured: boolean) => void;
  onPasswordChange: (password: string) => void;
}) {
  return (
    <SharedProfileScreen
      currentRole="electrician"
      onNavigate={onNavigate}
      onSignOut={onSignOut}
      hasPasswordConfigured={hasPasswordConfigured}
      storedPassword={storedPassword}
      onPasswordConfiguredChange={onPasswordConfiguredChange}
      onPasswordChange={onPasswordChange}
    />
  );
}
