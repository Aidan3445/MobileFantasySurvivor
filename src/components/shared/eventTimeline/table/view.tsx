import { Text, View } from 'react-native';
import { type Prediction, type EventWithReferences } from '~/types/events';
import { type SeasonsDataQuery } from '~/types/seasons';
import type { LeagueData } from '~/components/shared/eventTimeline/filters';


export interface EpisodeEventsProps {
  episodeNumber: number;
  seasonData: SeasonsDataQuery;
  leagueData?: LeagueData;
  mockEvents?: EventWithReferences[];
  edit?: boolean;
  filters: {
    castaway: number[];
    tribe: number[];
    member: number[];
    event: string[];
  };
}

export type EventWithReferencesAndPredOnly = EventWithReferences & {
  predOnly?: boolean;
};

export type PredictionAndPredOnly = Prediction & {
  predOnly?: boolean;
};

export default function EpisodeEvents({
  episodeNumber, seasonData, leagueData, mockEvents, edit, filters
}: EpisodeEventsProps) {
  return (
    <View>
      <Text>Episode Events Component</Text>
    </View>
  );
}
