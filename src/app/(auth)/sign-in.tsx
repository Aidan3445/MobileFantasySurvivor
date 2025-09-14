import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Header from '~/components/auth/header';


export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
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
    <View className='flex-1 bg-background justify-around p-6'>
      <Header />
      <View className='bg-white rounded-3xl p-8 shadow-lg focus:-translate-y-96 transition-transform duration-[275ms] ease-out'>
        <View className='items-center mb-8'>
          <Text className='text-3xl font-bold text-primary mb-2'>Welcome Back!</Text>
          <Text className='text-secondary text-lg'>Sign in to continue</Text>
        </View>
        <View className='gap-y-2'>
          <TextInput
            autoCapitalize='none'
            value={emailAddress}
            placeholder='Enter email'
            className='bg-accent/20 rounded-2xl px-4 py-4 text-lg border border-accent leading-5'
            placeholderTextColor='#B58553'
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            value={password}
            placeholder='Enter password'
            secureTextEntry={true}
            className='bg-accent/20 rounded-2xl px-4 py-4 text-lg border border-accent leading-5'
            placeholderTextColor='#B58553'
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            onPress={onSignInPress}
            className='bg-primary rounded-2xl py-4 mt-6 shadow-sm'>
            <Text className='text-white text-center text-lg font-semibold'>Continue</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-center mt-8 items-center'>
          <Text className='text-secondary text-base'>Don't have an account? </Text>
          <Link href='/sign-up'>
            <Text className='text-primary font-semibold text-base'>Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
