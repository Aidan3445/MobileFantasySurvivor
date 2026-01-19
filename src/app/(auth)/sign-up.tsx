import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import Header from '~/components/auth/header';
import { SignUpWithGoogle } from '~/components/auth/signUpWithGoogle';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        username: username.trim(),
        emailAddress: emailAddress.trim().toLowerCase(),
        password: password.trim()
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.log('Sign up not complete', { signUpAttempt });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className='flex-1 justify-center bg-background px-6'>
        <View className='transition-keyboard rounded-3xl bg-white p-8 shadow-lg focus:-translate-y-40'>
          <View className='mb-8 items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>Check Your Email</Text>
            <Text className='text-center text-lg text-secondary'>
              We sent you a verification code
            </Text>
          </View>

          <View className='gap-y-4'>
            <TextInput
              value={code}
              autoFocus
              placeholder='Enter verification code'
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-4 text-center text-lg leading-5 placeholder:text-secondary'
              onChangeText={code => setCode(code)}
            />

            <TouchableOpacity
              onPress={onVerifyPress}
              className='mt-6 rounded-2xl bg-primary py-4 shadow-sm'>
              <Text className='text-center text-lg font-semibold text-white'>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 justify-around bg-background p-6 pb-safe-offset-10'>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'flex-end'
        }}>
        <View className='rounded-3xl bg-white p-8 shadow-lg mb-2'>
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>Join Us!</Text>
            <Text className='text-lg text-secondary'>Create your account</Text>
          </View>
          <View className='gap-y-2'>
            <TextInput
              autoFocus
              autoCapitalize='none'
              value={username}
              placeholder='Enter username'
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-4 text-lg leading-5 placeholder:text-secondary'
              onChangeText={email => setUsername(email)}
            />
            <TextInput
              autoCapitalize='none'
              value={emailAddress}
              placeholder='Enter email'
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-4 text-lg leading-5 placeholder:text-secondary'
              onChangeText={email => setEmailAddress(email)}
            />
            <TextInput
              value={password}
              placeholder='Enter password'
              secureTextEntry={true}
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-4 text-lg leading-5 placeholder:text-secondary'
              onChangeText={password => setPassword(password)}
            />
            <TouchableOpacity
              onPress={onSignUpPress}
              className='mt-6 rounded-2xl bg-primary py-4 shadow-sm'>
              <Text className='text-center text-lg font-semibold text-white'>Continue</Text>
            </TouchableOpacity>
            <SignUpWithGoogle />
          </View>
          <View className='mt-8 flex-row items-center justify-center'>
            <Text className='text-base text-secondary'>Already have an account? </Text>
            <Link href='../'>
              <Text className='text-base font-semibold text-primary'>Sign in</Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
