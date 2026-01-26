import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useLeagueData } from '~/hooks/leagues/enrich/useLeagueData';
import { useLeagueRules } from '~/hooks/leagues/query/useLeagueRules';
import { useEpisodes } from '~/hooks/seasons/useEpisodes';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import { useEventOptions } from '~/hooks/seasons/enrich/useEventOptions';
import {
  CustomEventInsertZod,
  type CustomEventInsert,
  type EventWithReferences,
} from '~/types/events';
import { createCustomEvent } from '~/lib/api/events';

export function useManageCustomEvents() {
  const queryClient = useQueryClient();
  const leagueData = useLeagueData();
  const { data: rules } = useLeagueRules();
  const { data: episodes } = useEpisodes(leagueData?.league?.seasonId ?? null);
  const { data: seasonData } = useSeasonsData(true, leagueData?.league?.seasonId ?? undefined);
  const season = seasonData?.[0];

  // Form setup
  const form = useForm<CustomEventInsert>({
    defaultValues: {
      episodeId:
        episodes?.find((ep) => ep.airStatus === 'Airing')?.episodeId ??
        episodes?.findLast((ep) => ep.airStatus === 'Aired')?.episodeId ??
        episodes?.[0]?.episodeId,
      notes: null,
    },
    resolver: zodResolver(CustomEventInsertZod),
  });

  // Watched values
  const selectedRuleId = form.watch('customEventRuleId');
  const selectedReferences = form.watch('references');
  const selectedEpisodeId = form.watch('episodeId');
  const setLabel = form.watch('label');
  const setNotes = form.watch('notes');

  // Derived state
  const selectedEvent = useMemo(
    () => rules?.custom.find((rule) => rule.customEventRuleId === selectedRuleId),
    [rules?.custom, selectedRuleId]
  );

  const selectedEpisode = useMemo(
    () => episodes?.find((ep) => ep.episodeId === selectedEpisodeId)?.episodeNumber,
    [episodes, selectedEpisodeId]
  );

  // Reference options for the selected episode
  const { combinedReferenceOptions, handleCombinedReferenceSelection } = useEventOptions(
    leagueData?.league?.seasonId ?? null,
    selectedEpisode ?? 1
  );

  // Clear key for resetting MultiSelect
  const [clearKey, setClearKey] = useState(0);

  const clearReferences = useCallback(() => {
    setClearKey((k) => k + 1);
    form.resetField('references');
  }, [form]);

  // Mock event for preview
  const mockEvent = useMemo<EventWithReferences | null>(() => {
    if (!selectedEvent) return null;
    return {
      eventSource: 'Custom',
      eventType: 'Direct',
      eventName: selectedEvent.eventName,
      label: setLabel ?? selectedEvent.eventName,
      episodeNumber: selectedEpisode,
      references: selectedReferences ?? [],
      notes: setNotes,
    } as EventWithReferences;
  }, [selectedEpisode, selectedEvent, selectedReferences, setLabel, setNotes]);

  // Select options
  const episodeOptions = useMemo(
    () =>
      episodes?.map((ep) => ({
        label: `${ep.episodeNumber}: ${ep.title}`,
        value: ep.episodeId,
      })) ?? [],
    [episodes]
  );

  const eventOptions = useMemo(
    () =>
      rules?.custom.map((rule) => ({
        label: `${rule.eventName} (${rule.eventType})`,
        value: rule.customEventRuleId,
      })) ?? [],
    [rules?.custom]
  );

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = form.handleSubmit(async (data) => {
    if (!leagueData?.league) return;
    setIsSubmitting(true);
    try {
      await createCustomEvent(leagueData.league.hash, data);
      clearReferences();
      form.reset({ episodeId: data.episodeId, notes: null });
      await queryClient.invalidateQueries({ queryKey: ['customEvents', leagueData.league.hash] });
      return { success: true };
    } catch (e) {
      console.error('Failed to create custom event', e);
      return { success: false, error: e };
    } finally {
      setIsSubmitting(false);
    }
  });

  // Validation state
  const canSubmit =
    !!selectedEvent &&
    setLabel !== '' &&
    !!selectedReferences &&
    selectedReferences.length > 0 &&
    !isSubmitting;

  return {
    // Data
    leagueData,
    season,
    rules,
    episodes,

    // Form
    form,
    clearKey,
    clearReferences,

    // Selections
    selectedEvent,
    selectedEpisode,
    selectedReferences,

    // Options
    episodeOptions,
    eventOptions,
    combinedReferenceOptions,
    handleCombinedReferenceSelection,

    // Preview
    mockEvent,

    // Actions
    handleCreate,
    isSubmitting,
    canSubmit,

    // State checks
    hasCustomRules: !!rules?.custom && rules.custom.length > 0,
  };
}
