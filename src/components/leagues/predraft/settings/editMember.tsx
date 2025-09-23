'use client';

import { useEditMember } from '~/hooks/leagues/mutation/useEditMember';
import LeagueMember from '~/components/leagues/actions/create/leagueMember';
import { Text, View } from 'react-native';
import Button from '~/components/common/button';

export default function EditMember() {
  const { reactForm, usedColors, currentColor, handleSubmit, resetForm } =
    useEditMember();

  if (!reactForm.control) {
    return null;
  }

  return (
    <View className='h-[22rem] w-full rounded-xl bg-card p-2'>
      <LeagueMember
        control={reactForm.control}
        usedColors={usedColors}
        currentColor={currentColor}
      />
      <View className='flex-row gap-2'>
        <Button
          className={'flex-1 rounded-lg bg-destructive p-3'}
          onPress={resetForm}
        >
          <Text className='text-center font-semibold text-white'>Cancel</Text>
        </Button>
        <Button
          className={'flex-1 rounded-lg bg-primary p-3'}
          disabled={!reactForm.formState.isDirty}
          onPress={() => handleSubmit()}
        >
          <Text className='text-center font-semibold text-white'>Save</Text>
        </Button>
      </View>
    </View>
  );
}
