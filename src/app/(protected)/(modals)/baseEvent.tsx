import { useRouter } from 'expo-router';
import { View, Text, Platform, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSysAdmin } from '~/hooks/user/useSysAdmin';
import { useMemo, useState } from 'react';
import BaseEventHeader from '~/components/leagues/actions/events/base/header/view';
import { useSeasonsData } from '~/hooks/seasons/useSeasonsData';
import CreateBaseEvent from '~/components/leagues/actions/events/base/create';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BaseEventScreen() {
  const { data: userId, isLoading, isError } = useSysAdmin();
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

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-background py-16 justify-center items-center'>
        <BaseEventHeader
          seasons={scoreData ?? []}
          value={selectedSeason}
          setValue={setSelectedSeason} />
        <Text className='text-lg text-center'>Checking Sys Admin Status...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !userId) {
    router.dismiss();
    return null;
  }

  return (
    <SafeAreaView className='flex-1 bg-background justify-center items-center'>
      <BaseEventHeader
        seasons={scoreData ?? []}
        value={selectedSeason}
        setValue={setSelectedSeason} />
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
    </SafeAreaView>
  );
}
