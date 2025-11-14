'use client';

import { ScrollView, Text, View, Image, Pressable, Linking } from 'react-native';
import { type DraftDetails } from '~/types/leagues';
import { useState } from 'react';
import Modal from '~/components/common/modal';
import ColorRow from '~/components/shared/colorRow';
import { cn } from '~/lib/utils';

interface DraftCastawaysProps {
  actionDetails: DraftDetails;
}

interface CastawayModalProps {
  castaway: any;
  isVisible: boolean;
  onClose: () => void;
}

function CastawayModal({ castaway, isVisible, onClose }: CastawayModalProps) {
  if (!castaway) return null;

  const handleLearnMore = () => {
    const url = `https://survivor.fandom.com/wiki/${encodeURIComponent(castaway.fullName)}`;
    Linking.openURL(url);
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      animationType='fade'>
      <View className='items-center gap-4'>
        <Image
          source={{ uri: castaway.imageUrl }}
          className='h-24 w-24 rounded-full'
          resizeMode='cover'
        />
        <Text className='text-foreground text-xl font-bold'>{castaway.fullName}</Text>
        <View className='w-full gap-2'>
          <Text className='text-foreground'>
            <Text className='font-semibold'>Age:</Text> {castaway.age}
          </Text>
          <Text className='text-foreground'>
            <Text className='font-semibold'>Residence:</Text> {castaway.residence}
          </Text>
          <Text className='text-foreground'>
            <Text className='font-semibold'>Occupation:</Text> {castaway.occupation}
          </Text>
        </View>
        <Pressable
          className='mt-4 rounded-lg bg-primary p-3'
          onPress={handleLearnMore}>
          <Text className='font-semibold text-white'>Learn More</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

export default function DraftCastaways({ actionDetails }: DraftCastawaysProps) {
  const [selectedCastaway, setSelectedCastaway] = useState<any>(null);

  return (
    <View className='w-full overflow-hidden rounded-lg bg-card'>
      <View className='p-4 text-center'>
        <Text className='text-card-foreground mb-2 text-2xl font-semibold'>Do Your Research!</Text>
        <Text className='text-muted-foreground'>
          Tap the castaways below to learn more about them
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={Object.values(actionDetails).length > 1}
        className='px-4 pb-4'>
        <View className=' gap-4'>
          {Object.values(actionDetails).map(({ tribe, castaways }) => (
            <View
              key={tribe.tribeId}
              className={cn('rounded-lg bg-background p-3',
                Object.values(actionDetails).length === 1 ? 'w-[90vw]' : 'min-w-[240px]')}
              style={{ borderWidth: 3, borderColor: tribe.tribeColor }}>
              <Text className='text-foreground mb-3 text-lg font-semibold'>{tribe.tribeName}</Text>
              <View className='gap-2'>
                {castaways.map(({ castaway, member }) => {
                  const isEliminated = !!castaway.eliminatedEpisode;
                  const isDrafted = !!member;

                  return (
                    <Pressable
                      key={castaway.castawayId}
                      className={`rounded-lg bg-muted p-3 ${isDrafted || isEliminated ? 'opacity-50' : ''
                        }`}
                      onPress={() => setSelectedCastaway(castaway)}>
                      <View className='relative flex-row items-center gap-3'>
                        <Image
                          source={{ uri: castaway.imageUrl }}
                          className={`h-12 w-12 rounded-full ${isDrafted || isEliminated ? 'grayscale' : ''
                            }`}
                          resizeMode='cover'
                        />
                        <View className='flex-1'>
                          <Text className='text-foreground font-medium'>{castaway.fullName}</Text>
                          {isEliminated && (
                            <Text className='text-xs text-destructive'>Eliminated</Text>
                          )}
                        </View>
                        {member && (
                          <ColorRow
                            className='absolute -right-2 -top-1 z-10 rotate-12 px-2 py-1'
                            color={member.color}>
                            <Text className='text-xs font-medium text-white'>
                              {member.displayName}
                            </Text>
                          </ColorRow>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CastawayModal
        castaway={selectedCastaway}
        isVisible={!!selectedCastaway}
        onClose={() => setSelectedCastaway(null)}
      />
    </View>
  );
}
