'use client';

import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { type SeasonsDataQuery } from '~/types/seasons';
import { useCarousel } from '~/hooks/ui/useCarousel';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { getTribeTimeline } from '~/lib/utils';
import CastawayRow from '~/components/home/scoreboard/row';

export interface ScoreboardBodyProps {
  sortedCastaways: [number, number[]][];
  castawaySplitIndex: number;
  data: SeasonsDataQuery;
  allZero: boolean;
}

const ROW_HEIGHT = 35;

export default function ScoreboardBody({
  sortedCastaways,
  castawaySplitIndex,
  data,
  allZero
}: ScoreboardBodyProps) {
  const { setCarouselData, props, progressProps, } = useCarousel<[number, number[]][]>([]);
  const [castawayData, setCastawayData] = useState<SeasonsDataQuery | null>(null);

  useEffect(() => {
    const firstHalf = sortedCastaways.slice(0, castawaySplitIndex);
    const secondHalf = sortedCastaways.slice(castawaySplitIndex);
    setCarouselData([firstHalf, secondHalf]);
    setCastawayData(data);
  }, [sortedCastaways, castawaySplitIndex, data, setCarouselData]);

  return (
    <View>
      <View className='bg-primary/5 border-2 border-primary/20 rounded-lg overflow-hidden border-t-0 rounded-t-none mb-2'>
        <Carousel
          height={(castawaySplitIndex) * ROW_HEIGHT}
          {...props}
          width={props.width - 10}
          renderItem={({ item, index: col }) => (
            <View className='flex-1 mr-3'>
              {item.map(([castawayId, scores], index) => {
                const castaway = castawayData?.castaways.find(c => c.castawayId === castawayId);
                const points = scores.slice().pop() ?? 0;
                const place = col * castawaySplitIndex + index + 1;
                const tribeTimeline = castawayData
                  ? getTribeTimeline(castawayId, castawayData.tribesTimeline, castawayData.tribes)
                  : [];

                return (
                  <CastawayRow
                    key={castawayId}
                    castaway={castaway}
                    points={points}
                    place={place}
                    allZero={allZero}
                    tribeTimeline={tribeTimeline}
                    splitIndex={col * castawaySplitIndex}
                    bottomBorder={index === item.length - 1 && col === 1} />
                );
              })}
            </View>
          )} />
      </View>
      <Pagination.Basic
        {...progressProps}
        containerStyle={{ ...progressProps.containerStyle, marginBottom: 8 }} />
    </View>
  );
}
