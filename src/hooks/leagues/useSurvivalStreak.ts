import { useQueryClient } from '@tanstack/react-query';
import { useFetch } from '~/hooks/helpers/useFetch';
import { useLeague } from '~/hooks/leagues/useLeague';
import { useLeagueMembers } from '~/hooks/leagues/useLeagueMembers';
import { useLeagueSettings } from '~/hooks/leagues/useLeagueSettings';
import { DEFAULT_SURVIVAL_CAP } from '~/lib/leagues';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useSurvivalStreak() {
  const putData = useFetch('PUT');
  const queryClient = useQueryClient();

  const { data: league } = useLeague();
  const { data: leagueMembers } = useLeagueMembers();
  const { data: leagueSettings } = useLeagueSettings();

  const [locked, setLocked] = useState(true);
  const [survivalCapValue, setSurvivalCapValue] = useState<number>(DEFAULT_SURVIVAL_CAP);
  const [preserveStreakValue, setPreserveStreakValue] = useState<boolean>(true);

  const survivalCap = leagueSettings?.survivalCap ?? DEFAULT_SURVIVAL_CAP;
  const preserveStreak = leagueSettings?.preserveStreak ?? true;

  useEffect(() => {
    setSurvivalCapValue(survivalCap);
    setPreserveStreakValue(preserveStreak);
  }, [survivalCap, preserveStreak]);

  const settingsChanged = survivalCapValue !== survivalCap || preserveStreakValue !== preserveStreak;

  const handleSubmit = async () => {
    if (!league || !settingsChanged) return;

    try {
      const response = await putData(`/api/leagues/${league.hash}/settings`, {
        body: {
          survivalCap: survivalCapValue,
          preserveStreak: preserveStreakValue
        }
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        console.error('Error saving survival streak settings:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to save survival streak settings');
        return;
      }

      const { success } = await response.json() as { success: boolean };
      if (!success) {
        Alert.alert('Error', 'Failed to save survival streak settings');
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['leagueSettings', league.hash] });

      Alert.alert('Success', 'Survival streak settings saved');
      setLocked(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save survival streak settings');
    }
  };

  const resetSettings = () => {
    setSurvivalCapValue(survivalCap);
    setPreserveStreakValue(preserveStreak);
    setLocked(true);
  };

  return {
    survivalCap,
    preserveStreak,
    survivalCapValue,
    setSurvivalCapValue,
    preserveStreakValue,
    setPreserveStreakValue,
    locked,
    setLocked,
    settingsChanged,
    handleSubmit,
    resetSettings,
    leagueMembers
  };
}
