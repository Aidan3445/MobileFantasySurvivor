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
  const fetchData = useFetch('GET');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const reactForm = useForm<LeagueMemberInsert>({
    defaultValues: { displayName: user?.username || '', color: '' },
    resolver: zodResolver(LeagueMemberInsertZod)
  });

  useEffect(() => {
    reactForm.setValue('displayName', user?.username ?? '');
  }, [user, reactForm]);

  const getPublicLeague = useQuery<PublicLeague>({
    queryKey: ['publicLeague', hash],
    queryFn: async () => {
      if (!hash) throw new Error('League hash is required');

      const response = await fetchData(`/api/leagues/join?hash=${hash}`);
      if (!response.ok) {
        console.log('Fetched public league data for joining:', hash, response.status);
        throw new Error('Failed to fetch league');
      }
      return response.json();
    },
    enabled: !!hash,
    gcTime: 0,
    staleTime: 0, // 5 minutes
    retry: false
  });

  const handleSubmit = reactForm.handleSubmit(async data => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a league');
      return;
    }
    if (!getPublicLeague.data) {
      Alert.alert('Error', 'League not found');
      return;
    }
    try {
      const response = await postData('/api/leagues/join', { body: { hash, newMember: data } });
      if (response.status === 409) {
        const errorData = await response.json();
        console.error('Conflict joining league:', errorData);
        Alert.alert('Error', errorData.message || 'You are already a member of this league');
        router.replace(`/leagues/${hash}`);
        return;
      }
      if (response.status !== 201) {
        const errorData = await response.json();
        console.error('Error joining league:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to join league');
        return;
      }

      const { success } = (await response.json()) as { success: boolean };

      if (!success) throw new Error('Failed to join league');

      reactForm.reset();
      onSubmit?.();
      await queryClient.invalidateQueries({ queryKey: ['leagues'] });

      // now fetch the league to load details into cache
      const leagueResponse = await fetchData(`/api/leagues/${hash}`);
      if (leagueResponse.status === 200) {
        const leagueData = await leagueResponse.json();
        await queryClient.setQueryData(['leagues', hash], leagueData);
      }
      router.prefetch({ pathname: '/leagues/[hash]', params: { hash: hash } });

      Alert.alert('Success', `League Joined: ${getPublicLeague.data.name}`);
      router.dismissTo('/leagues');
      router.replace(`/leagues/${hash}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to join league');
    }
  });

  return { reactForm, handleSubmit, getPublicLeague, isSubmitting: reactForm.formState.isSubmitting };
}
