import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import Header from '~/components/auth/header';

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
        password: password.trim(),
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
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

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
      <View className='flex-1 bg-background justify-center px-6'>
        <View className='bg-white rounded-3xl p-8 shadow-lg focus:-translate-y-40 transition-transform duration-[275ms] ease-out'>
          <View className='items-center mb-8'>
            <Text className='text-3xl font-bold text-primary mb-2'>Check Your Email</Text>
            <Text className='text-secondary text-lg text-center'>We sent you a verification code</Text>
          </View>

          <View className='gap-y-4'>
            <TextInput
              value={code}
              autoFocus
              placeholder='Enter verification code'
              className='bg-accent/20 rounded-2xl px-4 py-4 text-lg border border-accent text-center leading-5 placeholder:text-secondary'
              onChangeText={(code) => setCode(code)}
            />

            <TouchableOpacity
              onPress={onVerifyPress}
              className='bg-primary rounded-2xl py-4 mt-6 shadow-sm'
            >
              <Text className='text-white text-center text-lg font-semibold'>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-background justify-around p-6'>
      <Header />
      <View className='bg-white rounded-3xl p-8 shadow-lg focus:-translate-y-[23rem] transition-transform duration-[275ms] ease-out'>
        <View className='items-center mb-8'>
          <Text className='text-3xl font-bold text-primary mb-2'>Join Us!</Text>
          <Text className='text-secondary text-lg'>Create your account</Text>
        </View>
        <View className='gap-y-2'>
          <TextInput
            autoFocus
            autoCapitalize='none'
            value={username}
            placeholder='Enter username'
            className='bg-accent/20 rounded-2xl px-4 py-4 text-lg border border-accent leading-5 placeholder:text-secondary'
            onChangeText={(email) => setUsername(email)}
          />
          <TextInput
            autoCapitalize='none'
            value={emailAddress}
            placeholder='Enter email'
            className='bg-accent/20 rounded-2xl px-4 py-4 text-lg border border-accent leading-5 placeholder:text-secondary'
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder='Enter password'
            secureTextEntry={true}
            className='bg-accent/20 rounded-2xl px-4 py-4 text-lg border border-accent leading-5 placeholder:text-secondary'
            onChangeText={(password) => setPassword(password)} />
          <TouchableOpacity
            onPress={onSignUpPress}
            className='bg-primary rounded-2xl py-4 mt-6 shadow-sm'>
            <Text className='text-white text-center text-lg font-semibold'>Continue</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-center mt-8 items-center'>
          <Text className='text-secondary text-base'>Already have an account? </Text>
          <Link href='../'>
            <Text className='text-primary font-semibold text-base'>Sign in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
