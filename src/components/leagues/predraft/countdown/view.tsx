import { View, Text, Pressable } from 'react-native';
import Button from '~/components/common/button';
import { useRouter } from 'expo-router';
import { useLeagueSettings } from '~/hooks/leagues/query/useLeagueSettings';
import { useLeagueMembers } from '~/hooks/leagues/query/useLeagueMembers';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useFetch } from '~/hooks/helpers/useFetch';
import Clock from '~/components/leagues/predraft/countdown/clock';
import { Lock, Unlock, Calendar, CalendarX2 } from 'lucide-react-native';
import { colors } from '~/lib/colors';
import { cn } from '~/lib/utils';
import SetDraftDate from '~/components/leagues/predraft/countdown/edit';

interface DraftCountdownProps {
  overrideHash?: string;
  className?: string;
}

export function DraftCountdown({ overrideHash, className }: DraftCountdownProps) {
  const putData = useFetch('PUT');
  const queryClient = useQueryClient();
  const { data: league } = useLeague(overrideHash);
  const { data: leagueSettings } = useLeagueSettings(overrideHash);
  const { data: leagueMembers } = useLeagueMembers(overrideHash);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const editable = useMemo(
    () =>
      leagueMembers?.loggedIn
      && leagueMembers.loggedIn.role === 'Owner'
      && leagueSettings
      && (leagueSettings.draftDate === null || Date.now() < leagueSettings.draftDate.getTime()),
    [leagueMembers, leagueSettings]
  );

  const onDraftJoin = async () => {
    if (!league) return;
    if (league.status === 'Predraft') {
      const res = await putData(`/api/leagues/${league.hash}/status`);
      if (res.status !== 200) {
        console.error(`Failed to join draft: ${res.statusText}`);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['league', league.hash] });
      await queryClient.invalidateQueries({ queryKey: ['settings', league.hash] });
    }
    router.push(`/leagues/${league.hash}/draft`);
  };

  return (
    <View className={cn('w-full p-2 pt-1', className)}>
      {/* Header */}
      <View>
        <View className='flex-row items-center justify-between mb-1'>
          <View className='flex-row items-center gap-1'>
            <View className='h-6 w-1 bg-primary rounded-full' />
            <Text className='text-xl font-black uppercase tracking-tight'>
              Draft Status
            </Text>
          </View>

          {/* Action Buttons */}
          {editable && (
            <Pressable onPress={() => setModalOpen(true)}>
              {modalOpen ? (
                <Unlock size={24} color={colors.secondary} />
              ) : (
                <Lock size={24} color={colors.primary} />
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* Countdown / Action */}
      <View>
        <View className='bg-accent border border-primary/40 rounded-md overflow-hidden'>
          <View className='px-3 pb-1 flex-row items-center gap-2'>
            {leagueSettings?.draftDate && leagueSettings.draftDate.getTime() > Date.now() ? (
              <>
                <Calendar size={16} stroke={colors.primary} />
                <Text className='text-sm font-medium text-primary'>
                  Starts: {leagueSettings.draftDate.toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </>
            ) : (
              <>
                <CalendarX2 size={16} stroke={colors.primary} />
                <Text className='text-sm font-medium text-primary'>
                  Draft date not scheduled
                </Text>
              </>
            )}
          </View>
          <Clock
            endDate={leagueSettings?.draftDate ?? null}
            replacedBy={
              <Button
                className='w-full rounded-none p-4'
                disabled={!league || (leagueMembers?.loggedIn?.role !== 'Owner' && league?.status !== 'Draft')}
                onPress={onDraftJoin}>
                <Text className='text-center text-2xl font-black uppercase tracking-wider text-primary-foreground'>
                  {league?.status === 'Draft'
                    ? 'Join Draft'
                    : leagueMembers?.loggedIn?.role === 'Owner'
                      ? 'Start Draft'
                      : 'Waiting for Commissioner'}
                </Text>
              </Button>
            } />
        </View>
      </View>

      <SetDraftDate
        overrideHash={overrideHash}
        modalOpen={modalOpen}
        setModalOpen={() => setModalOpen(false)} />
    </View>
  );
}
