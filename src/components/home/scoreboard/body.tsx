'use client';

import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { type SeasonsDataQuery } from '~/types/seasons';
import { useCarousel } from '~/hooks/ui/useCarousel';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { getTribeTimeline } from '~/lib/utils';
import CastawayEntry from '~/components/home/scoreboard/entry';

export interface ScoreboardBodyProps {
  sortedCastaways: [number, number[]][];
  castawayColors: Record<string, string>;
  castawaySplitIndex: number;
  data: SeasonsDataQuery;
  allZero: boolean;
}

export default function ScoreboardBody({
  sortedCastaways,
  castawayColors,
  castawaySplitIndex,
  data,
  allZero
}: ScoreboardBodyProps) {
  const { setCarouselData, props, progressProps } = useCarousel<[number, number[]][]>([]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [castawayData, setCastawayData] = useState<SeasonsDataQuery | null>(null);

  useEffect(() => {
    const firstHalf = sortedCastaways.slice(0, castawaySplitIndex);
    const secondHalf = sortedCastaways.slice(castawaySplitIndex);
    setCarouselData([firstHalf, secondHalf]);
    setColors(castawayColors);
    setCastawayData(data);
  }, [sortedCastaways, castawayColors, castawaySplitIndex, data, setCarouselData]);

  return (
    <View className='bg-card pb-1'>
      <Carousel
        height={24.5 * castawaySplitIndex}
        {...props}
        renderItem={({ item, index: col }) => (
          <View>
            {item.map(([castawayId, scores], index) => {
              const castaway = castawayData?.castaways.find(c => c.castawayId === castawayId);
              const points = scores.slice().pop() ?? 0;
              const color = colors[castawayId] ?? '#AAAAAA';
              const place = col * castawaySplitIndex + index + 1;
              const tribeTimeline = castawayData
                ? getTribeTimeline(castawayId, castawayData.tribesTimeline, castawayData.tribes)
                : [];

              return (
                <CastawayEntry
                  key={castawayId}
                  castawayId={castawayId}
                  castaway={castaway}
                  points={points}
                  color={color}
                  place={place}
                  index={index}
                  allZero={allZero}
                  tribeTimeline={tribeTimeline}
                />
              );
            })}
            {/* If odd number of castaways, add an empty row for alignment to first half only (col 0) */}
            {sortedCastaways.length % 2 === 1 && col === 1 && (
              <View className='h-7 border-t border-t-primary' />
            )}
          </View>
        )
        }
      />
      < Pagination.Basic
        {...progressProps}
        containerStyle={{ ...progressProps.containerStyle, marginVertical: 4 }}
      />
    </View>
  );
}
