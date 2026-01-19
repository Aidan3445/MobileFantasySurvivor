import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { View, Platform, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from '@expo-google-fonts/roboto/useFonts';
import { Roboto_500Medium } from '@expo-google-fonts/roboto/500Medium';


// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export function SignInWithGoogle() {
  const router = useRouter();
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              router.push('/sign-in/tasks');
              return;
            }

            router.push('/');
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router, startSSOFlow]);

  return (
    <View className='my-2'>
      <GoogleSignInButton onPress={onPress} />
    </View>
  );
}

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({
  onPress,
  disabled = false
}: GoogleSignInButtonProps) {
  useFonts({ Roboto_500Medium });

  return (
    <Pressable
      className='bg-[#F2F2F2] active:bg-[#EDD9BF] transition-all h-[40px] items-center justify-center rounded-full'
      onPress={onPress}
      disabled={disabled}>
      <View className='flex-row items-center'>
        <View className='mr-[12px]'>
          <Svg width={24} height={24} viewBox='0 0 48 48'>
            <Path
              fill='#EA4335'
              d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
            />
            <Path
              fill='#4285F4'
              d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
            />
            <Path
              fill='#FBBC05'
              d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
            />
            <Path
              fill='#34A853'
              d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
            />
            <Path fill='none' d='M0 0h48v48H0z' />
          </Svg>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Roboto_500Medium',
          }}>
          Continue with Google
        </Text>
      </View>
    </Pressable >
  );
}
