import { View, Text } from 'react-native';
import { useMemo } from 'react';
import {
  type EventWithReferencesAndPredOnly,
  type EpisodeEventsProps,
  type PredictionAndPredOnly,
} from '~/components/shared/eventTimeline/table/view';
import { type EnrichedEvent } from '~/types/events';
import { useEnrichEvents } from '~/hooks/seasons/enrich/useEnrichEvents';
import { useEnrichPredictions } from '~/hooks/seasons/enrich/useEnrichPredictions';
import PredictionRow from '~/components/shared/eventTimeline/table/row/predictionRow';
import EventRow from '~/components/shared/eventTimeline/table/row/eventRow';
import { type LeagueMember } from '~/types/leagueMembers';
import StreakRow from '~/components/shared/eventTimeline/table/row/streakRow';

interface EpisodeEventsTableBodyProps extends EpisodeEventsProps {
  seasonId: number;
  filteredEvents: EventWithReferencesAndPredOnly[];
  filteredPredictions: PredictionAndPredOnly[];
  predictionEnrichmentEvents?: EventWithReferencesAndPredOnly[];
  noMembers: boolean;
  noTribes?: boolean;
}

export default function EpisodeEventsTableBody({
  seasonData,
  leagueData,
  episodeNumber,
  mockEvents,
  filteredEvents,
  filteredPredictions,
  predictionEnrichmentEvents,
  edit,
  filters,
  noMembers,
  noTribes,
}: EpisodeEventsTableBodyProps) {
  const enrichedEvents = useEnrichEvents(seasonData, filteredEvents, leagueData);
  const enrichedMockEvents = useEnrichEvents(seasonData, mockEvents ?? [], leagueData);
  const enrichedEnrichmentEvents = useEnrichEvents(
    seasonData,
    predictionEnrichmentEvents ?? [],
    leagueData
  );

  const eventsForPredictionEnrichment = useMemo(
    () => [...enrichedEvents, ...enrichedEnrichmentEvents],
    [enrichedEvents, enrichedEnrichmentEvents]
  );

  const enrichedPredictions = useEnrichPredictions(
    seasonData,
    eventsForPredictionEnrichment,
    filteredPredictions,
    leagueData
  );
  const enrichedMockPredictions = useEnrichPredictions(
    seasonData,
    enrichedMockEvents,
    filteredPredictions,
    leagueData
  );

  const { baseEvents, customEvents } = enrichedEvents.reduce(
    (acc, event) => {
      if (event.eventSource === 'Base') {
        acc.baseEvents.push(event);
      } else if (event.eventType === 'Direct') {
        acc.customEvents.push(event);
      }
      return acc;
    },
    { baseEvents: [] as EnrichedEvent[], customEvents: [] as EnrichedEvent[] }
  );

  if (!enrichedEvents.length && !enrichedPredictions.length && !mockEvents) {
    const hasFilters =
      filters.member.length > 0 ||
      filters.castaway.length > 0 ||
      filters.event.length > 0 ||
      filters.tribe.length > 0;

    return (
      <View className='bg-card px-4 py-3'>
        <Text className='text-center text-muted-foreground'>
          No events for episode {episodeNumber} {hasFilters ? 'with the selected filters' : ''}
        </Text>
      </View>
    );
  }

  // Group members by their streak value for this episode
  const streakGroups = Object.entries(leagueData?.streaks ?? {}).reduce(
    (acc, [memberId, episodeStreaks]) => {
      const streakValue = episodeStreaks[episodeNumber] ?? 0;
      if (streakValue > 0) {
        const mid = Number(memberId);
        const member = leagueData?.leagueMembers?.members.find((m) => m.memberId === mid);
        if (member) {
          const streakPointValue = Math.min(
            streakValue,
            leagueData?.leagueSettings?.survivalCap ?? streakValue
          );
          acc[streakPointValue] ??= [];
          acc[streakPointValue].push(member);
        }
      }
      return acc;
    },
    {} as Record<number, LeagueMember[]>
  );

  return (
    <View>
      <View className='flex-row items-center gap-4 border-b-2 border-primary/20 bg-white px-4 py-2'>
        {edit && (
          <View className='w-12'>
            <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
              Edit
            </Text>
          </View>
        )}
        <View className='flex-1 max-w-40'>
          <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Event
          </Text>
        </View>
        {leagueData && (
          <View className='w-16 items-center'>
            <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
              Points
            </Text>
          </View>
        )}
        {!noTribes && (
          <View className='w-24'>
            <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
              Tribes
            </Text>
          </View>
        )}
        <View className='w-32'>
          <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Castaways
          </Text>
        </View>
        {!noMembers && (
          <View className='min-w-[120px] flex-1'>
            <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
              Members
            </Text>
          </View>
        )}
        <View className='w-12'>
          <Text className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Notes
          </Text>
        </View>
      </View>

      {/* Mock Events */}
      {enrichedMockEvents.map((mock, idx) => (
        <EventRow
          key={`mock-${idx}`}
          className='bg-yellow-500'
          event={mock}
          editCol={edit}
          isMock
          noPoints={!leagueData}
          noTribes={noTribes}
          noMembers={noMembers} />
      ))}

      {/* Base Events */}
      {baseEvents
        .filter((event) => !filteredEvents.some((fe) => fe.eventId === event.eventId && fe.predOnly))
        .map((event, idx) => (
          <EventRow
            key={`base-${idx}`}
            event={event}
            editCol={edit}
            noPoints={!leagueData}
            noTribes={noTribes}
            noMembers={noMembers} />
        ))}

      {/* Custom Events Section */}
      {customEvents.length > 0 && (
        <View className='bg-gray-100 px-4 py-2'>
          <Text className='text-center text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Custom Events
          </Text>
        </View>
      )}
      {customEvents
        .filter((event) => !filteredEvents.some((fe) => fe.eventId === event.eventId && fe.predOnly))
        .map((event, idx) => (
          <EventRow
            key={`custom-${idx}`}
            event={event}
            editCol={edit}
            noPoints={!leagueData}
            noTribes={noTribes}
            noMembers={noMembers} />
        ))}

      {/* Predictions Section */}
      {enrichedPredictions.length + enrichedMockPredictions.length > 0 && (
        <View className='bg-gray-100 px-4 py-2'>
          <Text className='text-center text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Predictions
          </Text>
        </View>
      )}
      {enrichedMockPredictions.map((mock, idx) => (
        <PredictionRow
          key={`mock-pred-${idx}`}
          className='bg-yellow-500'
          prediction={mock}
          editCol={edit}
          noMembers={noMembers}
          noTribes={noTribes} />
      ))}
      {enrichedPredictions.map((prediction, idx) => (
        <PredictionRow
          key={`pred-${idx}`}
          prediction={prediction}
          editCol={edit}
          noTribes={noTribes}
          noMembers={noMembers}
          defaultOpenMisses={prediction.misses.some(
            (miss) =>
              filters.member.includes(miss.member.memberId) ||
              (miss.reference?.type === 'Castaway' &&
                filters.castaway.includes(miss.reference.id)) ||
              (miss.reference?.type === 'Tribe' && filters.tribe.includes(miss.reference.id))
          )} />
      ))}

      {/* Survival Streaks Section */}
      {!edit && Object.keys(streakGroups).length > 0 && (
        <>
          <View className='bg-gray-100 px-4 py-2'>
            <Text className='text-center text-xs font-bold uppercase tracking-wider text-muted-foreground'>
              Survival Streaks
            </Text>
          </View>
          {Object.entries(streakGroups)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([streakPointValue, members]) => (
              <StreakRow
                key={streakPointValue}
                streakPointValue={Number(streakPointValue)}
                members={members}
                streaksMap={leagueData!.streaks!}
                episodeNumber={episodeNumber}
                shotInTheDarkStatus={leagueData?.shotInTheDarkStatus} />
            ))}
        </>
      )}
    </View>
  );
}
