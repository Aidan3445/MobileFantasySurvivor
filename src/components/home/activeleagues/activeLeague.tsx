import { Link } from 'expo-router';
import { Trophy, Clock } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Button from '~/components/common/button';
import Scoreboard from '~/components/leagues/hub/scoreboard/view';
import { DraftCountdown } from '~/components/leagues/predraft/countdown/view';
import { MAX_LEAGUE_MEMBERS_HOME_DISPLAY } from '~/lib/leagues';
import { type League } from '~/types/leagues';
import { cn } from '~/lib/utils';

interface ActiveLeagueProps {
  league: League;
}

type StatusConfig = {
  label: string;
  color: string;
  textColor: string;
  borderColor: string;
  icon: typeof Trophy | typeof Clock;
};

export default function ActiveLeague({ league }: ActiveLeagueProps) {
  const statusConfig: Record<League['status'], StatusConfig> = {
    Active: {
      label: 'LIVE',
      color: 'bg-green-500/20',
      textColor: 'text-green-600',
      borderColor: 'border-green-500/40',
      icon: Trophy,
    },
    Draft: {
      label: 'DRAFT',
      color: 'bg-blue-500/20',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500/40',
      icon: Clock,
    },
    Predraft: {
      label: 'UPCOMING',
      color: 'bg-yellow-500/20',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-500/40',
      icon: Clock,
    },
    Inactive: {
      label: 'ENDED',
      color: 'bg-gray-500/20',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-500/40',
      icon: Trophy,
    },
  };

  const status = statusConfig[league.status];
  const StatusIcon = status.icon;

  return (
    <View className='px-2 mt-2'>
      {/* League Header Card */}
      <Link
        key={league.hash}
        href={{ pathname: 'leagues/[hash]', params: { hash: league.hash } }}
        asChild>
        <Button className='relative bg-primary/5 border-2 border-primary/20 rounded-lg p-1 active:bg-primary/10'>
          {/* League Name */}
          <Text className='text-2xl font-black leading-tight mb-2 line-clamp-2 h-16'>
            {league.name}
          </Text>

          <View className='flex flex-row items-center justify-between gap-4'>
            {/* Season Badge */}
            <View className='self-start border border-primary/40 rounded-md px-2 py-1'>
              <Text
                className='text-xs font-bold text-primary'
                allowFontScaling={false}>
                {league.season}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              className={cn(
                'flex-row items-center gap-1.5 rounded-md border px-2 py-1',
                status.color,
                status.borderColor
              )}>
              <StatusIcon
                size={12}
                className={status.textColor}
                strokeWidth={3}
              />
              <Text
                className={cn(
                  'text-xs font-black tracking-wider',
                  status.textColor
                )}
                allowFontScaling={false}>
                {status.label}
              </Text>
            </View>
          </View>
        </Button>
      </Link>

      {/* League Content */}
      <View className='mt-4'>
        {league.status === 'Active' ? (
          <View className='bg-primary/5 border border-primary/20 rounded-lg overflow-hidden'>
            <Scoreboard
              overrideHash={league.hash}
              maxRows={MAX_LEAGUE_MEMBERS_HOME_DISPLAY}
              hideSelectionHistory
            />
          </View>
        ) : (
          <DraftCountdown
            overrideHash={league.hash}
            className='bg-primary/5 border border-primary/20'
          />
        )}
      </View>
    </View>
  );
}
