'use client';
import { View, Text, Pressable } from 'react-native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { LeagueNameZod } from '~/types/leagues';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useCreateLeague } from '~/hooks/leagues/useCreateLeague';
import { cn } from '~/lib/util';
import { ArrowLeft } from 'lucide-react-native';

interface CreateLeagueFormProps {
  onSubmit?: () => void;
}

export default function CreateLeagueForm({ onSubmit }: CreateLeagueFormProps) {
  const { reactForm, handleSubmit } = useCreateLeague(onSubmit);

  const pages = [
    {
      content: (
        <View className='flex-1 justify-center items-center p-6'>
          <Text className='text-2xl font-bold mb-6'>NAME</Text>
          <Text className='text-center text-muted-foreground mb-8'>
            Choose a name for your league
          </Text>
        </View>
      ),
      canProceed: LeagueNameZod.safeParse(reactForm.watch('leagueName')).success,
      isFirst: true,
    },
    {
      content: (
        <View className='flex-1 justify-center items-center p-6'>
          <Text className='text-2xl font-bold mb-6'>DRAFT</Text>
          <Text className='text-center text-muted-foreground mb-8'>
            Set your draft date and time
          </Text>
        </View>
      ),
      canProceed: true,
    },
    {
      content: (
        <View className='flex-1 justify-center items-center p-6'>
          <Text className='text-2xl font-bold mb-6'>MEMBER</Text>
          <Text className='text-center text-muted-foreground mb-8'>
            Set your display name and color
          </Text>
        </View>
      ),
      canProceed: reactForm.formState.isValid,
      isLast: true,
    },
  ];

  const { props, progressProps, ref } = useCarousel(pages);

  return (
    <View className='bg-card rounded-lg items-center justify-center'>
      <Carousel
        loop={false}
        enabled={false}
        renderItem={({ item }) => (
          <View className='flex-1'>
            {item.content}
            <View className='self-center items-center w-90p relative'>
              <Pressable
                onPress={item.isLast ? handleSubmit : () => ref.current?.next()}
                disabled={!item.canProceed}
                className={cn('bg-primary rounded-md px-4 py-2 absolute bottom-4',
                  item.canProceed ? 'opacity-100' : 'opacity-50')}>
                <Text className='text-white text-center font-semibold'>
                  {item.isLast ? 'Create League' : 'Next'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => ref.current?.prev()}
                className={cn('absolute bottom-6 left-4',
                  !item.isFirst ? 'opacity-100' : 'opacity-0')}>
                <Text className='text-muted-foreground text-center font-semibold'>
                  <ArrowLeft size={16} />
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        {...props} />
      <View className='pb-8'>
        <Pagination.Basic {...progressProps} containerStyle={{ ...progressProps.containerStyle, marginBottom: 3 }} />
      </View>
    </View >
  );
}


