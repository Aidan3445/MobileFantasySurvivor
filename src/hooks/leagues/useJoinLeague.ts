import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '~/hooks/helpers/useFetch';
import { type LeagueMemberInsert, LeagueMemberInsertZod } from '~/types/leagueMembers';
import { type PublicLeague } from '~/types/leagues';

export function useJoinLeague(onSubmit?: () => void) {
  const postData = useFetch('POST');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const reactForm = useForm<LeagueMemberInsert>({
    defaultValues: {
      displayName: user?.username || '',
      color: '',
    },
    resolver: zodResolver(LeagueMemberInsertZod),
  });

  useEffect(() => {
    reactForm.setValue('displayName', user?.username ?? '');
  }, [user, reactForm]);

  const getPublicLeague = useQuery<PublicLeague>({
    queryKey: ['publicLeague', hash],
    queryFn: async () => {
      if (!hash) throw new Error('League hash is required');

      const response = await postData(`/api/leagues/join?hash=${hash}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch league');
      }
      return response.json();
    },
    enabled: !!hash,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSubmit = reactForm.handleSubmit(async (data) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a league');
      return;
    }
    if (!getPublicLeague.data) {
      Alert.alert('Error', 'League not found');
      return;
    }
    try {
      const response = await postData('/api/leagues/join', {
        body: {
          hash,
          newMember: data
        }
      });
      if (response.status !== 201) {
        const errorData = await response.json();
        console.error('Error joining league:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to join league');
        return;
      }

      const { success } = await response.json() as { success: boolean };

      if (!success) throw new Error('Failed to join league');

      reactForm.reset();
      onSubmit?.();
      await queryClient.invalidateQueries({ queryKey: ['leagues'] });
      Alert.alert('Success', `League Joined: ${getPublicLeague.data.name}`);
      router.push(`/leagues/${hash}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create league');
    }
  });

  return {
    reactForm,
    handleSubmit,
    getPublicLeague,
  };
}
