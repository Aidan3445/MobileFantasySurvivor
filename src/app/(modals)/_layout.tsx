import { useAuth } from '@clerk/clerk-expo';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ModalLayout() {
  const { userId, isLoaded } = useAuth();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load
    if (!userId) {
      router.replace(`/sign-in?returnTo=${encodeURIComponent(returnTo || '/')}`);
      return;
    }
    if (returnTo) {
      router.push(returnTo);
    }
  }, [isLoaded, returnTo, router, userId]);

  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal', }} />
  );
}
