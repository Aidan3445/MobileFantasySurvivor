'use client';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import LoadingScreen from '~/components/auth/loadingScreen';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  console.log('Index returnTo:', params.returnTo);
  if (!isLoaded) {
    return <LoadingScreen noBounce />;
  }

  if (isSignedIn) {
    if (params.returnTo) {
      console.log('Index Redirecting to returnTo:', params.returnTo);
      return <Redirect href={params.returnTo} />;
    }

    return <Redirect href='/(tabs)' />;
  }

  return <Redirect href='/(auth)/sign-in' />;
}
