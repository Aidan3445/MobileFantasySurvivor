import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useLeagueActionDetails } from '~/hooks/leagues/enrich/useActionDetails';
import { useEliminations } from '~/hooks/seasons/useEliminations';
import { useFetch } from '~/hooks/helpers/useFetch';
import { type LeagueMember } from '~/types/leagueMembers';
import { MAX_SEASON_LENGTH } from '~/lib/leagues';

const formSchema = z.object({
  castawayId: z.coerce.number({ required_error: 'Please select a castaway' }),
  secondaryCastawayId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function useChangeCastaway() {
  const queryClient = useQueryClient();
  const postCastaway = useFetch('POST');

  const {
    league,
    rules,
    actionDetails,
    keyEpisodes,
    leagueMembers,
    membersWithPicks,
    selectionTimeline,
  } = useLeagueActionDetails();

  const { data: eliminations } = useEliminations(league?.seasonId ?? null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [selected, setSelected] = useState('');
  const [secondarySelected, setSecondarySelected] = useState('');
  const [initialSecondaryPick, setInitialSecondaryPick] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [closedDialog, setClosedDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingSecondary, setIsSubmittingSecondary] = useState(false);

  const secondaryPickSettings = rules?.secondaryPick;

  // Available castaways for selection
  const availableCastaways = useMemo(() =>
    Object.values(actionDetails ?? {})
      .flatMap(({ castaways }) =>
        castaways.map(({ castaway, member }) => ({
          ...castaway,
          pickedBy: member,
        }))
      ),
    [actionDetails]
  );

  // Calculate pick priority and eliminated members
  const { pickPriority } = useMemo(() => {
    return membersWithPicks.reduce(
      ({ pickPriority, elim }, memberWPick) => {
        const pickId = memberWPick.castawayId;
        const eliminatedEpisode =
          eliminations?.findIndex((elims) =>
            elims.some((elim) => elim.castawayId === pickId)
          ) ?? -1;

        if (eliminatedEpisode === -1) return { pickPriority, elim };

        if (keyEpisodes?.previousEpisode?.episodeNumber === eliminatedEpisode) {
          pickPriority.push(memberWPick.member);
        }
        elim.push(memberWPick.member);
        return { pickPriority, elim };
      },
      { pickPriority: [], elim: [] } as { pickPriority: LeagueMember[]; elim: LeagueMember[] }
    );
  }, [eliminations, keyEpisodes, membersWithPicks]);

  // Calculate lockout status for secondary picks
  const castawayLockoutStatus = useMemo(() => {
    if (
      !secondaryPickSettings?.enabled ||
      !leagueMembers?.loggedIn ||
      !selectionTimeline?.secondaryPicks ||
      !keyEpisodes?.previousEpisode
    ) {
      return new Map<number, { isLockedOut: boolean; episodePicked?: number; episodesRemaining?: number }>();
    }

    const memberId = leagueMembers.loggedIn.memberId;
    const lockoutPeriod = secondaryPickSettings.lockoutPeriod;
    const previousEpisode = keyEpisodes.previousEpisode.episodeNumber;
    const secondaryPicks = selectionTimeline.secondaryPicks[memberId] ?? [];

    const lockoutMap = new Map<number, { isLockedOut: boolean; episodePicked?: number; episodesRemaining?: number }>();

    secondaryPicks.forEach((castawayId, episodeIndex) => {
      if (castawayId !== null && castawayId !== undefined) {
        const episodeNumber = episodeIndex;
        const episodesSinceLastPick = previousEpisode - episodeNumber;

        if (
          (lockoutPeriod === 0 || episodesSinceLastPick < lockoutPeriod) &&
          episodeNumber <= previousEpisode
        ) {
          if (
            !lockoutMap.has(castawayId) ||
            (lockoutMap.get(castawayId)?.episodePicked ?? 0) < episodeNumber
          ) {
            lockoutMap.set(castawayId, {
              isLockedOut: true,
              episodePicked: episodeNumber,
              episodesRemaining:
                lockoutPeriod === MAX_SEASON_LENGTH
                  ? undefined
                  : Math.max(0, lockoutPeriod - episodesSinceLastPick),
            });
          }
        }
      }
    });

    return lockoutMap;
  }, [secondaryPickSettings, leagueMembers, selectionTimeline, keyEpisodes]);

  // Set initial secondary pick
  useEffect(() => {
    if (!secondaryPickSettings?.enabled || !leagueMembers?.loggedIn || !membersWithPicks.length)
      return;

    const memberId = leagueMembers.loggedIn.memberId;
    const currentPick = membersWithPicks.find(
      (mwp) => mwp.member.memberId === memberId && !mwp.out
    );

    if (currentPick?.secondary) {
      const secondaryId = `${currentPick.secondary.castawayId}`;
      setSecondarySelected(secondaryId);
      setInitialSecondaryPick(secondaryId);
      form.setValue('secondaryCastawayId', currentPick.secondary.castawayId);
    } else {
      setSecondarySelected('');
      setInitialSecondaryPick('');
      form.setValue('secondaryCastawayId', undefined);
    }
  }, [secondaryPickSettings, membersWithPicks, leagueMembers, form]);

  // Handle selection change (clears other if same)
  const handleSelectionChange = (field: 'survivor' | 'secondary', value: string) => {
    if (field === 'survivor') {
      setSelected(value);
      form.setValue('castawayId', parseInt(value));
      if (value === secondarySelected) {
        setSecondarySelected('');
        form.setValue('secondaryCastawayId', undefined);
      }
    } else {
      setSecondarySelected(value);
      form.setValue('secondaryCastawayId', parseInt(value));
      if (value === selected) {
        setSelected('');
        form.resetField('castawayId');
      }
    }
  };

  // Submit main castaway pick
  const handleSubmit = form.handleSubmit(async (data) => {
    if (!league) return { success: false };

    setIsSubmitting(true);
    try {
      const response = await postCastaway(`/api/leagues/${league.hash}/chooseCastaway`, {
        body: { castawayId: data.castawayId },
      });

      if (!response.ok) {
        throw new Error('Failed to choose castaway');
      }

      await queryClient.invalidateQueries({ queryKey: ['selectionTimeline', league.hash] });
      await queryClient.invalidateQueries({ queryKey: ['leagueMembers', league.hash] });
      form.reset();
      setSelected('');
      Alert.alert('Success', 'Castaway chosen successfully');
      return { success: true };
    } catch {
      Alert.alert('Error', 'Failed to choose castaway');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  });

  // Submit secondary pick
  const handleSecondarySubmit = async () => {
    if (!league || !keyEpisodes?.nextEpisode || !secondarySelected) return { success: false };

    setIsSubmittingSecondary(true);
    try {
      const response = await postCastaway(`/api/leagues/${league.hash}/secondary/pick`, {
        body: { castawayId: parseInt(secondarySelected) },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? 'Failed to choose secondary pick');
      }

      await queryClient.invalidateQueries({ queryKey: ['selectionTimeline', league.hash] });
      setInitialSecondaryPick(secondarySelected);
      Alert.alert('Success', 'Secondary pick chosen successfully');
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to choose secondary pick';
      Alert.alert('Error', errorMessage);
      return { success: false };
    } finally {
      setIsSubmittingSecondary(false);
    }
  };

  // Mark elimination dialog as closed
  const markDialogClosed = async () => {
    setClosedDialog(true);
    setDialogOpen(false);
  };

  // Calculate hours remaining for pick priority
  const hoursRemainingForPriority = useMemo(() => {
    if (!keyEpisodes?.previousEpisode) return 0;
    const elapsed = Date.now() - keyEpisodes.previousEpisode.airDate.getTime();
    return Math.floor((1000 * 60 * 60 * 48 - elapsed) / 1000 / 60 / 60);
  }, [keyEpisodes]);

  // Determine current UI state
  const uiState = useMemo(() => {
    if (league?.status === 'Inactive') return 'inactive';

    if (availableCastaways.every((castaway) => castaway.pickedBy)) {
      return 'no-castaways';
    }

    if (
      keyEpisodes?.previousEpisode &&
      pickPriority.length > 0 &&
      !dialogOpen &&
      Date.now() - keyEpisodes.previousEpisode.airDate.getTime() < 1000 * 60 * 60 * 48
    ) {
      return 'wait-for-priority';
    }

    return 'can-pick';
  }, [league, availableCastaways, keyEpisodes, pickPriority, dialogOpen]);

  // Validation
  const canSubmitMain =
    formSchema.safeParse(form.watch())?.success &&
    !isSubmitting &&
    keyEpisodes?.previousEpisode?.airStatus !== 'Airing';

  const canSubmitSecondary =
    !!secondarySelected &&
    secondarySelected !== initialSecondaryPick &&
    !isSubmittingSecondary &&
    keyEpisodes?.previousEpisode?.airStatus !== 'Airing';

  const isEpisodeAiring = keyEpisodes?.previousEpisode?.airStatus === 'Airing';

  return {
    // Data
    league,
    leagueMembers,
    keyEpisodes,
    secondaryPickSettings,
    availableCastaways,
    pickPriority,
    castawayLockoutStatus,

    // Form
    form,
    selected,
    secondarySelected,
    initialSecondaryPick,
    handleSelectionChange,

    // Actions
    handleSubmit,
    handleSecondarySubmit,
    isSubmitting,
    isSubmittingSecondary,

    // Validation
    canSubmitMain,
    canSubmitSecondary,
    isEpisodeAiring,

    // Dialog
    dialogOpen,
    closedDialog,
    setDialogOpen,
    markDialogClosed,

    // UI State
    uiState,
    hoursRemainingForPriority,
  };
}
