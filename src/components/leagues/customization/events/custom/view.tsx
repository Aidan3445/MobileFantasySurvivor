'use client';
import { CircleAlert, Lock, LockOpen, Plus } from 'lucide-react-native';
import { Text, View, Pressable } from 'react-native';
import { useCustomEventRules } from '~/hooks/leagues/mutation/useCustomEventRules';
import CustomEventModal from '~/components/leagues/customization/events/custom/modal';
import CustomEventCard from '~/components/leagues/customization/events/custom/card';
import { colors } from '~/lib/colors';
import { type CustomEventRule } from '~/types/leagues';
import { useCarousel } from '~/hooks/ui/useCarousel';
import { useEffect } from 'react';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';

export default function CustomEventRules() {
  const {
    reactForm,
    locked,
    setLocked,
    modalOpen,
    setModalOpen,
    handleSubmit,
    updateCustomEvent,
    deleteCustomEvent,
    disabled,
    customRules,
    leagueMembers
  } = useCustomEventRules();

  const { props, progressProps, setCarouselData } = useCarousel<CustomEventRule[]>([]);
  useEffect(() => {
    const slides = customRules.reduce((threes, rule, index) => {
      if (index % 3 === 0) threes.push([]);
      threes[threes.length - 1]!.push(rule);
      return threes;
    }, [] as CustomEventRule[][]);
    setCarouselData(slides);
  }, [customRules, setCarouselData]);

  return (
    <View className='bg-card p-2 rounded-xl w-full'>
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-lg font-bold text-card-foreground'>
          Custom Events{' '}
          <Text className='text-muted-foreground text-sm font-normal'>
            ({customRules.length}/6)
          </Text>
        </Text>
        {!disabled && (
          <Pressable
            onPress={() => {
              if (locked) {
                setLocked(false);
              } else {
                setLocked(true);
                reactForm.reset();
              }
            }}>
            {locked ? (
              <Lock size={24} color={colors.primary} />
            ) : (
              <LockOpen size={24} color={colors.secondary} />
            )}
          </Pressable>
        )}
      </View>
      <View className='gap-2 mb-4'>
        <Text className='text-sm text-muted-foreground leading-relaxed'>
          These <Text className='italic'>Custom Events</Text> let you make your league truly unique!
          Anything can be scored—from speaking the first word of the episode to orchestrating a blindside.
          {'\n'}The possibilities are endless!
        </Text>
        <Text className='text-sm text-muted-foreground leading-relaxed'>
          Custom events require manual scoring. Once your league drafts, you'll see a new
          tab on this page where you can score, edit and delete custom events during the season.
        </Text>
        <View>
          <Text className='text-sm text-muted-foreground mb-2'>
            <Text className='italic'>Custom Events</Text> can be scored in two ways:
          </Text>
          <View className='ml-4 gap-1'>
            <Text className='text-sm text-muted-foreground'>
              1. <Text className='font-semibold'>Direct</Text>: Points are awarded like{' '}
              <Text className='italic'>Official Events</Text>, based on a player's pick.
            </Text>
            <Text className='text-sm text-muted-foreground'>
              2. <Text className='font-semibold'>Prediction</Text>: Points are awarded to members who correctly predict an event's outcome.
              Predictions can be made before each episode or at specific times throughout the season.
            </Text>
          </View>
        </View>
      </View>
      {!disabled && !locked && (
        <Pressable
          className='flex-row items-center justify-center gap-2 bg-primary rounded-lg p-3 mb-4 active:opacity-70 disabled:opacity-50'
          disabled={customRules.length >= 6}
          onPress={() => setModalOpen(true)}>
          {customRules.length >= 6 ? (
            <CircleAlert size={20} color='white' />
          ) : (
            <Plus size={20} color='white' />
          )}
          <Text className='text-white font-semibold'>
            {customRules.length >= 6 ? '6 Custom Events Max' : 'Add Custom Event'}
          </Text>
        </Pressable>
      )}
      {customRules.length > 0 ? (
        <View className='relative items-center'>
          <Carousel
            height={300}
            renderItem={({ item, index }) => (
              <View key={index} className='flex-col gap-2 px-2'>
                {item.map((rule) => (
                  <CustomEventCard
                    key={rule.customEventRuleId}
                    rule={rule}
                    locked={disabled || locked}
                    onUpdate={updateCustomEvent}
                    onDelete={deleteCustomEvent}
                    leagueMembers={leagueMembers} />
                ))}
              </View>
            )}
            {...props} />
          <Pagination.Basic
            {...progressProps}
            containerStyle={{ ...progressProps.containerStyle, marginBottom: 3 }} />
        </View>
      ) : (
        <Text className='text-lg text-center font-semibold text-card-foreground px-2 py-8'>
          No custom events have been created yet.
        </Text>
      )}
      <CustomEventModal
        type='Create'
        isVisible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          reactForm.reset();
        }}
        onSubmit={() => handleSubmit()}
        reactForm={reactForm} />
    </View>
  );
}
