import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useLeagueSettings } from '~/hooks/leagues/useLeagueSettings';
import { useLeagueMembers } from '~/hooks/leagues/useLeagueMembers';
import { useLeague } from '~/hooks/leagues/useLeague';
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

  const editable = useMemo(() =>
    (leagueMembers?.loggedIn && leagueMembers.loggedIn.role === 'Owner') && leagueSettings &&
    (leagueSettings.draftDate === null || Date.now() < leagueSettings.draftDate.getTime()),
    [leagueMembers, leagueSettings]);

  const onDraftJoin = async () => {
    if (!league) return;
    if (league.status === 'Predraft') {
      const res = await putData(`/api/leagues/${league.hash}/status`);
      if (res.status !== 200) {
        // You might want to use a proper alert/toast component
        console.error(`Failed to join draft: ${res.statusText}`);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['league', league.hash] });
      await queryClient.invalidateQueries({ queryKey: ['settings', league.hash] });
    }
    router.push(`/leagues/${league.hash}/draft`);
  };

  return (
    <View className='w-full p-2 bg-card rounded-xl'>
      {/* Header section */}
      <View className='flex-row w-full items-center'>
        <View className='flex-1'>
          <View className='flex-col items-baseline gap-y-0'>
            <Text className='text-lg font-bold text-accent-foreground leading-none'>Draft Countdown</Text>
            <Text className='text-sm text-muted-foreground leading-none'>
              {leagueSettings?.draftDate
                ? (leagueSettings.draftDate.getTime() > Date.now()
                  ? `Starts at: ${leagueSettings.draftDate.toLocaleString()}`
                  : 'Draft is live')
                : 'Draft set to manual start by commissioner'}
            </Text>
          </View>
        </View>
        {editable && (
          <Pressable onPress={onDraftJoin} className='p-1 rounded-md bg-navigation active:bg-navigation/70'>
            <Text className='text-accent-foreground'>
              Draft Now
            </Text>
          </Pressable>
        )}
      </View>

      {/* Countdown/Join button section */}
      <View className='bg-primary rounded-2xl p-2 mt-2 shadow-sm'>
        <Clock endDate={leagueSettings?.draftDate ?? null} replacedBy={
          <Pressable
            className='w-full p-2 rounded-xl bg-navigation active:bg-navigation/70'
            onPress={onDraftJoin}>
            <Text className='text-primary text-2xl text-center font-semibold p-1'>
              Join now!
            </Text>
          </Pressable>
        } />
      </View>
    </View>
  );
}
