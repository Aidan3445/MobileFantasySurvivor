import * as React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Header from '~/components/auth/header';
import { SignUpWithGoogle } from '~/components/auth/signUpWithGoogle';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const [formError, setFormError] = React.useState<string | null>(null);
  const [clerkError, setClerkError] = React.useState<string | null>(null);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setFormError(null);
    setClerkError(null);

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await signUp.create({
        username: username.trim(),
        emailAddress: emailAddress.trim().toLowerCase(),
        password: password.trim(),
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPendingVerification(true);
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Something went wrong. Please try again.';

      setClerkError(message);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setClerkError(null);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({
          session: signUpAttempt.createdSessionId,
        });
        if (returnTo) {
          router.replace(returnTo);
        } else {
          router.replace('/');
        }
      } else {
        setClerkError('Verification could not be completed.');
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Invalid verification code.';

      setClerkError(message);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className='flex-1 justify-center start bg-background px-6'>
        <Header />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View className='rounded-3xl bg-white p-8 shadow-lg mb-2'>
            <View className='mb-8 items-center'>
              <Text className='mb-2 text-3xl font-bold text-primary'>
                Check Your Email
              </Text>
              <Text className='text-center text-lg text-secondary'>
                We sent you a verification code
              </Text>
            </View>

            <View className='gap-y-4'>
              <TextInput
                value={code}
                autoFocus
                placeholder='Enter verification code'
                className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
                onChangeText={setCode} />

              {clerkError && (
                <Text className='text-center text-sm text-red-600'>
                  {clerkError}
                </Text>
              )}

              <TouchableOpacity
                onPress={onVerifyPress}
                className='mt-6 rounded-2xl bg-primary py-4'>
                <Text className='text-center text-lg font-semibold text-white'>
                  Verify
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPendingVerification(false)}
                className='mt-4 rounded-2xl bg-accent/20 py-4'>
                <Text className='text-center text-lg font-semibold text-primary'>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 justify-center bg-background px-6'>
      <Header />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View className='mb-2 rounded-3xl bg-white p-8 shadow-lg'>
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>
              Join Us!
            </Text>
            <Text className='text-lg text-secondary'>
              Create your account
            </Text>
          </View>

          <View className='gap-y-2'>
            <TextInput
              autoFocus
              autoCapitalize='none'
              value={username}
              placeholder='Enter username'
              className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
              onChangeText={setUsername} />
            <TextInput
              autoCapitalize='none'
              value={emailAddress}
              placeholder='Enter email'
              className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
              onChangeText={setEmailAddress} />
            <TextInput
              value={password}
              placeholder='Enter password'
              secureTextEntry
              className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
              onChangeText={setPassword} />
            <TextInput
              value={confirmPassword}
              placeholder='Confirm password'
              secureTextEntry
              className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
              onChangeText={setConfirmPassword} />

            {formError && (
              <Text className='text-sm text-red-600'>{formError}</Text>
            )}

            {clerkError && (
              <Text className='text-sm text-red-600'>{clerkError}</Text>
            )}

            <TouchableOpacity
              onPress={onSignUpPress}
              className='mt-6 rounded-full bg-primary h-10 justify-center'>
              <Text className='text-center text-lg font-semibold text-white'>
                Continue
              </Text>
            </TouchableOpacity>

            <SignUpWithGoogle />
          </View>

          <View className='mt-8 flex-row items-center justify-center'>
            <Text className='text-base text-secondary'>
              Already have an account?{' '}
            </Text>
            <Link href='../'>
              <Text className='text-base font-semibold text-primary'>
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
