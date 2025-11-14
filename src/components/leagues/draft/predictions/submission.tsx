'use client';

import { Text, View, Pressable } from 'react-native';
import { Controller } from 'react-hook-form';
import { type MakePrediction, type ReferenceType } from '~/types/events';
import { useMakePrediction } from '~/hooks/leagues/mutation/useMakePrediction';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
import SearchableSelect from '~/components/common/searchableSelect';
import Button from '~/components/common/button';
import ColorRow from '~/components/shared/colorRow';
import { getContrastingColor } from '@uiw/color-convert';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

interface SubmissionCardProps {
  prediction: MakePrediction;
  options: Record<ReferenceType | 'Direct Castaway', Record<string, {
    id: number;
    color: string;
    tribeName?: string;
  }>>;
}

export default function SubmissionCard({ prediction, options }: SubmissionCardProps) {
  const { hash } = useLocalSearchParams<{ hash: string }>();
  const { data: league } = useLeague(hash);
  const { reactForm, handleSubmit } = useMakePrediction(hash, prediction, options);
  const selectHook = useSearchableSelect<number>();

  // Flatten all options into a single array for the searchable select
  const flatOptions = useMemo(() => {
    const allOptions: Array<{
      value: number;
      label: string;
      referenceType: ReferenceType | 'Direct Castaway';
      color: string;
      tribeName?: string;
    }> = [];

    Object.entries(options).forEach(([refType, refs]) => {
      Object.entries(refs).forEach(([name, data]) => {
        allOptions.push({
          value: data.id,
          label: name,
          referenceType: refType as ReferenceType | 'Direct Castaway',
          color: data.color,
          tribeName: data.tribeName
        });
      });
    });

    // Sort by tribe name if available, then by label
    return allOptions.sort((a, b) => {
      if (a.tribeName && b.tribeName) {
        const tribeCompare = a.tribeName.localeCompare(b.tribeName);
        if (tribeCompare !== 0) return tribeCompare;
      }
      return a.label.localeCompare(b.label);
    });
  }, [options]);

  if (!league) return null;

  return (
    <Controller
      control={reactForm.control}
      name='referenceId'
      render={({ field: { onChange, value } }) => {
        const selectedOption = flatOptions.find(opt => opt.value === value);
        const isFormValid = reactForm.formState.isValid;
        const isDirty = reactForm.formState.isDirty;

        return (
          <View className='gap-3'>
            <Pressable
              className='rounded-lg border border-border bg-background p-3 flex-row items-center gap-4'
              onPress={selectHook.openModal}>
              {selectedOption?.tribeName && (
                <ColorRow
                  className='w-24 justify-center px-2 py-1'
                  color={selectedOption.color}>
                  <Text
                    className='text-xs'
                    style={{ color: getContrastingColor(selectedOption.color) }}>
                    {selectedOption.tribeName}
                  </Text>
                </ColorRow>
              )}
              <Text className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedOption ? selectedOption.label : 'Select your prediction'}
              </Text>
            </Pressable>

            <Button
              className='w-full rounded-lg bg-primary p-3'
              disabled={!isFormValid || !isDirty || reactForm.formState.isSubmitting}
              onPress={handleSubmit}>
              <Text className='text-center font-bold text-white'>
                {prediction.predictionMade ? 'Update Prediction' : 'Submit Prediction'}
              </Text>
            </Button>

            {/* Searchable Select Modal */}
            <SearchableSelect
              isVisible={selectHook.isVisible}
              onClose={selectHook.closeModal}
              options={selectHook.filterOptions(
                flatOptions.map(opt => ({
                  value: opt.value,
                  label: opt.label,
                  disabled: false,
                  renderLabel: () => (
                    <View className='flex-row items-center gap-2 rounded p-2'>
                      {opt.tribeName ? (
                        <>
                          <ColorRow
                            className='min-w-20 justify-center px-2 py-1'
                            color={opt.color}>
                            <Text
                              className='text-center text-xs'
                              style={{ color: getContrastingColor(opt.color) }}>
                              {opt.tribeName}
                            </Text>
                          </ColorRow>
                          <Text className='flex-1 text-foreground'>{opt.label}</Text>
                        </>
                      ) : (
                        <ColorRow
                          className='w-full justify-center px-2 py-1'
                          color={opt.color}>
                          <Text
                            className='text-center'
                            style={{ color: getContrastingColor(opt.color) }}>
                            {opt.label}
                          </Text>
                        </ColorRow>
                      )}
                    </View>
                  )
                }))
              )}
              selectedValue={value ?? 0}
              onSelect={selectedValue => {
                onChange(selectedValue);
                selectHook.closeModal();
              }}
              searchText={selectHook.searchText}
              onSearchChange={selectHook.setSearchText}
              placeholder='Search...'
              emptyMessage='No options available.'
            />
          </View>
        );
      }}
    />
  );
}
