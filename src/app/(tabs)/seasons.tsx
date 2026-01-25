import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import RefreshIndicator from '~/components/common/refresh';
import { cn } from '~/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefresh } from '~/hooks/helpers/refresh/useRefresh';
import SeasonsHeader from '~/components/seasons/header/view';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import { Tabs, TabsContent } from '~/components/common/tabs';
import EventTimeline from '~/components/shared/eventTimeline/view';
import CastawaysView from '~/components/seasons/castaways/view';
import TribesTimeline from '~/components/seasons/tribes/view';

export default function SeasonsScreen() {
  const { refreshing, onRefresh, scrollY, handleScroll } = useRefresh([['seasons']]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const { data: scoreData } = useSeasonsData(true);

  const selectedSeasonData = useMemo(() => {
    if (!scoreData) return null;
    const selected = scoreData.find(season => season.season.name === selectedSeason);
    if (selected) return selected;
    if (scoreData.length > 0) {
      setSelectedSeason(scoreData[0]!.season.name);
      return scoreData[0];
    }
    return null;
  }, [scoreData, selectedSeason]);

  return (
    <Tabs defaultValue='events' className='flex-1 relative bg-red-500'>
      <SafeAreaView edges={['top']} className='flex-1 bg-background relative pt-12'>
        <SeasonsHeader
          seasons={scoreData ?? []}
          value={selectedSeason}
          setValue={setSelectedSeason} />
        <RefreshIndicator
          refreshing={refreshing}
          scrollY={scrollY}
          extraHeight={51 /* Adjust to match header height */} />
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
          <View className={cn(
            'page justify-start gap-y-4 transition-all px-1.5 pt-6',
            refreshing && 'pt-10'
          )}>
            <TabsContent value='events'>
              <EventTimeline seasonData={selectedSeasonData!} hideMemberFilter />
            </TabsContent>
            <TabsContent value='castaways'>
              <CastawaysView seasonData={selectedSeasonData!} />
            </TabsContent>
            <TabsContent value='tribes'>
              <TribesTimeline seasonData={selectedSeasonData!} />
            </TabsContent>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Tabs>
  );
}
