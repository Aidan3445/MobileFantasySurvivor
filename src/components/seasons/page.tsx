import { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useSeasons } from '~/hooks/seasons/useSeasons';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import { cn } from '~/lib/utils';
const LogoImage = require('~/assets/Logo.png');

const TABS = [
  { value: 'events', label: 'Events' },
  { value: 'castaways', label: 'Castaways' },
  { value: 'tribes', label: 'Tribes' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

export default function SeasonsScreen() {
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>('events');

  const { data: seasons } = useSeasons(true);
  const { data: seasonData } = useSeasonsData(true, selectedSeasonId ?? undefined);
  const season = seasonData?.[0];

  // Auto-select most recent season on mount
  useEffect(() => {
    if (!selectedSeasonId && seasons && seasons.length > 0) {
      setSelectedSeasonId(seasons[0]!.seasonId);
    }
  }, [seasons, selectedSeasonId]);


  const selectedSeasonName = seasons?.find(
    (s) => s.seasonId === selectedSeasonId
  )?.name ?? 'Select a season';

  return (
    <View className='flex-1 bg-background'>
      {/* Header */}
      <View className='bg-card shadow-lg px-4 py-4'>
        <View className='items-center justify-center'>
          <View className='flex-row items-center justify-center gap-3 mb-2'>
            <View className='h-6 w-1 bg-primary rounded-full' />
            <Text className='text-2xl font-black uppercase tracking-tight text-foreground'>
              Survivor Seasons
            </Text>
            <View className='h-6 w-1 bg-primary rounded-full' />
          </View>
          <Text className='text-muted-foreground text-center text-sm font-medium'>
            Explore castaways, tribe timelines, and events from every season
          </Text>
        </View>

        {/* Season Selector */}
        {seasons && seasons.length > 0 && (
          <Pressable
            className='max-w-lg self-center w-full mt-3 border-2 border-primary/20 
              bg-primary/5 rounded-md px-3 py-2.5 active:border-primary/40'>
            <Text className='font-medium text-foreground text-center'>
              {selectedSeasonName}
            </Text>
          </Pressable>
        )}

        {/* Tab Bar */}
        <View className='flex-row mt-4 bg-muted rounded-lg p-1'>
          {TABS.map((tab) => (
            <Pressable
              key={tab.value}
              className={cn(
                'flex-1 py-2 rounded-md',
                selectedTab === tab.value && 'bg-background shadow-sm'
              )}
              onPress={() => setSelectedTab(tab.value)}>
              <Text
                className={cn(
                  'text-center font-medium text-sm',
                  selectedTab === tab.value
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView className='flex-1 px-4' contentContainerStyle={{ paddingBottom: 16 }}>
        {selectedSeasonId ? (
          season ? (
            <View className='pt-4'>
              {/*
                selectedTab === 'events' && (
                <EventTimeline seasonData={season} hideMemberFilter />
              )}
              {
                selectedTab === 'castaways' && (
                <CastawaysView seasonData={season} />
              )}
              {selectedTab === 'tribes' && (
                <TribesTimeline seasonData={season} />
              )*/}
            </View>
          ) : (
            <View className='items-center justify-center gap-4 mt-16'>
              <Text className='text-primary'>Loading season...</Text>
              <Image
                source={LogoImage}
                className='w-[150px] h-[150px] animate-spin'
                resizeMode='contain' />
            </View>
          )
        ) : (
          <View className='items-center justify-center gap-4 mt-16'>
            <Text className='text-muted-foreground'>Select a season to get started</Text>
          </View>
        )}
      </ScrollView>

      {/* Season Selection Modal */}
    </View>
  );
}
