import { type Router } from 'expo-router';
import * as Linking from 'expo-linking';

export function isExternallyLinkable(segments: string[]): boolean {
  const [group, first] = segments;

  if (group === '(modals)') {
    return first === 'join';
  }

  if (first === 'sysAdmin') return false;

  if (group === '(tabs)' && first === 'leagues') {
    return segments.length <= 3; // /leagues/[hash] is linkable, deeper routes state-gated
  }

  return true;
}

export function canResumeAfterAuth(segments: string[]) {
  const [group, first] = segments;

  if (group === '(modals)') {
    switch (first) {
      case 'join':
      case 'create':
      case 'recreate':
        return true;
      default:
        return false;
    }
  }

  if (group === '(tabs)') return true;

  return false;
}

export function openModalOverTabs(router: Router, pathname: string, searchParams: Record<string, string | undefined>) {
  const link = Linking.createURL(pathname, { queryParams: searchParams });

  console.log('Opening modal over tabs:', link);

  router.replace('/(tabs)');
  // eslint-disable-next-line no-undef
  setTimeout(() => router.push({
    pathname,
    params: searchParams,
  }), 0);
  return;
}
