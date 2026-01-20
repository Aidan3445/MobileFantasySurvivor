import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';
import { type LeagueMember } from '~/types/leagueMembers';
import { type EnrichedCastaway } from '~/types/castaways';
import { useLeagueSettings } from '~/hooks/leagues/query/useLeagueSettings';
import { divideY } from '~/lib/ui';
import ColorRow from '~/components/shared/colorRow';
import SurvivalStreaks from '~/components/leagues/hub/scoreboard/popover/survivalStreaks';

interface MemberRowProps {
  place: number;
  member: LeagueMember;
  currentStreak?: number;
  castaway?: EnrichedCastaway;
  selectionList?: (EnrichedCastaway | null)[];
  secondaryPick?: EnrichedCastaway | null;
  secondaryPickList?: (EnrichedCastaway | null)[];
  points: number;
  color: string;
  overrideHash?: string;
  doubleBelow?: boolean;
  shotInTheDarkStatus?: { episodeNumber: number, status: 'pending' | 'saved' | 'wasted' } | null;
}

export default function MemberRow({
  place,
  member,
  currentStreak,
  castaway,
  secondaryPick,
  points,
  color,
  doubleBelow,
  overrideHash,
  shotInTheDarkStatus
}: MemberRowProps) {
  const { data: leagueSettings } = useLeagueSettings(overrideHash);

  const isTopThree = place <= 3;
  const rankBadgeColor = place === 1
    ? 'bg-yellow-500/50 border-yellow-500/40'
    : place === 2
      ? 'bg-gray-400/50 border-gray-400/40'
      : place === 3
        ? 'bg-amber-700/50 border-amber-700/40'
        : 'bg-primary/10 border-primary/30';
  const rankTextColor = place === 1
    ? 'text-yellow-800'
    : place === 2
      ? 'text-gray-800'
      : place === 3
        ? 'text-amber-900'
        : 'text-primary';

  return (
    <View
      className={cn(
        'h-10 flex-row gap-x-1 p-1',
        divideY(place - 1),
        doubleBelow && 'border-dashed'
      )}>
      <View className='w-11 inline-flex items-center justify-center'>
        <View className={cn(
          'w-8 h-8 rounded-md font-black text-sm border-2 transition-all flex items-center justify-center',
          rankBadgeColor,
          isTopThree && 'shadow-md'
        )}>
          <Text className={cn('font-black', rankTextColor)}>
            {place}
          </Text>
        </View>
      </View>
      <View className='w-10 items-center justify-center'>
        <Text className='text-center font-black'>
          {points}
        </Text>
      </View>
      <ColorRow color={color} className='flex-1 items-start justify-center'>
        <Text className={cn(
          'text-left font-bold',
          member.loggedIn && 'text-primary'
        )}>
          {member.displayName}
        </Text>
      </ColorRow>
      <View className='w-20 justify-center'>
        <Text
          className={cn(
            'text-base font-bold transition-all hover:text-primary cursor-pointer text-nowrap',
            castaway?.eliminatedEpisode && 'line-through opacity-40 hover:opacity-60'
          )}>
          {castaway?.shortName || 'None'}
        </Text>
      </View>
      {leagueSettings?.secondaryPickEnabled && (secondaryPick ? (
        <View className='w-20 justify-center'>
          <Text
            className={cn(
              'text-base font-bold transition-all hover:text-primary cursor-pointer text-nowrap',
              secondaryPick.eliminatedEpisode && 'line-through opacity-40 hover:opacity-60'
            )}>
            {secondaryPick?.shortName || 'None'}
          </Text>
        </View>
      ) : (
        <View className='w-20 justify-center'>
          <Text className='text-base md:text-lg font-bold text-muted-foreground'>
            {secondaryPick === null ? 'Hidden' : 'Pending'}...
          </Text>
        </View>
      ))}
      {leagueSettings && leagueSettings.survivalCap > 0 && (
        <View className='w-6 items-center justify-center'>
          <SurvivalStreaks
            currentStreak={currentStreak}
            eliminatedEpisode={castaway?.eliminatedEpisode}
            shotInTheDarkStatus={shotInTheDarkStatus}
            survivalCap={leagueSettings.survivalCap} />
        </View>
      )}
    </View>
  );
}
