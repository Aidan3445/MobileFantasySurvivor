import React, { useRef, useState, useCallback } from 'react';
import { Keyboard, Platform, Text, TextInput, TouchableOpacity, View, type TextInputEndEditingEvent } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import AuthCard from '~/components/auth/wrapper';

type Step = 'email' | 'code' | 'reset';

export default function ForgotPasswordScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const confirmRef = useRef<TextInput>(null);

  const handleEndEditing = useCallback(
    (currentValue: string, setter: (_v: string) => void) =>
      (e: TextInputEndEditingEvent) => {
        if (Platform.OS === 'ios') {
          const nativeText = e.nativeEvent.text;
          if (nativeText !== currentValue) {
            setter(nativeText);
          }
        }
      },
    [],
  );

  const onRequestReset = async () => {
    if (!isLoaded) return;
    setError('');

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim().toLowerCase(),
      });
      Keyboard.dismiss();
      setStep('code');
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Something went wrong. Please try again.'
      );
    }
  };

  const onVerifyCode = () => {
    if (!code.trim()) {
      setError('Please enter the reset code.');
      return;
    }
    setError('');
    setStep('reset');
  };

  const onResetPassword = async () => {
    if (!isLoaded) return;
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'needs_second_factor') {
        setError('2FA is required but not yet supported here.');
      } else if (result.status === 'complete') {
        await setActive({
          session: result.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.replace('/');
          },
        });
      }
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Invalid code or password. Please try again.'
      );
    }
  };

  const goBack = () => {
    setError('');
    if (step === 'reset') {
      setPassword('');
      setConfirmPassword('');
      setStep('code');
    } else if (step === 'code') {
      setCode('');
      setStep('email');
    } else {
      router.back();
    }
  };

  return (
    <AuthCard>
      {step === 'email' && (
        <>
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>
              Forgot Password?
            </Text>
            <Text className='text-lg text-secondary'>
              Enter your email to reset
            </Text>
          </View>

          <View className='gap-y-2'>
            <TextInput
              autoCapitalize='none'
              value={email}
              placeholder='Enter email'
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
              placeholderTextColor='#B58553'
              autoComplete='email'
              textContentType='emailAddress'
              importantForAutofill='yes'
              onChangeText={setEmail}
              onEndEditing={handleEndEditing(email, setEmail)}
              returnKeyType='done'
              onSubmitEditing={onRequestReset} />

            {error ? (
              <Text className='text-sm text-red-600'>{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onRequestReset}
              className='mb-2 rounded-full bg-primary h-12 justify-center'>
              <Text className='text-center text-lg font-semibold text-white'>
                Send Reset Code
              </Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row items-center justify-center'>
            <Text className='text-base text-secondary'>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className='text-base font-semibold text-primary'>Sign in</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 'code' && (
        <>
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>
              Check Your Email
            </Text>
            <Text className='text-center text-lg text-secondary'>
              We sent a reset code to your email
            </Text>
          </View>

          <View className='gap-y-2'>
            <TextInput
              value={code}
              autoFocus
              placeholder='Enter reset code'
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
              placeholderTextColor='#B58553'
              autoComplete='one-time-code'
              textContentType='oneTimeCode'
              onChangeText={setCode}
              returnKeyType='done'
              onSubmitEditing={onVerifyCode} />

            {error ? (
              <Text className='text-sm text-red-600'>{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onVerifyCode}
              className='mb-2 rounded-full bg-primary h-12 justify-center'>
              <Text className='text-center text-lg font-semibold text-white'>
                Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goBack}
              className='rounded-full border border-accent bg-accent/20 h-12 justify-center'>
              <Text className='text-center text-lg font-semibold text-primary'>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 'reset' && (
        <>
          <View className='items-center'>
            <Text className='mb-2 text-3xl font-bold text-primary'>
              New Password
            </Text>
            <Text className='text-lg text-secondary'>
              Choose a new password
            </Text>
          </View>

          <View className='gap-y-2'>
            <TextInput
              value={password}
              autoFocus
              placeholder='New password'
              secureTextEntry
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
              placeholderTextColor='#B58553'
              autoComplete='new-password'
              textContentType='newPassword'
              importantForAutofill='yes'
              passwordRules='minlength: 8;'
              onChangeText={setPassword}
              onEndEditing={handleEndEditing(password, setPassword)}
              returnKeyType='next'
              onSubmitEditing={() => confirmRef.current?.focus()} />

            <TextInput
              ref={confirmRef}
              value={confirmPassword}
              placeholder='Confirm new password'
              secureTextEntry
              className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
              placeholderTextColor='#B58553'
              autoComplete='new-password'
              textContentType='newPassword'
              importantForAutofill='yes'
              onChangeText={setConfirmPassword}
              onEndEditing={handleEndEditing(confirmPassword, setConfirmPassword)}
              returnKeyType='done'
              onSubmitEditing={onResetPassword} />

            {error ? (
              <Text className='text-sm text-red-600'>{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onResetPassword}
              className='mb-2 rounded-full bg-primary h-12 justify-center'>
              <Text className='text-center text-lg font-semibold text-white'>
                Reset Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goBack}
              className='rounded-full border border-accent bg-accent/20 h-12 justify-center'>
              <Text className='text-center text-lg font-semibold text-primary'>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </AuthCard>
  );
}
