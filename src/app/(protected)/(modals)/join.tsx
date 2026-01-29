import { Text, View, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useLocalSearchParams, Redirect, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Button from '~/components/common/button';
import Modal from '~/components/common/modal';
import LeagueMember from '~/components/leagues/actions/create/leagueMember';
import EnterHash from '~/components/leagues/actions/join/enterHash';
import ErrorHash from '~/components/leagues/actions/join/errorHash';
import JoinLeagueHeader from '~/components/leagues/actions/join/header/view';
import { useJoinLeague } from '~/hooks/leagues/mutation/useJoinLeague';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import LoadingScreen from '~/components/auth/loadingScreen';
import { useAuth } from '@clerk/clerk-expo';

interface PageConfig {
  name: 'hash' | 'member';
  optional: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function JoinLeagueScreen() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { hash, redirectTo } = useLocalSearchParams<{ hash?: string, redirectTo?: string }>();
  const { reactForm, handleSubmit, getPublicLeague, isSubmitting } = useJoinLeague();

  const [joinCode, setJoinCode] = useState(hash ?? '');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const pages: PageConfig[] = [
    { name: 'hash', optional: false, isFirst: true },
    { name: 'member', optional: false, isLast: true },
  ];

  const { props, ref, progress } = useCarousel<PageConfig>(pages);

  const codeValid = joinCode.trim().length > 0;

  const goNext = useCallback(() => {
    Keyboard.dismiss();
    if (codeValid) {
      router.setParams({ hash: joinCode.trim() });
      ref.current?.next();
    }
  }, [ref, joinCode, codeValid, router]);

  const goBack = useCallback(() => {
    Keyboard.dismiss();
    setJoinCode('');
    router.setParams({ hash: undefined });
    ref.current?.prev();
  }, [ref, router]);

  // If hash provided via URL, auto-advance to member page
  useEffect(() => {
    if (hash) {
      setJoinCode(hash);
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        ref.current?.scrollTo({ index: 1, animated: false });
      }, 1000);
    }
  }, [hash, ref, progress]);

  // Show error modal when league fetch fails
  useEffect(() => {
    if (getPublicLeague.isError) {
      setErrorModalVisible(true);
    }
  }, [getPublicLeague.isError]);

  const handleErrorDismiss = () => {
    setErrorModalVisible(false);
    goBack();
  };

  const renderPageContent = (pageName: 'hash' | 'member', canGoNext?: boolean) => {
    switch (pageName) {
      case 'hash':
        return (
          <EnterHash
            value={joinCode}
            onChangeText={setJoinCode}
            onSubmitEditing={goNext}
            canGoNext={canGoNext} />
        );
      case 'member':
        return (
          <LeagueMember control={reactForm.control} usedColors={getPublicLeague?.data?.usedColors} />
        );
      default:
        return null;
    }
  };

  if (!isSignedIn && !redirectTo) {
    console.log('User not sgned in, redirecting to sign-in page', hash);
    if (router.canGoBack()) router.dismiss();
    return null;
  }

  if (getPublicLeague.isLoading) {
    return <LoadingScreen noBounce />;
  }

  if (getPublicLeague?.data?.isMember) {
    console.log('Already a member, redirecting to league page');
    return <Redirect href={`/leagues/${getPublicLeague.data.hash}`} />;
  }

  if (getPublicLeague?.data?.isPending) {
    Alert.alert('Pending Invitation',
      'You already tried to join this league. Please wait for the league admin to approve your request.');
    return <Redirect href='/(tabs)' />;
  }

  return (
    <View className='page py-16'>
      <JoinLeagueHeader leagueName={hash ? getPublicLeague?.data?.name : undefined} />

      <KeyboardAvoidingView
        className='flex-1'
        behavior={progress === 1 ? undefined : Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 px-1.5 pt-8'>
          {/* Carousel */}
          <Carousel
            ref={ref}
            {...props}
            enabled={false}
            renderItem={({ item }) => {
              const isHashPage = item.name === 'hash';
              const isValid = isHashPage ? codeValid : reactForm.formState.isValid;
              const buttonDisabled = !isValid || (item.isLast && isSubmitting);

              return (
                <View className='flex-1' onTouchStart={() => Keyboard.dismiss()}>
                  {/* Content */}
                  <View className='flex-1 justify-start'>
                    {renderPageContent(item.name, !buttonDisabled)}
                  </View>

                  {/* Navigation */}
                  <View className='flex-row items-center justify-center gap-4 px-6 pb-24'>
                    {/* Back Button */}
                    {!item.isFirst && (
                      <Button
                        onPress={goBack}
                        className='h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-transparent active:bg-primary/10'>
                        <ArrowLeft size={20} color={colors.primary} />
                      </Button>
                    )}

                    {/* Main Action Button */}
                    <Button
                      onPress={() => {
                        Keyboard.dismiss();
                        if (item.isLast) {
                          handleSubmit();
                        } else {
                          goNext();
                        }
                      }}
                      disabled={buttonDisabled}
                      className={cn(
                        'w-1/2 rounded-lg bg-primary py-3 active:opacity-80',
                        !item.isFirst && 'mr-16',
                        buttonDisabled && 'opacity-50'
                      )}>
                      <Text className='text-center text-base font-bold text-white'>
                        {isSubmitting ? 'Joining...' : item.isLast ? 'Join League' : 'Next'}
                      </Text>
                    </Button>
                  </View>
                </View>
              );
            }} />
        </View>
      </KeyboardAvoidingView>

      {/* Error Modal */}
      <Modal visible={errorModalVisible} onClose={handleErrorDismiss}>
        <ErrorHash onBack={handleErrorDismiss} />
      </Modal>
    </View>
  );
}
