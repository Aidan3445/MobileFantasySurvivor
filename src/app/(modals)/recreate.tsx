import { Text, View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { ArrowLeft, Recycle } from 'lucide-react-native';
import { useCallback, useState, useMemo } from 'react';
import { Pressable, Switch } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Button from '~/components/common/button';
import ColorRow from '~/components/shared/colorRow';
import RecreateLeagueHeader from '~/components/leagues/actions/create/recreate/header/view';
import { useLeagues } from '~/hooks/user/useLeagues';
import { useRecreateLeague } from '~/hooks/leagues/mutation/useRecreateLeague';
import { useSeasons } from '~/hooks/seasons/useSeasons';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';

interface PageConfig {
  name: 'selectLeague' | 'selectMembers';
  optional: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function RecreateLeagueScreen() {
  const { data: leagues } = useLeagues();
  const { data: seasons } = useSeasons(true);

  const [selectedHash, setSelectedHash] = useState<string | null>(null);

  const {
    sortedMemberScores,
    selectedMembers,
    toggleMember,
    handleSubmit,
    isSubmitting,
    ownerLoggedIn,
  } = useRecreateLeague(selectedHash ?? '');

  const currentSeason = useMemo(() => {
    if (!seasons || seasons.length === 0) return null;
    return seasons[0];
  }, [seasons]);

  // Filter to only inactive leagues
  const inactiveLeaguesBySeason = useMemo(() => {
    if (!leagues) return [];

    const inactiveMap: Record<string, typeof leagues> = {};

    leagues.forEach((league) => {
      if (league.league.status === 'Inactive') {
        const season = league.league.season;
        inactiveMap[season] ??= [];
        inactiveMap[season].push(league);
      }
    });

    return Object.entries(inactiveMap)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([season, seasonLeagues]) => ({
        season,
        leagues: seasonLeagues,
      }));
  }, [leagues]);

  const pages: PageConfig[] = [
    { name: 'selectLeague', optional: false, isFirst: true },
    { name: 'selectMembers', optional: false, isLast: true },
  ];

  const { props, ref, progress } = useCarousel<PageConfig>(pages);

  const leagueSelected = selectedHash !== null;
  const membersSelected = selectedMembers.size > 0;

  const goNext = useCallback(() => {
    Keyboard.dismiss();
    if (leagueSelected) {
      ref.current?.next();
    }
  }, [ref, leagueSelected]);

  const goBack = useCallback(() => {
    Keyboard.dismiss();
    ref.current?.prev();
  }, [ref]);

  const selectedLeague = useMemo(() => {
    if (!selectedHash || !leagues) return null;
    return leagues.find((l) => l.league.hash === selectedHash);
  }, [selectedHash, leagues]);

  const renderPageContent = (pageName: 'selectLeague' | 'selectMembers') => {
    switch (pageName) {
      case 'selectLeague':
        return (
          <View className='items-center justify-center'>
            {/* Title Section */}
            <View className='mb-6 items-center'>
              <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20'>
                <Recycle size={24} color={colors.primary} />
              </View>
              <Text className='text-center text-xl font-black tracking-wide text-foreground'>
                Select League to Clone
              </Text>
              <Text className='mt-1 text-center text-base text-muted-foreground'>
                Choose a league from a previous season
              </Text>
            </View>

            {/* League Selection */}
            <View className='w-full gap-4'>
              {inactiveLeaguesBySeason.map(({ season, leagues: seasonLeagues }) => (
                <View key={season} className='rounded-lg border-2 border-primary/20 bg-card pb-2'>
                  <View className='flex-row items-center gap-2 p-4'>
                    <View className='h-full w-1 rounded-full bg-secondary' />
                    <Text className='text-lg font-black uppercase tracking-tight text-muted-foreground'>
                      {season}
                    </Text>
                  </View>
                  <View className='gap-2 px-2'>
                    {seasonLeagues.map(({ league, member }) => (
                      <Pressable
                        key={league.hash}
                        onPress={() => setSelectedHash(league.hash)}
                        className={cn(
                          'flex-row items-center justify-between rounded-lg border-2 p-3',
                          selectedHash === league.hash
                            ? 'border-primary bg-primary/10'
                            : 'border-primary/20 bg-primary/5'
                        )}>
                        <View className='flex-1'>
                          <Text className='font-bold text-foreground'>{league.name}</Text>
                          <ColorRow
                            className='mt-1 self-start rounded px-2 py-0.5'
                            color={member.color}>
                            <Text className='text-xs font-semibold text-black'>
                              {member.displayName}
                            </Text>
                          </ColorRow>
                        </View>
                        <View
                          className={cn(
                            'h-6 w-6 items-center justify-center rounded-full border-2',
                            selectedHash === league.hash
                              ? 'border-primary bg-primary'
                              : 'border-primary/30 bg-transparent'
                          )}>
                          {selectedHash === league.hash && (
                            <View className='h-2 w-2 rounded-full bg-white' />
                          )}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}

              {inactiveLeaguesBySeason.length === 0 && (
                <View className='items-center py-8'>
                  <Text className='text-center text-muted-foreground'>
                    No inactive leagues to clone.
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'selectMembers':
        return (
          <View className='items-center justify-center'>
            {/* Title Section */}
            <View className='mb-6 items-center'>
              <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20'>
                <Recycle size={24} color={colors.primary} />
              </View>
              <Text className='text-center text-xl font-black tracking-wide text-foreground'>
                Select Members
              </Text>
              <Text className='mt-1 text-center text-base text-muted-foreground'>
                {currentSeason?.name ?? 'New Season'}
              </Text>
            </View>

            {/* Selected League Info */}
            {selectedLeague && (
              <View className='mb-4 w-full rounded-lg border-2 border-primary/20 bg-primary/5 p-3'>
                <Text className='text-center font-bold text-foreground'>
                  {selectedLeague.league.name}
                </Text>
              </View>
            )}

            {/* Member List */}
            {!ownerLoggedIn ? (
              <View className='w-full items-center rounded-lg border-2 border-destructive/30 bg-destructive/10 p-4'>
                <Text className='text-center text-muted-foreground'>
                  Only the league owner can clone this league.
                </Text>
              </View>
            ) : (
              <View className='w-full gap-2'>
                <Text className='mb-2 text-sm text-muted-foreground'>
                  Draft order will start from the losers of the previous season.
                </Text>
                {sortedMemberScores?.toReversed().map(({ member }) => (
                  <Pressable
                    key={member.memberId}
                    onPress={() => toggleMember(member.memberId, member.loggedIn)}
                    disabled={member.loggedIn}>
                    <ColorRow
                      className='flex-row items-center justify-between rounded-lg border-2 px-3 py-2'
                      color={member.color}>
                      <Text className='font-semibold'>{member.displayName}</Text>
                      <Switch
                        value={selectedMembers.has(member.memberId)}
                        onValueChange={() => toggleMember(member.memberId, member.loggedIn)}
                        disabled={member.loggedIn}
                        trackColor={{ false: '#00000030', true: colors.primary }}
                        thumbColor='white'
                      />
                    </ColorRow>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className='page py-16'>
      <RecreateLeagueHeader />

      <KeyboardAvoidingView
        className='flex-1'
        behavior={progress === 1 ? undefined : Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 px-1.5 pt-8'>
          {/* Carousel */}
          <Carousel
            {...props}
            enabled={false}
            renderItem={({ item }) => {
              const isSelectPage = item.name === 'selectLeague';
              const buttonDisabled = isSelectPage
                ? !leagueSelected
                : !membersSelected || !ownerLoggedIn || isSubmitting;

              return (
                <View className='flex-1' onTouchStart={() => Keyboard.dismiss()}>
                  {/* Content */}
                  <View className='flex-1 justify-start'>{renderPageContent(item.name)}</View>

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
                        {isSubmitting ? 'Cloning...' : item.isLast ? 'Clone League' : 'Next'}
                      </Text>
                    </Button>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
