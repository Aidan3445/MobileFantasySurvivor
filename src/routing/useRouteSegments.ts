import { useSegments } from 'expo-router';

export function useRouteSegments(): string[] {
  const segments = useSegments() as string[];

  if (segments[0] === '(gate)') {
    return segments.slice(1);
  }

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    throw new Error(
      'useRouteSegments must be used within a (gate) route group'
    );
  }

  return segments;
}
