import { useSignIn } from '@clerk/clerk-expo';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Text, TextInput, TouchableOpacity, View, type TextInputEndEditingEvent, } from 'react-native';
import React, { useCallback, useRef } from 'react';
import Header from '~/components/auth/header';
import { SignInWithGoogle } from '~/components/auth/signInWithGoogle';
import { SafeAreaView } from 'react-native-safe-area-context';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function Page() {
  const height = useHeaderHeight();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const passwordRef = useRef<TextInput>(null);

  // iOS autofill bypasses onChangeText — onEndEditing fires with the correct native value
  const handlePasswordEndEditing = useCallback(
    (e: TextInputEndEditingEvent) => {
      if (Platform.OS === 'ios') {
        const nativeText = e.nativeEvent.text;
        if (nativeText !== password) {
          setPassword(nativeText);
        }
      }
    },
    [password],
  );

  const handleEmailEndEditing = useCallback(
    (e: TextInputEndEditingEvent) => {
      if (Platform.OS === 'ios') {
        const nativeText = e.nativeEvent.text;
        if (nativeText !== emailAddress) {
          setEmailAddress(nativeText);
        }
      }
    },
    [emailAddress],
  );

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({ identifier: emailAddress, password });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace(redirectTo ?? '/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView className='relative flex-1 bg-background'>
      {/* Fixed header/logo stays outside the ScrollView */}
      <View
        className='absolute w-full items-center'
        style={{ top: height }}>
        <Header />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 24 }}
        keyboardShouldPersistTaps='handled'
        scrollEnabled={false}
        automaticallyAdjustKeyboardInsets>
        <View className='rounded-3xl bg-white p-8 shadow-lg mb-2'>
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>Welcome Back!</Text>
            <Text className='text-lg text-secondary'>Sign in to continue</Text>
          </View>

          <View className='gap-y-2'>
            <TextInput
              autoCapitalize='none'
              value={emailAddress}
              placeholder='Enter email'
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
              placeholderTextColor='#B58553'
              autoComplete='email'
              textContentType='emailAddress'
              importantForAutofill='yes'
              onChangeText={setEmailAddress}
              onEndEditing={handleEmailEndEditing}
              returnKeyType='next'
              onSubmitEditing={() => passwordRef.current?.focus()} />
            <TextInput
              ref={passwordRef}
              value={password}
              placeholder='Enter password'
              secureTextEntry
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
              placeholderTextColor='#B58553'
              autoComplete='password'
              textContentType='password'
              importantForAutofill='yes'
              onChangeText={setPassword}
              onEndEditing={handlePasswordEndEditing}
              returnKeyType='done'
              onSubmitEditing={onSignInPress} />
            <SignInWithGoogle />
            <TouchableOpacity
              onPress={onSignInPress}
              className='mb-2 rounded-full bg-primary h-12 justify-center'>
              <Text className='text-center text-lg font-semibold text-white'>Continue</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row items-center justify-center'>
            <Text className='text-base text-secondary'>Don't have an account? </Text>
            <Link href={{ pathname: '/sign-up', params: redirectTo ? { redirectTo } : undefined }}>
              <Text className='text-base font-semibold text-primary'>Sign up</Text>
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
