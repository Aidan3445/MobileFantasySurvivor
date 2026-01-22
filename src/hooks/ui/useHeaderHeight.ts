import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function useHeaderHeight(extraHeight: number = 16) {
  const insets = useSafeAreaInsets();
  return insets.top + extraHeight;
}
