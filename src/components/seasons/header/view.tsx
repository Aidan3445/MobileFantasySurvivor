'use client';

import { Text, View } from 'react-native';
import SelectSeason from '~/components/home/scoreboard/selectSeason';
import useHeaderHeight from '~/hooks/ui/useHeaderHeight';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type SeasonsDataQuery } from '~/types/seasons';

interface SeasonsHeaderProps {
  seasons: SeasonsDataQuery[];
  value: string;
  setValue: (_: string) => void;
}

export default function SeasonsHeader({ seasons, value, setValue }: SeasonsHeaderProps) {
  const height = useHeaderHeight();

  const seasonOptions: SearchableOption<string>[] = seasons.map(season => ({
    label: season.season.name,
    value: season.season.name
  }));

  return (
    <View
      className='absolute top-0 z-10 w-full items-center justify-end bg-card shadow-lg'
      style={{ height }}>
      <View className='items-center justify-center'>
        <View className='flex-row items-center justify-center gap-0.5'>
          <View className='h-6 w-1 bg-primary rounded-full' />
          <Text
            allowFontScaling={false}
            className='text-2xl font-black uppercase tracking-tight text-foreground'>
            Survivor Seasons
          </Text>
          <View className='h-6 w-1 bg-primary rounded-full' />
        </View>
      </View>
      <SelectSeason
        seasons={seasonOptions}
        value={value}
        setValue={setValue}
        className='-bottom-0.5 right-4 top-auto' />
    </View>
  );
}
