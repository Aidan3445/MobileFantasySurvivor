'use client';

import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import KeyboardContainer from '~/components/common/keyboardContainer';
import Header from '~/components/home/header/view';
import LeagueMember from '~/components/leagues/actions/create/leagueMember';
import { useJoinLeague } from '~/hooks/leagues/mutation/useJoinLeague';
import { cn } from '~/lib/utils';

export default function JoinLeagueScreen() {
  const { reactForm, handleSubmit, getPublicLeague } = useJoinLeague();

  return (
    <KeyboardContainer>
      <View className='flex-1 justify-center bg-background px-6 py-24'>
        <View className='h-90p items-center justify-end overflow-hidden rounded-lg bg-card pt-6'>
          <View className='flex-1'>
            <Text className='text-center text-2xl font-bold'>
              Join {getPublicLeague?.data?.name ?? 'League'}
            </Text>
            <Header />
          </View>
          <View className='flex-1'>
            <LeagueMember control={reactForm.control} className='mb-14' />
            <View className='w-90p relative items-center self-center'>
              <Button
                onPress={handleSubmit}
                disabled={!reactForm.formState.isValid}
                className={cn(
                  'absolute bottom-4 w-1/2 rounded-md bg-primary px-4 py-2'
                )}
              >
                <Text className='text-center font-semibold text-white'>
                  Join League
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </KeyboardContainer>
  );
}
