import { useQueryClient } from '@tanstack/react-query';
import { useFetch } from '~/hooks/helpers/useFetch';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useLeagueMembers } from '~/hooks/leagues/query/useLeagueMembers';
import { useForm } from 'react-hook-form';
import {
  LeagueDetailsUpdateZod,
  type LeagueDetailsUpdate,
} from '~/types/leagues';
import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';

export function useLeagueSettings(onSubmit?: () => void) {
  const putData = useFetch('PUT');
  const queryClient = useQueryClient();
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league } = useLeague();
  const { data: leagueMembers } = useLeagueMembers();
  const adminsModal = useSearchableSelect<number>();

  const membersList = useMemo(() =>
    leagueMembers?.members
      .map(member => ({
        value: member.memberId,
        label: member.displayName,
        role: member.role,
      }))
      .filter(member =>
        member.value !== leagueMembers.loggedIn?.memberId && member.role !== 'Owner') ?? [],
    [leagueMembers]);

  const reactForm = useForm<LeagueDetailsUpdate>({
    defaultValues: {
      name: league?.name ?? '',
      admins: membersList.filter(m => m.role === 'Admin').map(m => m.value) ?? [],
    },
    resolver: zodResolver(LeagueDetailsUpdateZod)
  });

  const selectedAdmins = reactForm.watch('admins') || [];

  useEffect(() => {
    if (league) reactForm.setValue('name', league.name);
    if (membersList.length > 0) {
      const adminIds = membersList.filter(m => m.role === 'Admin').map(m => m.value) ?? [];
      reactForm.setValue('admins', adminIds);
    }
  }, [league, membersList, reactForm]);

  const handleSubmit = reactForm.handleSubmit(async (data) => {
    if (!league || !hash) {
      Alert.alert('Error', 'League data not available');
      return;
    }

    try {
      const response = await putData(`/api/leagues/${hash}/settings`, {
        body: {
          name: data.name,
          admins: data.admins,
        },
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        console.error('Error updating league settings:', errorData);
        Alert.alert(
          'Error',
          errorData.message || 'Failed to update league settings'
        );
        return;
      }

      const { success } = (await response.json()) as { success: boolean };
      if (!success) {
        Alert.alert('Error', 'Failed to update league settings');
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['league', hash] });
      await queryClient.invalidateQueries({ queryKey: ['settings', hash] });
      await queryClient.invalidateQueries({ queryKey: ['leagueMembers', hash] });

      reactForm.reset(data);
      onSubmit?.();
      Alert.alert('Success', `League settings updated for ${data.name}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update league some or all settings');
    }
  });

  const resetForm = () => {
    if (league && membersList.length > 0) {
      const adminIds = membersList.filter(m => m.role === 'Admin').map(m => m.value) ?? [];
      reactForm.reset({
        name: league.name,
        admins: adminIds,
      });
    } else {
      reactForm.reset();
    }
  };

  const editable = (!!leagueMembers && leagueMembers.loggedIn?.role === 'Owner') && league?.status !== 'Inactive';

  const selectedAdminNames = membersList
    .filter(member => selectedAdmins.includes(member.value))
    .map(member => member.label)
    .join(', ');

  return {
    reactForm,
    handleSubmit,
    resetForm,
    editable,
    membersList,
    selectedAdmins,
    selectedAdminNames,
    adminsModal,
  };
}
