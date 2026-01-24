import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';
import PlaygroundHeader from '~/components/playground/header/view';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import ScoreboardTable from '~/components/home/scoreboard/table';
import { useBaseEventRules } from '~/hooks/leagues/mutation/useBaseEventRules';
import ChallengeScoreSettings from '~/components/leagues/customization/events/base/challenges';
import AdvantageScoreSettings from '~/components/leagues/customization/events/base/advantages';
import OtherScoreSettings from '~/components/leagues/customization/events/base/other';
import { BaseEventRulesZod } from '~/types/leagues';
import Button from '~/components/common/button';
import { colors } from '~/lib/colors';

export default function PlaygroundScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useRefresh([['seasons']]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const { data: scoreData } = useSeasonsData(true);
  const { reactForm } = useBaseEventRules();

  const selectedSeasonData = useMemo(() => {
    if (!scoreData) return null;
    return (
      scoreData.find((season) => season.season.name === selectedSeason) ?? scoreData[1]
    );
  }, [scoreData, selectedSeason]);

  return (
    <SafeAreaView edges={['top']} className='relative flex-1 bg-background'>
      <PlaygroundHeader
        seasons={scoreData ?? []}
        value={selectedSeason}
        setValue={setSelectedSeason} />
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View
          className={cn(
            'page justify-start gap-y-4 px-2 pt-8 transition-all',
            refreshing && 'pt-12'
          )}>
          {/* Scoring Settings Card */}
          <View className='rounded-lg border-2 border-primary/20 bg-card p-4 shadow-lg shadow-primary/10'>
            {/* Description */}
            <View className='mb-4'>
              <Text className='text-center font-medium text-muted-foreground'>
                Test out different scoring configurations and see how they impact the
                castaway scores!
              </Text>
            </View>

            {/* Settings Accordions */}
            <View className='gap-2'>
              <ChallengeScoreSettings reactForm={reactForm} hidePrediction />
              <AdvantageScoreSettings reactForm={reactForm} hidePrediction />
              <OtherScoreSettings reactForm={reactForm} hidePrediction />
            </View>

            {/* Reset Button */}
            <Button
              className='mt-4 flex-row items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-transparent p-3 active:bg-primary/10'
              onPress={() => reactForm.reset()}>
              <RotateCcw size={16} color={colors.primary} />
              <Text className='text-xs font-bold uppercase tracking-wider text-primary'>
                Reset Scoring
              </Text>
            </Button>
          </View>

          {/* Scoreboard */}
          {selectedSeasonData ? (
            <ScoreboardTable
              className='relative overflow-hidden rounded-xl border-2 border-primary/20 bg-card'
              scoreData={[selectedSeasonData]}
              overrideBaseRules={BaseEventRulesZod.parse(reactForm.watch('baseEventRules'))} />
          ) : (
            <View className='relative w-full items-center overflow-hidden rounded-xl border-2 border-primary/20 bg-card p-4'>
              <Text className='text-primary'>Loading season...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
