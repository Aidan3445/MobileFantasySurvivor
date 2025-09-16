'use client';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type SeasonsDataQuery } from '~/types/seasons';
import { compileScores } from '~/lib/scores';
import { newtwentyColors } from '~/lib/colors';
import { type BaseEventRules } from '~/types/leagues';
import ScoreboardBody from '~/components/home/scoreboard/body';
import SelectSeason from '~/components/home/scoreboard/selectSeason';
import { cn } from '~/lib/util';

export interface ScoreboardTableProps {
  scoreData: SeasonsDataQuery[];
  someHidden?: boolean;
  overrideBaseRules?: BaseEventRules;
  className?: string;
}

export default function ScoreboardTable({ scoreData, someHidden, overrideBaseRules, className }: ScoreboardTableProps) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  // Calculate scores only for the selected season
  const selectedSeasonData = useMemo(() => {
    const data = scoreData[selectedSeasonIndex];
    if (!data) return null;

    const { Castaway: castawayScores } = compileScores(
      data.baseEvents,
      data.eliminations,
      data.tribesTimeline,
      data.keyEpisodes,
      undefined,
      undefined,
      undefined,
      overrideBaseRules ? {
        base: overrideBaseRules,
        basePrediction: null,
        custom: [],
        shauhinMode: null
      } : null
    ).scores;

    const sortedCastaways = Object.entries(castawayScores)
      .sort(([_, scoresA], [__, scoresB]) => (scoresB.slice().pop() ?? 0) - (scoresA.slice().pop() ?? 0))
      .map(([castawayId, scores]) => [Number(castawayId), scores] as [number, number[]]);

    const castawayColors: Record<string, string> =
      data.castaways.sort(({ fullName: a }, { fullName: b }) => a.length - b.length)
        .reduce((acc, { castawayId }, index) => {
          acc[castawayId] = newtwentyColors[index % newtwentyColors.length]!;
          return acc;
        }, {} as Record<string, string>);

    const castawaySplitIndex = Math.ceil(sortedCastaways.length / 2);

    return {
      sortedCastaways,
      castawayColors,
      castawaySplitIndex,
      data
    };
  }, [scoreData, selectedSeasonIndex, overrideBaseRules]);

  // Calculate allZero based on selected season data
  const allZero = useMemo(() => {
    return selectedSeasonData?.sortedCastaways.every(([_, scores]) => scores.every(score => score === 0)) ?? true;
  }, [selectedSeasonData]);

  // Season selection handler
  const selectSeason = useCallback((seasonName: string) => {
    const index = scoreData.findIndex(s => s.season.name === seasonName);
    if (index !== -1) {
      setSelectedSeasonIndex(index);
    }
  }, [scoreData]);

  // Reset to first season if current selection is invalid
  useEffect(() => {
    if (selectedSeasonIndex >= scoreData.length && scoreData.length > 0) {
      setSelectedSeasonIndex(0);
    }
  }, [scoreData, selectedSeasonIndex]);



  if (!selectedSeasonData) {
    return (
      <View className='bg-card rounded-xl p-6'>
        <Text className='text-center text-muted-foreground'>No seasons available.</Text>
      </View>
    );
  }

  return (
    <View className={cn('', className)}>
      <View className='bg-accent rounded-lg overflow-hidden'>
        <View className='flex-row px-1 bg-white gap-x-1'>
          {!allZero ? (
            <>
              <View className='w-11 items-center justify-center py-1'>
                <Text className='text-center font-medium'>Place</Text>
              </View>
              <View className='w-8 items-center justify-center py-1'>
                <Flame size={16} className='text-muted-foreground' />
              </View>
              <View className='flex-1 items-center justify-center py-1'>
                <Text className='text-center font-medium'>
                  Castaway - {selectedSeasonData.data.season.name}
                </Text>
                <SelectSeason
                  seasons={scoreData.map(s => ({
                    value: s.season.name,
                    label: s.season.name,
                  }))}
                  value={selectedSeasonData.data.season.name}
                  setValue={selectSeason}
                  someHidden={someHidden}
                />
              </View>
            </>
          ) : (
            <View className='flex-1 items-center justify-center py-1'>
              <Text className='text-center font-medium'>
                {selectedSeasonData.data.season?.name} Castaways
              </Text>
              <SelectSeason
                seasons={scoreData.map(s => ({
                  value: s.season.name,
                  label: s.season.name,
                }))}
                value={selectedSeasonData.data.season.name}
                setValue={selectSeason}
                someHidden={someHidden}
              />
            </View>
          )}
        </View>
        <ScoreboardBody
          sortedCastaways={selectedSeasonData.sortedCastaways}
          castawayColors={selectedSeasonData.castawayColors}
          castawaySplitIndex={selectedSeasonData.castawaySplitIndex}
          data={selectedSeasonData.data}
          allZero={allZero}
        />
      </View>
    </View>
  );
}
