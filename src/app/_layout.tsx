import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import '~/global.css';
import QueryClientContextProvider from '~/context/reactQueryContext';

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientContextProvider>
        <Slot />
      </QueryClientContextProvider>
    </ClerkProvider>
  );
}
