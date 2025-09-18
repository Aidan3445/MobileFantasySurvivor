import { Text, View, TextInput, Pressable } from 'react-native';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { type CustomEventRuleInsert } from '~/types/leagues';
import { EventTypes, PredictionTimings, ReferenceTypes } from '~/lib/events';
import SearchableMultiSelect from '~/components/common/searchableMultiSelect';
import SearchableSelect from '~/components/common/searchableSelect';
import { useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
import { cn } from '~/lib/utils';

interface CustomEventFieldsProps {
  reactForm: UseFormReturn<CustomEventRuleInsert>;
  predictionDefault?: boolean;
}

export default function CustomEventFields({ reactForm, predictionDefault }: CustomEventFieldsProps) {
  const [isPrediction, setIsPrediction] = useState(predictionDefault ?? false);
  const typeModal = useSearchableSelect();
  const referenceModal = useSearchableSelect();
  const timingModal = useSearchableSelect();

  const eventTypeOptions = EventTypes.map(type => ({ value: type, label: type }));
  const referenceTypeOptions = ReferenceTypes.map(type => ({ value: type, label: type }));
  const timingOptions = PredictionTimings.map(timing => ({ value: timing, label: timing }));

  const selectedEventType = reactForm.watch('eventType');
  const selectedReferences = reactForm.watch('referenceTypes') || [];
  const selectedTimings = reactForm.watch('timing') || [];

  return (
    <View className='gap-4'>
      <View>
        <Text className='text-sm font-medium mb-1'>Event Name</Text>
        <Controller
          control={reactForm.control}
          name='eventName'
          render={({ field }) => (
            <TextInput
              className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
              placeholder='Enter the name of the event'
              value={field.value}
              onChangeText={field.onChange} />
          )} />
      </View>
      <View>
        <Text className='text-sm font-medium mb-1'>Description</Text>
        <Controller
          control={reactForm.control}
          name='description'
          render={({ field }) => (
            <TextInput
              className={cn('border border-primary h-20 rounded-lg p-1 bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
              placeholder='Points awarded to...'
              value={field.value}
              onChangeText={field.onChange}
              multiline
              textAlignVertical='top' />
          )} />
      </View>
      <View>
        <Text className='text-sm font-medium mb-1'>Reference Type</Text>
        <Pressable
          className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
          onPress={referenceModal.openModal}>
          <Text className='text-muted-foreground'>
            {selectedReferences.length > 0
              ? selectedReferences.join(', ')
              : 'Select reference types'}
          </Text>
        </Pressable>
        <Controller
          control={reactForm.control}
          name='referenceTypes'
          render={({ field }) => (
            <SearchableMultiSelect
              isVisible={referenceModal.isVisible}
              onClose={referenceModal.closeModal}
              options={referenceModal.filterOptions(referenceTypeOptions)}
              selectedValues={selectedReferences}
              onToggleSelect={field.onChange}
              searchText={referenceModal.searchText}
              onSearchChange={referenceModal.setSearchText}
              placeholder='Search reference types...' />
          )} />
      </View>
      <View className='flex-row gap-4'>
        <View className='flex-1'>
          <Text className='text-sm font-medium mb-1'>Points</Text>
          <Controller
            control={reactForm.control}
            name='points'
            render={({ field }) => (
              <TextInput
                className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
                placeholder='Points'
                value={field.value?.toString() ?? ''}
                onChangeText={(text) => field.onChange(parseInt(text) || 0)}
                keyboardType='numeric' />
            )} />
        </View>
        <View className='flex-2'>
          <Text className='text-sm font-medium mb-1'>Event Type</Text>
          <Pressable
            className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
            onPress={typeModal.openModal}>
            <Text className='text-muted-foreground'>
              {selectedEventType || 'Select event type'}
            </Text>
          </Pressable>
          <SearchableSelect
            isVisible={typeModal.isVisible}
            onClose={typeModal.closeModal}
            options={typeModal.filterOptions(eventTypeOptions)}
            selectedValue={selectedEventType}
            onSelect={(value) => {
              setIsPrediction(value === 'Prediction');
              reactForm.setValue('eventType', value as any);
              reactForm.trigger('timing');
            }}
            searchText={typeModal.searchText}
            onSearchChange={typeModal.setSearchText}
            placeholder='Search event types...' />
        </View>
      </View>
      {isPrediction && (
        <View>
          <Text className='text-sm font-medium mb-1'>Timing</Text>
          <Pressable
            className={cn('border border-primary rounded-lg p-1  bg-muted/50 text-lg leading-5 placeholder:text-muted-foreground')}
            onPress={timingModal.openModal}>
            <Text className='text-muted-foreground'>
              {selectedTimings.length > 0
                ? selectedTimings.join(', ')
                : 'Select prediction timing'}
            </Text>
          </Pressable>
          <Controller
            control={reactForm.control}
            name='timing'
            render={({ field }) => (
              <SearchableMultiSelect
                isVisible={timingModal.isVisible}
                onClose={timingModal.closeModal}
                options={timingModal.filterOptions(timingOptions)}
                selectedValues={field.value}
                onToggleSelect={field.onChange}
                searchText={timingModal.searchText}
                onSearchChange={timingModal.setSearchText}
                placeholder='Search timing options...'
              />
            )} />
        </View>
      )}
    </View>
  );
}
