'use client';

import { Text, View } from 'react-native';
import { type LeagueRules } from '~/types/leagues';
import { type Prediction } from '~/types/events';
import { type EnrichedCastaway } from '~/types/castaways';
import { type Tribe } from '~/types/tribes';
import PredictionCards from '~/components/leagues/draft/predictions/cards';

export interface MakePredictionsProps {
  rules?: LeagueRules;
  predictionRuleCount: number;
  predictionsMade: Prediction[];
  castaways: EnrichedCastaway[];
  tribes: Tribe[];
}

export default function PredictionsCarousel({
  rules,
  predictionRuleCount,
  predictionsMade,
  castaways,
  tribes
}: MakePredictionsProps) {
  if (!rules || predictionRuleCount === 0) {
    return null;
  }

  return (
    <View className='w-full rounded-lg bg-card py-4'>
      <View className='mb-4'>
        <Text className='text-center text-xl font-semibold text-card-foreground'>
          While you wait...
        </Text>
        <Text className='text-center text-sm text-muted-foreground'>
          Make your prediction{predictionRuleCount > 1 ? 's' : ''} and earn points if you are correct!
        </Text>
        <Text className='mt-2 text-center text-xs text-muted-foreground'>
          ({predictionsMade.length}/{predictionRuleCount} submitted)
        </Text>
      </View>
      <PredictionCards
        rules={rules}
        predictionRuleCount={predictionRuleCount}
        predictionsMade={predictionsMade}
        castaways={castaways}
        tribes={tribes} />
    </View>
  );
}
