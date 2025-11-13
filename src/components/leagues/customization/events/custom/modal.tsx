import { View, Text } from 'react-native';
import Button from '~/components/common/button';
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
      <Text className='mb-4 text-xl font-bold'>{type} a Custom Event</Text>
      <CustomEventFields
        reactForm={reactForm}
        predictionDefault={reactForm.watch('eventType') === 'Prediction'}
      />
      <View className='mt-4 flex-row gap-2'>
        <Button
          className='flex-1 rounded-lg bg-destructive p-3'
          onPress={onClose}>
          <Text className='text-center font-medium text-muted'>Cancel</Text>
        </Button>
        <Button
          className='flex-1 rounded-lg bg-primary p-3'
          disabled={!reactForm.formState.isValid}
          onPress={onSubmit}>
          <Text className='text-center font-medium text-white'>{type} Event</Text>
        </Button>
      </View>
    </Modal>
  );
}
