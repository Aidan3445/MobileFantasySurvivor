'use client';

import { Text, View } from 'react-native';
import { useCallback, useMemo, useEffect } from 'react';
import { type MakePredictionsProps } from '~/components/leagues/draft/predictions/view';
import { type ScoringBaseEventName, type ReferenceType, type MakePrediction } from '~/types/events';
import { BaseEventDescriptions, BaseEventFullName, BasePredictionReferenceTypes } from '~/lib/events';
import { useCarousel } from '~/hooks/ui/useCarousel';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import SubmissionCard from '~/components/leagues/draft/predictions/submission';

export default function PredictionCards({
  rules,
  predictionsMade,
  castaways,
  tribes
}: MakePredictionsProps) {
  const enabledBasePredictions = useMemo(() =>
    Object.entries(rules?.basePrediction ?? {})
      .filter(([_, rule]) => rule.enabled)
      .map(([baseEventName, rule]) => {
        const eventName = baseEventName as ScoringBaseEventName;
        const fullName = BaseEventFullName[baseEventName as ScoringBaseEventName] ?? baseEventName;
        const prediction: MakePrediction = {
          eventSource: 'Base' as const,
          eventName: eventName,
          label: fullName,
          description: `${BaseEventDescriptions.prediction[eventName]} ${BaseEventDescriptions.italics[eventName] ?? ''}`,
          points: rule.points,
          referenceTypes: BasePredictionReferenceTypes[eventName],
          timing: rule.timing,
          predictionMade: predictionsMade.find((pred) => pred.eventName === eventName) ?? null,
          shauhinEnabled: false // Add shauhin support later if needed
        };
        return prediction;
      }),
    [rules, predictionsMade]);

  const customPredictions: MakePrediction[] = useMemo(() =>
    rules?.custom
      .filter((rule) => rule.eventType === 'Prediction')
      .map((rule) => ({
        eventSource: 'Custom' as const,
        eventName: rule.eventName,
        label: rule.eventName,
        description: rule.description,
        points: rule.points,
        referenceTypes: rule.referenceTypes,
        timing: rule.timing,
        predictionMade: predictionsMade.find((pred) => pred.eventName === rule.eventName) ?? null,
      })) ?? [], [rules, predictionsMade]);

  const getOptions = useCallback((referenceTypes: ReferenceType[]) => {
    const options: Record<ReferenceType | 'Direct Castaway', Record<string, {
      id: number;
      color: string;
      tribeName?: string;
    }>> = {
      'Castaway': {},
      'Tribe': {},
      'Direct Castaway': {}
    };

    const castawayKey = (referenceTypes.length === 0 || referenceTypes.includes('Castaway')) ?
      'Castaway' : 'Direct Castaway';

    castaways.forEach((castaway) => {
      if (castaway.eliminatedEpisode) return;
      const tribe = castaway.tribe;
      options[castawayKey][castaway.fullName] = {
        id: castaway.castawayId,
        color: tribe?.color ?? '#AAAAAA',
        tribeName: tribe?.name ?? 'No Tribe'
      };
    });

    if (referenceTypes.length === 0 || referenceTypes.includes('Tribe')) {
      tribes.forEach((tribe) => {
        options.Tribe[tribe.tribeName] = {
          id: tribe.tribeId,
          color: tribe.tribeColor
        };
      });
    }
    return options;
  }, [castaways, tribes]);

  const allPredictions = useMemo(() =>
    [...enabledBasePredictions, ...customPredictions],
    [enabledBasePredictions, customPredictions]);

  const { ref, props, progressProps, setCarouselData } = useCarousel<MakePrediction>([]);

  useEffect(() => {
    setCarouselData(allPredictions);
  }, [allPredictions, setCarouselData]);

  if (allPredictions.length === 0) return null;

  if (allPredictions.length === 1) {
    const prediction = allPredictions[0]!;
    return (
      <View className='mx-2 rounded-lg bg-secondary p-4'>
        <View className='mb-2 items-center'>
          <Text className='text-center text-lg font-semibold text-card-foreground'>
            {prediction.label}
          </Text>
          <Text className='text-center text-sm text-primary'>
            {prediction.points} points
          </Text>
          <Text className='text-center text-xs italic text-white'>
            {prediction.timing.join(' - ')}
          </Text>
        </View>
        <Text className='mb-3 text-center text-sm text-black'>
          {prediction.description}
        </Text>
        <SubmissionCard
          prediction={prediction}
          options={getOptions(prediction.referenceTypes)} />
      </View>
    );
  }

  return (
    <View className='w-full'>
      <Carousel
        ref={ref}
        height={275}
        renderItem={({ item: prediction, index }) => (
          <View key={index} className='px-8'>
            <View className='rounded-lg bg-secondary p-4'>
              <View className='mb-2 items-center'>
                <Text className='text-center text-lg font-semibold text-card-foreground'>
                  {prediction.label}
                </Text>
                <Text className='text-center text-sm text-primary'>
                  {prediction.points} points
                </Text>
                <Text className='text-center text-xs italic text-white'>
                  {prediction.timing.join(' - ')}
                </Text>
              </View>
              <Text className='mb-3 text-center text-sm text-black'>
                {prediction.description}
              </Text>
              <SubmissionCard
                prediction={prediction}
                options={getOptions(prediction.referenceTypes)} />
            </View>
          </View>
        )}
        {...props} />
      <Pagination.Basic {...progressProps} containerStyle={{ marginTop: 8 }} />
    </View>
  );
}
