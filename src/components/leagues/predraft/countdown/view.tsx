import { View, Text } from 'react-native';
import Button from '~/components/common/button';
import { useRouter } from 'expo-router';
import { useLeagueSettings } from '~/hooks/leagues/query/useLeagueSettings';
import { useLeagueMembers } from '~/hooks/leagues/query/useLeagueMembers';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useFetch } from '~/hooks/helpers/useFetch';
import Clock from '~/components/leagues/predraft/countdown/clock';

interface DraftCountdownProps {
  overrideHash?: string;
}

export function DraftCountdown({ overrideHash }: DraftCountdownProps) {
  const putData = useFetch('PUT');
  const queryClient = useQueryClient();
  const { data: league } = useLeague(overrideHash);
  const { data: leagueSettings } = useLeagueSettings(overrideHash);
  const { data: leagueMembers } = useLeagueMembers(overrideHash);
  const router = useRouter();

  const editable = useMemo(
    () =>
      leagueMembers?.loggedIn &&
      leagueMembers.loggedIn.role === 'Owner' &&
      leagueSettings &&
      (leagueSettings.draftDate === null ||
        Date.now() < leagueSettings.draftDate.getTime()),
    [leagueMembers, leagueSettings]
  );

  const onDraftJoin = async () => {
    if (!league) return;
    if (league.status === 'Predraft') {
      const res = await putData(`/api/leagues/${league.hash}/status`);
      if (res.status !== 200) {
        // You might want to use a proper alert/toast component
        console.error(`Failed to join draft: ${res.statusText}`);
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: ['league', league.hash],
      });
      await queryClient.invalidateQueries({
        queryKey: ['settings', league.hash],
      });
    }
    router.push(`/leagues/${league.hash}/draft`);
  };

  return (
    <View className='w-full rounded-xl bg-card p-2'>
      <View className='w-full flex-row items-center'>
        <View className='flex-1'>
          <View className='flex-col items-baseline gap-y-0'>
            <Text className='text-accent-foreground text-lg font-bold leading-none'>
              Draft Countdown
            </Text>
            <Text className='text-sm leading-none text-muted-foreground'>
              {leagueSettings?.draftDate
                ? leagueSettings.draftDate.getTime() > Date.now()
                  ? `Starts at: ${leagueSettings.draftDate.toLocaleString()}`
                  : 'Draft is live'
                : 'Draft set to manual start by commissioner'}
            </Text>
          </View>
        </View>
        {editable && (
          <Button
            onPress={onDraftJoin}
            className='rounded-md bg-navigation p-1'
          >
            <Text className='text-accent-foreground'>Draft Now</Text>
          </Button>
        )}
      </View>
      <View className='mt-2 rounded-2xl bg-primary p-2 shadow-sm'>
        <Clock
          endDate={leagueSettings?.draftDate ?? null}
          replacedBy={
            <Button
              className='w-full rounded-xl bg-navigation p-2'
              onPress={onDraftJoin}
            >
              <Text className='p-1 text-center text-2xl font-semibold text-primary'>
                Join now!
              </Text>
            </Button>
          }
        />
      </View>
    </View>
  );
}
