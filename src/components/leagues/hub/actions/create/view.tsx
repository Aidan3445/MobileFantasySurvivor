'use client';
import { View, Text, Pressable } from 'react-native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { LeagueInsertZod } from '~/types/leagues';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useCreateLeague } from '~/hooks/leagues/useCreateLeague';
import { cn } from '~/lib/util';
import { ArrowLeft } from 'lucide-react-native';
import LeagueName from '~/components/leagues/hub/actions/create/leagueName';
import Header from '~/components/home/header/view';
import { type ReactNode } from 'react';
import DraftDate from '~/components/leagues/hub/actions/create/draftDate';
import LeagueMember from '~/components/leagues/hub/actions/create/leagueMember';

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
        content: (<LeagueName control={reactForm.control} />),
        optional: false,
        isFirst: true,
      },
      {
        name: 'draftDate',
        content: (<DraftDate control={reactForm.control} />),
        optional: true,
      },
      {
        name: 'newMember',
        content: (
          <LeagueMember control={reactForm.control} />
        ),
        optional: false,
        isLast: true,
      },
    ];

  const { props, progressProps, ref } = useCarousel(pages);

  return (
    <View className='h-90p pt-12 bg-card rounded-lg items-center justify-end overflow-hidden'>
      <Header className='flex-1' />
      <Carousel
        loop={false}
        enabled={false}
        renderItem={({ item }) => {
          const buttonDisabled = !item.optional && !LeagueInsertZod.shape[item.name].safeParse(reactForm.watch(item.name)).success;
          const fieldTouched = reactForm.formState.touchedFields[item.name];
          return (
            <View className='flex-1'>
              {item.content}
              <View className='self-center items-center w-90p relative'>
                <Pressable
                  onPress={item.isLast ? handleSubmit : () => ref.current?.next()}
                  disabled={buttonDisabled}
                  className={cn('bg-primary rounded-md px-4 py-2 absolute bottom-4 w-1/2',
                    buttonDisabled ? 'opacity-50' : 'opacity-100')}>
                  <Text className='text-white text-center font-semibold'>
                    {item.isLast ? 'Create League' : !fieldTouched && item.optional ? 'Skip' : 'Next'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    ref.current?.prev();
                    reactForm.resetField(item.name);
                  }}
                  className={cn('absolute bottom-2 left-0 p-4 pr-12',
                    !item.isFirst ? 'opacity-100' : 'opacity-0')}>
                  <Text className='text-muted-foreground text-center font-semibold'>
                    <ArrowLeft size={16} />
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        {...props} />
      <View className='h-7'>
        <Pagination.Basic {...progressProps} containerStyle={{ ...progressProps.containerStyle, marginBottom: 30 }} />
      </View>
    </View >
  );
}


