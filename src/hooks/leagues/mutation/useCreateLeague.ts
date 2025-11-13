import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { type LeagueInsert, LeagueInsertZod } from '~/types/leagues';
import { useFetch } from '~/hooks/helpers/useFetch';

export function useCreateLeague(onSubmit?: () => void) {
  const postData = useFetch('POST');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const reactForm = useForm<LeagueInsert>({
    defaultValues: { leagueName: '', newMember: { displayName: user?.username || '', color: '' } },
    resolver: zodResolver(LeagueInsertZod)
  });

  useEffect(() => {
    reactForm.setValue('newMember.displayName', user?.username ?? '');
  }, [user, reactForm]);

  const handleSubmit = reactForm.handleSubmit(async data => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a league');
      return;
    }
    try {
      const response = await postData('/api/leagues/create', { body: data });
      if (response.status !== 201) {
        const errorData = await response.json();
        console.error('Error creating league:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to create league');
        return;
      }

      const { newHash } = (await response.json()) as { newHash: string };

      if (!newHash) throw new Error('Failed to create league');

      reactForm.reset();
      onSubmit?.();
      await queryClient.invalidateQueries({ queryKey: ['leagues'] });
      Alert.alert('Success', `League created: ${data.leagueName}`);
      router.push(`/leagues/${newHash}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create league');
    }
  });

  return { reactForm, handleSubmit };
}
