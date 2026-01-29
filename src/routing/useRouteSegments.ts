import { useSegments } from 'expo-router';

export function useRouteSegments(): string[] {
  return useSegments() as string[];
}
