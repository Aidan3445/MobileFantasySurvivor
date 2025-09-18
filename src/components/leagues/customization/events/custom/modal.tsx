import { View, Text, Pressable } from 'react-native';
import { type UseFormReturn } from 'react-hook-form';
import { type CustomEventRuleInsert } from '~/types/leagues';
import CustomEventFields from '~/components/leagues/customization/events/custom/fields';
import Modal from '~/components/common/modal';

interface CustomEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  reactForm: UseFormReturn<CustomEventRuleInsert>;
  type: 'Create' | 'Edit';
}

export default function CustomEventModal({
  isVisible,
  onClose,
  onSubmit,
  reactForm,
  type
}: CustomEventModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}>
      <Text className='text-xl font-bold mb-4'>{type} a Custom Event</Text>
      <CustomEventFields
        reactForm={reactForm}
        predictionDefault={reactForm.watch('eventType') === 'Prediction'} />
      <View className='flex-row gap-2 mt-4'>
        <Pressable
          className='flex-1 bg-destructive rounded-lg p-3 active:opacity-70'
          onPress={onClose}>
          <Text className='text-muted font-medium text-center'>Cancel</Text>
        </Pressable>
        <Pressable
          className='flex-1 bg-primary rounded-lg p-3 disabled:opacity-50 active:opacity-70'
          disabled={!reactForm.formState.isValid}
          onPress={onSubmit}>
          <Text className='text-white font-medium text-center'>{type} Event</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
