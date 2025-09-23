import { Text, View, TextInput } from 'react-native';
import Button from '~/components/common/button';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { type CustomEventRuleInsert } from '~/types/leagues';
import { EventTypes, PredictionTimings, ReferenceTypes } from '~/lib/events';
import SearchableMultiSelect from '~/components/common/searchableMultiSelect';
import SearchableSelect from '~/components/common/searchableSelect';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
import { cn } from '~/lib/utils';
import {
  type EventType,
  type PredictionTiming,
  type ReferenceType,
} from '~/types/events';

interface CustomEventFieldsProps {
  reactForm: UseFormReturn<CustomEventRuleInsert>;
  predictionDefault?: boolean;
}

export default function CustomEventFields({
  reactForm,
  predictionDefault,
}: CustomEventFieldsProps) {
  const [isPrediction, setIsPrediction] = useState(predictionDefault ?? false);
  const typeModal = useSearchableSelect<EventType>();
  const referenceModal = useSearchableSelect<ReferenceType>();
  const timingModal = useSearchableSelect<PredictionTiming>();

  const eventTypeOptions = EventTypes.map(type => ({
    value: type,
    label: type,
  }));
  const referenceTypeOptions = ReferenceTypes.map(type => ({
    value: type,
    label: type,
  }));
  const timingOptions = PredictionTimings.map(timing => ({
    value: timing,
    label: timing,
  }));

  const selectedEventType = reactForm.watch('eventType');
  const selectedReferences = reactForm.watch('referenceTypes') || [];
  const selectedTimings = reactForm.watch('timing') || [];

  return (
    <View className='gap-4'>
      <View>
        <Text className='mb-1 text-sm font-medium'>Event Name</Text>
        <Controller
          control={reactForm.control}
          name='eventName'
          render={({ field }) => (
            <TextInput
              className={cn(
                'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
              )}
              placeholder='Enter the name of the event'
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
      </View>
      <View>
        <Text className='mb-1 text-sm font-medium'>Description</Text>
        <Controller
          control={reactForm.control}
          name='description'
          render={({ field }) => (
            <TextInput
              className={cn(
                'h-20 rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
              )}
              placeholder='Points awarded to...'
              value={field.value}
              onChangeText={field.onChange}
              multiline
              textAlignVertical='top'
            />
          )}
        />
      </View>
      <View>
        <Text className='mb-1 text-sm font-medium'>Reference Type</Text>
        <Button
          className={cn(
            'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
          )}
          onPress={referenceModal.openModal}
        >
          <Text className='text-muted-foreground'>
            {selectedReferences.length > 0
              ? selectedReferences.join(', ')
              : 'Select reference types'}
          </Text>
        </Button>
        <Controller
          control={reactForm.control}
          name='referenceTypes'
          render={({ field }) => (
            <SearchableMultiSelect<ReferenceType>
              isVisible={referenceModal.isVisible}
              onClose={referenceModal.closeModal}
              options={referenceModal.filterOptions(referenceTypeOptions)}
              selectedValues={selectedReferences}
              onToggleSelect={field.onChange}
              searchText={referenceModal.searchText}
              onSearchChange={referenceModal.setSearchText}
              placeholder='Search reference types...'
            />
          )}
        />
      </View>
      <View className='flex-row gap-4'>
        <View className='flex-1'>
          <Text className='mb-1 text-sm font-medium'>Points</Text>
          <Controller
            control={reactForm.control}
            name='points'
            render={({ field }) => (
              <TextInput
                className={cn(
                  'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
                )}
                placeholder='Points'
                value={field.value?.toString() ?? ''}
                onChangeText={text => field.onChange(parseInt(text) || 0)}
                keyboardType='numeric'
              />
            )}
          />
        </View>
        <View className='flex-2'>
          <Text className='mb-1 text-sm font-medium'>Event Type</Text>
          <Button
            className={cn(
              'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
            )}
            onPress={typeModal.openModal}
          >
            <Text className='text-muted-foreground'>
              {selectedEventType || 'Select event type'}
            </Text>
          </Button>
          <SearchableSelect<EventType>
            isVisible={typeModal.isVisible}
            onClose={typeModal.closeModal}
            options={typeModal.filterOptions(eventTypeOptions)}
            selectedValue={selectedEventType}
            onSelect={value => {
              setIsPrediction(value === 'Prediction');
              reactForm.setValue('eventType', value as any);
              reactForm.trigger('timing');
            }}
            searchText={typeModal.searchText}
            onSearchChange={typeModal.setSearchText}
            placeholder='Search event types...'
          />
        </View>
      </View>
      {isPrediction && (
        <View>
          <Text className='mb-1 text-sm font-medium'>Timing</Text>
          <Button
            className={cn(
              'rounded-lg border border-primary bg-muted/50 p-1 text-lg leading-5 placeholder:text-muted-foreground'
            )}
            onPress={timingModal.openModal}
          >
            <Text className='text-muted-foreground'>
              {selectedTimings.length > 0
                ? selectedTimings.join(', ')
                : 'Select prediction timing'}
            </Text>
          </Button>
          <Controller
            control={reactForm.control}
            name='timing'
            render={({ field }) => (
              <SearchableMultiSelect<PredictionTiming>
                isVisible={timingModal.isVisible}
                onClose={timingModal.closeModal}
                options={timingModal.filterOptions(timingOptions)}
                selectedValues={field.value}
                onToggleSelect={field.onChange}
                searchText={timingModal.searchText}
                onSearchChange={timingModal.setSearchText}
                placeholder='Search timing options...'
              />
            )}
          />
        </View>
      )}
    </View>
  );
}
