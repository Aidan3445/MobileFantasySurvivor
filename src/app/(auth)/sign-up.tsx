import * as React from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View, type TextInputEndEditingEvent, } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SignUpWithGoogle } from '~/components/auth/signUpWithGoogle';
import AuthCard from '~/components/auth/wrapper';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const [formError, setFormError] = React.useState<string | null>(null);
  const [clerkError, setClerkError] = React.useState<string | null>(null);

  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const confirmRef = React.useRef<TextInput>(null);

  // iOS autofill bypasses onChangeText — onEndEditing fires with the correct native value
  const makeEndEditingHandler = React.useCallback(
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
        router.replace(redirectTo ?? '/');
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
      <AuthCard>
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
            className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
            autoComplete='one-time-code'
            textContentType='oneTimeCode'
            onChangeText={setCode}
            returnKeyType='done'
            onSubmitEditing={onVerifyPress} />

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
      </AuthCard>
    );
  }

  return (
    <AuthCard>
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
          autoCapitalize='none'
          value={username}
          placeholder='Enter username'
          className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
          autoComplete='username-new'
          textContentType='username'
          onChangeText={setUsername}
          onEndEditing={makeEndEditingHandler(username, setUsername)}
          returnKeyType='next'
          onSubmitEditing={() => emailRef.current?.focus()} />
        <TextInput
          ref={emailRef}
          autoCapitalize='none'
          value={emailAddress}
          placeholder='Enter email'
          className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
          autoComplete='email'
          textContentType='emailAddress'
          importantForAutofill='yes'
          onChangeText={setEmailAddress}
          onEndEditing={makeEndEditingHandler(emailAddress, setEmailAddress)}
          returnKeyType='next'
          onSubmitEditing={() => passwordRef.current?.focus()} />
        <TextInput
          ref={passwordRef}
          value={password}
          placeholder='Enter password'
          secureTextEntry
          className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
          autoComplete='new-password'
          textContentType='newPassword'
          importantForAutofill='yes'
          passwordRules='minlength: 8;'
          onChangeText={setPassword}
          onEndEditing={makeEndEditingHandler(password, setPassword)}
          returnKeyType='next'
          onSubmitEditing={() => confirmRef.current?.focus()} />
        <TextInput
          ref={confirmRef}
          value={confirmPassword}
          placeholder='Confirm password'
          secureTextEntry
          className='rounded-2xl border border-accent bg-accent/20 px-4 py-0 h-10 text-lg placeholder:text-secondary leading-tight overflow-hidden'
          autoComplete='new-password'
          textContentType='newPassword'
          importantForAutofill='yes'
          onChangeText={setConfirmPassword}
          onEndEditing={makeEndEditingHandler(confirmPassword, setConfirmPassword)}
          returnKeyType='done'
          onSubmitEditing={onSignUpPress} />

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
        <TouchableOpacity onPress={() => router.back()}>
          <Text className='text-base font-semibold text-primary'>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </AuthCard >
  );
}
