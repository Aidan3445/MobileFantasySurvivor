import { useMemo } from 'react';
import { View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, Flame, Radio } from 'lucide-react-native';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import { useLivePredictions } from '~/hooks/livePredictions/query/useLivePredictions';
import { useLivePredictionStats } from '~/hooks/livePredictions/query/useLivePredictionStats';
import { useLiveScoringSession } from '~/hooks/user/useLiveScoringSession';
import { PointsIcon } from '~/components/icons/generated';
import Button from '~/components/common/button';

const LogoImage = require('~/assets/LogoFull.png');

interface LogoLiveProps {
  className?: string;
}

export default function LogoLive({ className }: LogoLiveProps) {
  const router = useRouter();
  const { airingEpisode, data: predictions, seasonId } = useLivePredictions();
  const { data: stats } = useLivePredictionStats(seasonId);
  const { isOptedIn } = useLiveScoringSession(airingEpisode?.episodeId);

  const isLive = !!airingEpisode;

  const openPredictions = useMemo(
    () => predictions?.filter((p) => p.status === 'Open' && !p.paused) ?? [],
    [predictions]
  );
  const unanswered = useMemo(
    () => openPredictions.filter((p) => !p.userResponse).length,
    [openPredictions]
  );

  return (
    <View className={cn('flex-row items-center justify-evenly', className)}>
      <View className={cn('transition-transform', !isLive && 'items-center')}>
        <Image source={LogoImage} className='h-32 w-72' resizeMode='stretch' />
      </View>

      {isLive && (
        <View>
          <Button
            onPress={() => router.push('/(protected)/(modals)/live')}
            className='active:opacity-80'>

            {/* Not opted in */}
            {!isOptedIn && (
              <View className='h-32 w-32 items-center gap-1.5 rounded-xl border-2 border-primary/20 bg-card px-4 py-3'>
                <Radio size={20} color={colors.primary} />
                <Text className='text-sm font-bold text-primary'>Go Live</Text>
                <Text
                  allowFontScaling={false}
                  className='text-sm text-muted-foreground text-center'>
                  Tap to join live scoring
                </Text>
              </View>
            )}

            {/* Opted in, active predictions */}
            {isOptedIn && openPredictions.length > 1 && (
              <View className='h-32 w-32 items-center justify-between gap-1.5 rounded-xl border-2 border-amber-500/20 bg-card px-4 py-3'>
                <View className='flex-row items-center gap-1'>
                  <Zap size={16} color={colors.amber500 ?? '#f59e0b'} />
                  <Text className='text-sm font-bold text-amber-500'>LIVE</Text>
                </View>
                {unanswered > 0 ? (
                  <View className='items-center'>
                    <Text className='text-lg font-black text-amber-500'>{unanswered}</Text>
                    <Text className='text-sm text-muted-foreground'>
                      {unanswered === 1 ? 'prediction' : 'predictions'}
                    </Text>
                  </View>
                ) : (
                  <Text
                    allowFontScaling={false}
                    className='text-sm text-muted-foreground text-center'>
                    All answered!
                  </Text>
                )}
              </View>
            )}

            {/* Opted in, no active predictions — show stats */}
            {isOptedIn && openPredictions.length === 0 && (
              <View className='h-32 w-32 items-center justify-between gap-1.5 rounded-xl border-2 border-positive/20 bg-card px-4 py-3'>
                <View className='flex-row items-center gap-1'>
                  <Flame size={16} color={colors.positive} />
                  <Text className='text-sm font-bold text-positive'>LIVE</Text>
                </View>
                {stats && stats.totalAnswered > 0 ? (
                  <View className='items-center'>
                    <Text className='text-lg font-black text-positive'>
                      {Math.round(stats.accuracy * 100)}%
                    </Text>
                    <Text className='text-sm text-muted-foreground'>accuracy</Text>
                    {stats.currentStreak > 1 && (
                      <View className='flex-row items-center justify-center'>
                        <View style={{ marginTop: -2 }}>
                          <PointsIcon size={12} color={'#F39040'} />
                        </View>
                        <Text className='text-sm font-bold text-amber-500'>
                          {stats.currentStreak} in a row!
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text
                    allowFontScaling={false}
                    className='text-sm text-muted-foreground text-center'>
                    Waiting for predictions...
                  </Text>
                )}
              </View>
            )}

          </Button>
        </View>
      )}
    </View>
  );
}
