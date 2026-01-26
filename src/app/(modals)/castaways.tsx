'use client';

import { RefreshControl, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useLeagueActionDetails } from '~/hooks/leagues/enrich/useActionDetails';
import DraftCastaways from '~/components/leagues/draft/castaways/view';
import { useLeagueRefresh } from '~/hooks/helpers/refresh/useLeagueRefresh';

export default function DraftCastawaysScreen() {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league } = useLeague(hash);
  const { actionDetails } = useLeagueActionDetails(hash);
  const { refreshing, onRefresh } = useLeagueRefresh();
  const router = useRouter();

  if (!league) return router.dismiss();

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <ScrollView
        className='w-full pt-28'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }>
        <View className='gap-y-4 px-2 pb-4'>
          {actionDetails && <DraftCastaways actionDetails={actionDetails} />}
        </View>
      </ScrollView>
    </View>
  );
}
