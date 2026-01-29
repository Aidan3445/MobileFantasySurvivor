import { useRouter } from 'expo-router';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSysAdmin } from '~/hooks/user/useSysAdmin';
import { useMemo, useState } from 'react';
import PlaygroundHeader from '~/components/playground/header/view';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import CreateBaseEvent from '~/components/leagues/actions/events/base/create';

export default function BaseEventScreen() {
  const { data: userId, isFetching, isError } = useSysAdmin();
  const router = useRouter();

  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const { data: scoreData } = useSeasonsData(true);

  const selectedSeasonData = useMemo(() => {
    if (!scoreData) return null;
    const selected = scoreData.find(season => season.season.name === selectedSeason);
    if (selected) return selected;
    if (scoreData.length > 0) {
      setSelectedSeason(scoreData[0]!.season.name);
      return scoreData[0];
    }
    return null;
  }, [scoreData, selectedSeason]);

  if (isFetching) {
    return (
      <View className='page py-16 justify-center items-center'>
        <PlaygroundHeader
          seasons={scoreData ?? []}
          value={selectedSeason}
          setValue={setSelectedSeason}
          extraHeight={0}
          className='justify-center' />
        <Text className='text-lg text-center'>Checking Sys Admin Status...</Text>
      </View>
    );
  }

  if (isError || !userId) {
    router.dismiss();
    return null;
  }

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <PlaygroundHeader
        seasons={scoreData ?? []}
        value={selectedSeason}
        setValue={setSelectedSeason}
        extraHeight={0}
        className='justify-center' />
      <ScrollView className='w-full pt-20' showsVerticalScrollIndicator={false}>
        <View className='gap-y-4 px-1.5 pb-16'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <CreateBaseEvent seasonId={selectedSeasonData?.season.seasonId ?? null} />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
}
