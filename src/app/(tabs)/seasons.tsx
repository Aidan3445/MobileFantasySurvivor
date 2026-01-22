import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';
import * as Screen from '~/components/seasons/page';
import SeasonsHeader from '~/components/seasons/header/view';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import ScoreboardTable from '~/components/home/scoreboard/table';

export default function SeasonsScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useRefresh([['seasons']]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const { data: scoreData, isLoading, error } = useSeasonsData(true);

  const selectedSeasonData = useMemo(() => {
    if (!scoreData) return null;
    console.log('Selected Season:', selectedSeason);
    return scoreData.find(season =>
      season.season.name === selectedSeason) ?? scoreData[0];
  }, [scoreData, selectedSeason]);

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background relative'>
      <SeasonsHeader
        seasons={scoreData ?? []}
        value={selectedSeason}
        setValue={setSelectedSeason} />
      <RefreshIndicator refreshing={refreshing} scrollY={scrollY} />
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='transparent'
            colors={['transparent']}
            progressBackgroundColor='transparent' />
        }>
        <View className={cn(
          'page justify-start gap-y-4 transition-all px-1 pt-6',
          refreshing && 'pt-12'
        )}>
          {selectedSeasonData ? (
            <ScoreboardTable
              className='relative overflow-hidden rounded-xl bg-card border-2 border-primary/20'
              scoreData={[selectedSeasonData]} />
          ) : (
            <View className='relative w-full overflow-hidden rounded-xl bg-card border-2 border-primary/20 p-4 items-center'>
              <Text className='text-primary'>Loading season...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
