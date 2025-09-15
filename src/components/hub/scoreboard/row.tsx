import { View, Text, Pressable } from 'react-native';
import { MoveRight, Circle, Flame, History, Skull } from 'lucide-react-native';
import { cn } from '~/lib/util';
import { getContrastingColor } from '@uiw/color-convert';
import { type LeagueMember } from '~/types/leagueMembers';
import { type EnrichedCastaway } from '~/types/castaways';
import { useMemo, useState } from 'react';
import { useTribesTimeline } from '~/hooks/seasons/useTribesTimeline';
import { type Tribe } from '~/types/tribes';
import { useLeagueSettings } from '~/hooks/leagues/useLeagueSettings';
import { divideY } from '~/lib/ui';

interface MemberRowProps {
  place: number;
  member: LeagueMember;
  currentStreak?: number;
  selectionList?: (EnrichedCastaway | null)[];
  points: number;
  castaway?: EnrichedCastaway;
  color: string;
  overrideHash?: string;
  doubleBelow?: boolean;
}

export default function MemberRow({
  place,
  member,
  currentStreak,
  selectionList,
  points,
  castaway,
  color,
  doubleBelow,
  overrideHash
}: MemberRowProps) {
  const { data: tribesTimeline } = useTribesTimeline(castaway?.seasonId ?? null);
  const { data: leagueSettings } = useLeagueSettings(overrideHash);
  const [showHistory, setShowHistory] = useState(false);
  const [showStreak, setShowStreak] = useState(false);

  const condensedTimeline = useMemo(() => (selectionList ?? [])
    .reduce((acc, castaway, index) => {
      if (castaway === null) return acc;

      const prev = acc[acc.length - 1];
      if (prev) {
        acc[acc.length - 1] = { ...prev, end: index - 1 };
      }

      if (acc[acc.length - 1]?.castaway?.fullName === castaway.fullName) {
        acc[acc.length - 1]!.end = index;
        return acc;
      }
      return [...acc, {
        castaway,
        start: acc.length === 0 ? 'Draft' : index,
        end: castaway.eliminatedEpisode
      }];
    }, [] as { castaway: EnrichedCastaway, start: number | string, end: number | null }[]),
    [selectionList]);

  const castawayTribes = useMemo(() => {
    if (!castaway || !tribesTimeline) return [];

    const sortedTimeline = Object.entries(tribesTimeline)
      .map(([episode, tribeUpdates]) => ({
        episode: Number(episode),
        tribeUpdates
      }))
      .sort((a, b) => a.episode - b.episode);

    const tribes: { tribe: Tribe, episode: number }[] = [];

    for (const { tribeUpdates } of sortedTimeline) {
      for (const [tribeId, castawayIds] of Object.entries(tribeUpdates)) {
        if (castawayIds.includes(castaway.castawayId)) {
          const tribeInfo = tribes.find(t => t.tribe.tribeId === Number(tribeId));
          if (tribeInfo) continue;

          const tribeData = tribes.find(t => t.tribe.tribeId === Number(tribeId));
          if (tribeData) {
            tribes.push(tribeData);
          }
        }
      }
    }

    return tribes;
  }, [castaway, tribesTimeline]);

  return (
    <View className={cn('flex-row p-1 gap-x-1 h-7', divideY(place - 1), doubleBelow && 'border-dashed')}>
      <View
        className='w-11 items-center justify-center rounded'
        style={{ backgroundColor: color }}>
        <Text
          className='text-center font-medium'
          style={{ color: getContrastingColor(color) }}>
          {place}
        </Text>
      </View>
      <View
        className='w-8 items-center justify-center rounded'
        style={{ backgroundColor: color }}>
        <Text
          className='text-center font-medium'
          style={{ color: getContrastingColor(color) }}>
          {points}
        </Text>
      </View>
      <View
        className={cn(
          'flex-1 items-center justify-center rounded',
          member.loggedIn && 'border-white border leading-0'
        )}
        style={{ backgroundColor: color }}>
        <Text
          className={cn('text-center', member.loggedIn && 'font-bold')}
          style={{ color: getContrastingColor(color) }}>
          {member.displayName}
        </Text>
      </View>
      <View
        className='w-24 rounded'
        style={{ backgroundColor: castaway?.eliminatedEpisode ? '#AAAAAA' : castaway?.tribe?.color }}>
        <View className='flex-row items-center'>
          <Text
            className='flex-1 text-center text-sm'
            style={{ color: getContrastingColor(castaway?.eliminatedEpisode ? '#AAAAAA' : castaway?.tribe?.color ?? '#AAAAAA') }}>
            {castaway?.shortName || 'None'}
          </Text>
          <View className='flex-row items-center'>
            {castawayTribes.length > 1 && castawayTribes.map(({ tribe, episode }) => (
              <Pressable key={`${tribe.tribeName}-${episode}`} className='mr-1'>
                <Circle size={16} fill={tribe.tribeColor} />
              </Pressable>
            ))}
            <Pressable
              className='mr-1'
              onPress={() => setShowHistory(!showHistory)}>
              <History
                size={16}
                color={castaway?.eliminatedEpisode
                  ? 'black'
                  : getContrastingColor(castaway?.tribe?.color ?? '#AAAAAA')} />
            </Pressable>
            {leagueSettings && leagueSettings.survivalCap > 0 && (
              <Pressable onPress={() => setShowStreak(!showStreak)}>
                <View className='w-4 items-center justify-center'>
                  {castaway?.eliminatedEpisode ? (
                    <Skull size={16} />
                  ) : (
                    <Text className={cn('text-xs font-bold',
                      castaway?.eliminatedEpisode ? 'black' : getContrastingColor(castaway?.tribe?.color ?? '#AAAAAA'))}>
                      {Math.min(currentStreak ?? Infinity, leagueSettings.survivalCap)}
                    </Text>
                  )}
                </View>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {showHistory && (
        <View className='absolute top-full right-0 bg-white border border-gray-300 rounded p-2 z-10'>
          <Text className='font-semibold text-center mb-2'>Selection History</Text>
          {condensedTimeline.map(({ castaway, start, end }, index) => (
            <View key={index} className='flex-row items-center justify-between mb-1'>
              <View
                className='px-2 py-1 rounded flex-1 mr-2'
                style={{ backgroundColor: castaway.tribe?.color ?? '#AAAAAA' }}>
                <Text className='text-xs text-center'>{castaway.fullName}</Text>
              </View>
              <View className='flex-row items-center'>
                <Text className='text-xs'>{start}</Text>
                <MoveRight size={12} className='mx-1' />
                <Text className='text-xs'>{end ? `${end}` : 'Present'}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      {showStreak && (
        <View className='absolute top-full right-0 bg-white border border-gray-300 rounded p-2 z-10'>
          <Text className='text-xs'>Survival streak: {currentStreak ?? 0}</Text>
          <View className='h-px bg-gray-300 my-1' />
          <View className='flex-row items-center'>
            <Text className='text-xs'>Point cap: {leagueSettings?.survivalCap}</Text>
            <Flame size={12} className='ml-1' />
          </View>
        </View>
      )}
    </View>
  );
}
