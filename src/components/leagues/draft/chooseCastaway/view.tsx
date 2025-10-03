'use client';

import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { type DraftDetails } from '~/types/leagues';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
import SearchableSelect from '~/components/common/searchableSelect';
import Button from '~/components/common/button';

interface ChooseCastawayProps {
  draftDetails: DraftDetails;
  onDeck: boolean;
  hash: string;
}

export default function ChooseCastaway({ draftDetails, onDeck, hash }: ChooseCastawayProps) {
  const [selectedCastawayId, setSelectedCastawayId] = useState<number | null>(null);
  const [selectedTribeId, setSelectedTribeId] = useState<number | null>(null);

  const tribeSelectHook = useSearchableSelect<number>();
  const castawaySelectHook = useSearchableSelect<number>();

  // Create tribe options
  const tribeOptions = Object.values(draftDetails).map(({ tribe }) => ({
    value: tribe.tribeId,
    label: tribe.tribeName
  }));

  // Create castaway options based on selected tribe
  const castawayOptions = selectedTribeId
    ? (draftDetails[selectedTribeId]?.castaways || [])
        .filter(({ member, castaway }) => !member && !castaway.eliminatedEpisode)
        .map(({ castaway }) => ({ value: castaway.castawayId, label: castaway.fullName }))
    : [];

  const handleTribeSelect = (tribeId: number) => {
    setSelectedTribeId(tribeId);
    setSelectedCastawayId(null); // Reset castaway selection when tribe changes
  };

  const handleCastawaySelect = (castawayId: number) => {
    setSelectedCastawayId(castawayId);
  };

  const selectedTribe = selectedTribeId ? draftDetails[selectedTribeId]?.tribe : null;
  const selectedCastaway =
    selectedCastawayId && selectedTribeId
      ? draftDetails[selectedTribeId]?.castaways.find(
          ({ castaway }) => castaway.castawayId === selectedCastawayId
        )?.castaway
      : null;

  const handleSubmitPick = () => {
    if (!selectedCastawayId) return;

    // TODO: Implement the draft pick submission logic
    console.log('Submitting pick:', { castawayId: selectedCastawayId, hash });
    // This would call a mutation hook to submit the pick
  };

  return (
    <View className='w-full rounded-lg bg-card p-4'>
      <Text className='text-card-foreground mb-4 text-lg font-bold'>
        {onDeck ? 'Get Ready - You\'re On Deck!' : 'It\'s Your Turn!'}
      </Text>

      <Text className='mb-4 text-sm text-muted-foreground'>
        Select a castaway to draft to your team. They will earn you points based on their
        performance and survival.
      </Text>

      <View className='gap-4'>
        {/* Tribe Selection */}
        <View>
          <Text className='text-card-foreground mb-2 text-sm font-medium'>1. Choose a Tribe</Text>
          <Pressable
            className='border-border rounded-lg border bg-background p-3'
            onPress={tribeSelectHook.openModal}>
            <Text className={selectedTribe ? 'text-foreground' : 'text-muted-foreground'}>
              {selectedTribe ? selectedTribe.tribeName : 'Select a tribe...'}
            </Text>
          </Pressable>
        </View>

        {/* Castaway Selection */}
        {selectedTribeId && (
          <View>
            <Text className='text-card-foreground mb-2 text-sm font-medium'>
              2. Choose a Castaway
            </Text>
            <Pressable
              className='border-border rounded-lg border bg-background p-3'
              onPress={castawaySelectHook.openModal}>
              <Text className={selectedCastaway ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedCastaway ? selectedCastaway.fullName : 'Select a castaway...'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Submit Button */}
        {selectedCastaway && !onDeck && (
          <Button
            className='mt-4 rounded-lg bg-primary p-3'
            onPress={handleSubmitPick}>
            <Text className='text-center text-lg font-bold text-white'>
              Draft {selectedCastaway.fullName}
            </Text>
          </Button>
        )}

        {onDeck && selectedCastaway && (
          <View className='mt-4 rounded-lg bg-muted p-3'>
            <Text className='text-center text-sm text-muted-foreground'>
              Ready to draft {selectedCastaway.fullName} when your turn comes!
            </Text>
          </View>
        )}
      </View>

      {/* Tribe Selection Modal */}
      <SearchableSelect
        isVisible={tribeSelectHook.isVisible}
        onClose={tribeSelectHook.closeModal}
        options={tribeSelectHook.filterOptions(tribeOptions)}
        selectedValue={selectedTribeId ?? 0}
        onSelect={handleTribeSelect}
        searchText={tribeSelectHook.searchText}
        onSearchChange={tribeSelectHook.setSearchText}
        placeholder='Search tribes...'
        emptyMessage='No tribes found.'
      />

      {/* Castaway Selection Modal */}
      <SearchableSelect
        isVisible={castawaySelectHook.isVisible}
        onClose={castawaySelectHook.closeModal}
        options={castawaySelectHook.filterOptions(castawayOptions)}
        selectedValue={selectedCastawayId ?? 0}
        onSelect={handleCastawaySelect}
        searchText={castawaySelectHook.searchText}
        onSearchChange={castawaySelectHook.setSearchText}
        placeholder='Search castaways...'
        emptyMessage='No castaways available in this tribe.'
      />
    </View>
  );
}
