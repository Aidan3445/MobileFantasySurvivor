import { useSignIn } from '@clerk/clerk-expo';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Header from '~/components/auth/header';
import { SignInWithGoogle } from '~/components/auth/signInWithGoogle';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Page() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({ identifier: emailAddress, password });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        if (returnTo) {
          router.replace(returnTo);
        } else {
          router.replace('/');
        }

      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>Welcome Back!</Text>
            <Text className='text-lg text-secondary'>Sign in to continue</Text>
          </View>

          <View className='gap-y-2'>
            <TextInput
              autoCapitalize='none'
              value={emailAddress}
              placeholder='Enter email'
              className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
              placeholderTextColor='#B58553'
              onChangeText={emailAddress => setEmailAddress(emailAddress)} />
            <TextInput
              value={password}
              placeholder='Enter password'
              secureTextEntry={true}
              className='rounded-2xl border border-accent bg-accent/20 px-4 h-10 text-lg placeholder:text-secondary leading-snug overflow-hidden'
              placeholderTextColor='#B58553'
              onChangeText={password => setPassword(password)} />
            <TouchableOpacity
              onPress={onSignInPress}
              className='mt-6 rounded-full bg-primary h-10 justify-center'>
              <Text className='text-center text-lg font-semibold text-white'>Continue</Text>
            </TouchableOpacity>
            <SignInWithGoogle />
          </View>

          <View className='flex-row items-center justify-center'>
            <Text className='text-base text-secondary'>Don't have an account? </Text>
            <Link href='/sign-up'>
              <Text className='text-base font-semibold text-primary'>Sign up</Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
