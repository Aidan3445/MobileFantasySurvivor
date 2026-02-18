import React, { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Button from '~/components/common/button';
import { useWarmUpBrowser } from '~/components/auth/signInWithGoogle';

WebBrowser.maybeCompleteAuthSession();

export function SignUpWithApple() {
  const router = useRouter();
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_apple',
        redirectUrl: AuthSession.makeRedirectUri({ scheme: 'trialbyfire', path: 'callback' }),
      });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              router.push('/sign-up/tasks');
              return;
            }
            router.push('/');
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router, startSSOFlow]);

  return <AppleSignUpButton onPress={onPress} />;
}

interface AppleSignUpButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function AppleSignUpButton({
  onPress,
  disabled = false,
}: AppleSignUpButtonProps) {
  return (
    <Button
      className='flex-1 bg-black active:bg-black/80 transition-all h-[40px] items-center justify-center rounded-full'
      onPress={onPress}
      disabled={disabled}>
      <View className='flex-row items-center'>
        <View className='mr-[12px]'>
          <Svg width={24} height={24} viewBox='0 0 814 1000'>
            <Path
              fill='white'
              d='M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.8-82-106.5-209.5-106.5-330.2 0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 103.6-30.4 135.5-71.3z' />
          </Svg>
        </View>
        <Text className='text-white text-sm font-medium'>
          Apple
        </Text>
      </View>
    </Button>
  );
}
