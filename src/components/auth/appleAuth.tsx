import React, { useCallback } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useSignInWithApple } from '@clerk/expo/apple';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';

interface AppleAuthProps {
  type: 'sign-in' | 'sign-up';
}

export function AppleAuth({ type }: AppleAuthProps) {
  const router = useRouter();
  const { startAppleAuthenticationFlow } = useSignInWithApple();

  const buttonType = type === 'sign-in'
    ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
    : AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP;

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleAuthenticationFlow();
      console.log('Created Session ID:', createdSessionId);

      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              router.push('/sign-in/tasks');
              return;
            }
            router.replace('/');
          },
        });
      }
    } catch (err: any) {
      if (err.code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Sign In Error', 'Something went wrong. Please try again.');
    }
  }, [router, startAppleAuthenticationFlow]);

  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={buttonType}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={20}
      style={{ width: '50%', height: 40 }}
      onPress={onPress} />
  );
}

export default AppleAuth;
