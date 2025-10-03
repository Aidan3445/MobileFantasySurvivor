'use client';

import { Text, View } from 'react-native';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect } from 'react';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { type LeagueRules } from '~/types/leagues';
import { type Prediction } from '~/types/events';

interface PredictionsCarouselProps {
  rules?: LeagueRules;
  predictionRuleCount: number;
  predictionsMade: Prediction[];
}

// Mock prediction data for the carousel
const createMockPredictions = (count: number) => {
  return Array.from({ length: Math.max(count, 3) }, (_, index) => ({
    id: index + 1,
    title: `Prediction ${index + 1}`,
    description: 'This is a mock prediction card for testing the carousel layout.',
    type: index % 2 === 0 ? 'Base Event' : 'Custom Event'
  }));
};

export default function PredictionsCarousel({
  predictionRuleCount,
  predictionsMade
}: PredictionsCarouselProps) {
  const mockPredictions = createMockPredictions(predictionRuleCount);

  // Group predictions into slides of 2 per slide
  const { props, progressProps, setCarouselData } = useCarousel<typeof mockPredictions>([]);

  useEffect(() => {
    const slides = mockPredictions.reduce(
      (pairs, prediction, index) => {
        if (index % 2 === 0) pairs.push([]);
        pairs[pairs.length - 1]!.push(prediction);
        return pairs;
      },
      [] as (typeof mockPredictions)[]
    );
    setCarouselData(slides);
  }, [mockPredictions, setCarouselData]);

  if (predictionRuleCount === 0) {
    return null;
  }

  return (
    <View className='w-full rounded-lg bg-card p-2'>
      <View className='mb-4 px-2'>
        <Text className='text-card-foreground text-lg font-bold'>
          Predictions{' '}
          <Text className='text-sm font-normal text-muted-foreground'>
            ({predictionsMade.length}/{predictionRuleCount})
          </Text>
        </Text>
        <Text className='mt-1 text-sm text-muted-foreground'>
          Make your predictions before each episode airs!
        </Text>
      </View>
      {mockPredictions.length > 0 ? (
        <View className='relative items-center'>
          <Carousel
            height={200}
            loop={mockPredictions.length > 2}
            renderItem={({ item, index }) => (
              <View
                key={index}
                className='flex-col gap-2 px-2'>
                {item.map(prediction => (
                  <View
                    key={prediction.id}
                    className='flex-1 rounded-lg bg-muted p-4'>
                    <Text className='text-card-foreground mb-2 text-lg font-semibold'>
                      {prediction.title}
                    </Text>
                    <Text className='mb-2 text-sm text-muted-foreground'>
                      {prediction.description}
                    </Text>
                    <Text className='text-xs font-medium text-primary'>{prediction.type}</Text>
                  </View>
                ))}
              </View>
            )}
            {...props} />
          <Pagination.Basic
            {...progressProps}
            containerStyle={{ ...progressProps.containerStyle, marginBottom: 8 }} />
        </View>
      ) : (
        <Text className='py-8 text-center text-muted-foreground'>No predictions available.</Text>
      )}
    </View>
  );
}
