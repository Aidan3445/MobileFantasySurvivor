'use client';

import { View, Text } from 'react-native';
import Button from '~/components/common/button';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { LeagueInsertZod } from '~/types/leagues';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useCreateLeague } from '~/hooks/leagues/mutation/useCreateLeague';
import { cn } from '~/lib/utils';
import { ArrowLeft } from 'lucide-react-native';
import LeagueName from '~/components/leagues/actions/create/leagueName';
import Header from '~/components/home/header/view';
import { type ReactNode } from 'react';
import DraftDate from '~/components/leagues/actions/create/draftDate';
import LeagueMember from '~/components/leagues/actions/create/leagueMember';

interface CreateLeagueFormProps {
  onSubmit?: () => void;
}

export default function CreateLeagueForm({ onSubmit }: CreateLeagueFormProps) {
  const { reactForm, handleSubmit } = useCreateLeague(onSubmit);

  const pages: {
    name: keyof typeof LeagueInsertZod.shape;
    content: ReactNode;
    optional: boolean;
    isFirst?: boolean;
    isLast?: boolean;
  }[] = [
    {
      name: 'leagueName',
      content: <LeagueName control={reactForm.control} />,
      optional: false,
      isFirst: true
    },
    { name: 'draftDate', content: <DraftDate control={reactForm.control} />, optional: true },
    {
      name: 'newMember',
      content: (
        <LeagueMember
          control={reactForm.control}
          formPrefix='newMember'
          className='mb-14'
        />
      ),
      optional: false,
      isLast: true
    }
  ];

  const { props, progressProps, ref } = useCarousel(pages);

  return (
    <View className='h-90p items-center justify-end overflow-hidden rounded-lg bg-card pt-12'>
      <Header className='flex-1' />
      <Carousel
        loop={false}
        enabled={false}
        renderItem={({ item }) => {
          const buttonDisabled =
            !item.optional
            && !LeagueInsertZod.shape[item.name].safeParse(reactForm.watch(item.name)).success;
          const fieldTouched = reactForm.formState.touchedFields[item.name];
          return (
            <View className='flex-1'>
              {item.content}
              <View className='w-90p relative items-center self-center'>
                <Button
                  onPress={item.isLast ? handleSubmit : () => ref.current?.next()}
                  disabled={buttonDisabled}
                  className={cn('absolute bottom-4 w-1/2 rounded-md bg-primary px-4 py-2')}>
                  <Text className='text-center font-semibold text-white'>
                    {item.isLast
                      ? 'Create League'
                      : !fieldTouched && item.optional
                        ? 'Skip'
                        : 'Next'}
                  </Text>
                </Button>
                <Button
                  onPress={() => {
                    ref.current?.prev();
                    reactForm.resetField(item.name);
                  }}
                  className={cn(
                    'absolute bottom-2 left-0 p-4 pr-12',
                    !item.isFirst ? 'opacity-100' : 'opacity-0'
                  )}>
                  <Text className='text-center font-semibold text-muted-foreground'>
                    <ArrowLeft size={16} />
                  </Text>
                </Button>
              </View>
            </View>
          );
        }}
        {...props}
      />
      <View className='h-7'>
        <Pagination.Basic
          {...progressProps}
          containerStyle={{ ...progressProps.containerStyle, marginBottom: 30 }}
        />
      </View>
    </View>
  );
}
