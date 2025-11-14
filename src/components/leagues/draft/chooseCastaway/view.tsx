'use client';

import { Text, View, Pressable } from 'react-native';
import { type DraftDetails } from '~/types/leagues';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
import SearchableSelect from '~/components/common/searchableSelect';
import Button from '~/components/common/button';
import ColorRow from '~/components/shared/colorRow';
import { useChooseCastaway } from '~/hooks/leagues/mutation/useChooseCastaway';
import { Controller } from 'react-hook-form';
import { getContrastingColor } from '@uiw/color-convert';

interface ChooseCastawayProps {
  draftDetails: DraftDetails;
  onDeck: boolean;
  hash: string;
}

export default function ChooseCastaway({ draftDetails, onDeck, hash }: ChooseCastawayProps) {
  const { reactForm, handleSubmit } = useChooseCastaway(hash);
  const castawaySelectHook = useSearchableSelect<number>();

  const castawayOptions = Object.values(draftDetails).flatMap(({ tribe, castaways }) =>
    castaways.map(({ castaway, member }) => ({
      value: castaway.castawayId,
      label: castaway.fullName,
      tribe: tribe,
      member: member,
      disabled: !!member
    }))
  );

  return (
    <View className='w-full rounded-lg bg-card p-4'>
      <Controller
        control={reactForm.control}
        name='castawayId'
        render={({ field: { onChange, value } }) => {
          const selectedCastaway = castawayOptions.find(opt => opt.value === value);

          return (
            <>
              <Text className='text-center text-2xl font-semibold text-card-foreground mb-4'>
                {onDeck ? 'You\'re on deck' : 'You\'re on the clock!'}
              </Text>

              <View className='flex-row items-center gap-4'>
                <Pressable
                  className='border-border flex-1 rounded-lg border bg-background p-3'
                  onPress={castawaySelectHook.openModal}>
                  <Text className={selectedCastaway ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedCastaway ? selectedCastaway.label : 'Select castaway'}
                  </Text>
                </Pressable>
                <Button
                  className='w-40 rounded-lg bg-primary p-3'
                  disabled={!reactForm.formState.isValid || onDeck}
                  onPress={handleSubmit}>
                  <Text className='text-center font-bold text-white'>
                    {onDeck ? 'Almost time!' : 'Submit Pick'}
                  </Text>
                </Button>
              </View>
              <SearchableSelect
                isVisible={castawaySelectHook.isVisible}
                onClose={castawaySelectHook.closeModal}
                options={castawaySelectHook.filterOptions(
                  castawayOptions.map(opt => ({
                    value: opt.value,
                    label: opt.label,
                    disabled: opt.disabled,
                    renderLabel: () => (
                      <View
                        className='flex-row items-center gap-1 rounded p-2 w-[90%]'
                        style={
                          opt.disabled && opt.member
                            ? {
                              backgroundColor: opt.member.color,
                            }
                            : undefined
                        }>
                        <ColorRow
                          className='min-w-12 justify-center px-1 py-1 leading-tight'
                          color={opt.tribe.tribeColor}>
                          <Text
                            className='text-center text-xs font-normal'
                            style={{ color: getContrastingColor(opt.tribe.tribeColor) }}>
                            {opt.tribe.tribeName}
                          </Text>
                        </ColorRow>
                        <Text
                          className='ml-1'
                          style={
                            opt.disabled && opt.member
                              ? { color: getContrastingColor(opt.member.color) }
                              : { color: 'white' }
                          }>
                          {opt.label}
                          {opt.disabled && opt.member && ` (${opt.member.displayName})`}
                        </Text>
                      </View>
                    )
                  }))
                )}
                selectedValue={value ?? 0}
                onSelect={selectedValue => {
                  onChange(selectedValue);
                  castawaySelectHook.closeModal();
                }}
                searchText={castawaySelectHook.searchText}
                onSearchChange={castawaySelectHook.setSearchText}
                placeholder='Search castaways...'
                emptyMessage='No castaways available.'
              />
            </>
          );
        }}
      />
    </View>
  );
}
