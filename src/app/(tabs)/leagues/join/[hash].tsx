'use client';

import { Pressable, Text, View } from 'react-native';
import KeyboardContainer from '~/components/common/keyboardContainer';
import Header from '~/components/home/header/view';
import LeagueMember from '~/components/leagues/actions/create/leagueMember';
import { useJoinLeague } from '~/hooks/leagues/mutation/useJoinLeague';
import { cn } from '~/lib/utils';

export default function JoinLeagueScreen() {
  const { reactForm, handleSubmit, getPublicLeague } = useJoinLeague();

  return (
    <KeyboardContainer>
      <View className='flex-1 bg-background justify-center px-6 py-24'>
        <View className='h-90p pt-6 bg-card rounded-lg items-center justify-end overflow-hidden'>
          <View className='flex-1'>
            <Text className='text-center text-2xl font-bold'>
              Join {getPublicLeague?.data?.name ?? 'League'}
            </Text>
            <Header />
          </View>
          <View className='flex-1'>
            <LeagueMember control={reactForm.control} />
            <View className='self-center items-center w-90p relative'>
              <Pressable
                onPress={handleSubmit}
                disabled={!reactForm.formState.isValid}
                className={cn('bg-primary rounded-md px-4 py-2 absolute bottom-4 w-1/2 disabled:opacity-50')}>
                <Text className='text-white text-center font-semibold'>Join League</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardContainer>
  );
}
