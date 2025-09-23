'use client';

import { Controller } from 'react-hook-form';
import { View, Text, TextInput } from 'react-native';
import { LEAGUE_NAME_MAX_LENGTH } from '~/lib/leagues';
import Button from '~/components/common/button';
import SearchableMultiSelect from '~/components/common/searchableMultiSelect';
import { useLeagueSettings } from '~/hooks/leagues/mutation/useLeagueSettings';

export function LeagueSettings() {
  const {
    reactForm,
    handleSubmit,
    resetForm,
    editable,
    membersList,
    selectedAdmins,
    selectedAdminNames,
    adminsModal
  } = useLeagueSettings();

  if (!editable) return null;

  return (
    <View className='w-max rounded-xl bg-card p-2'>
      <Text className='mb-4 text-center text-lg font-bold text-card-foreground'>
        Edit League Details
      </Text>

      <View className='mb-4'>
        <Text className='mb-2 text-lg text-card-foreground'>League Name</Text>
        <Controller
          control={reactForm.control}
          name='name'
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View>
              <TextInput
                className='w-full rounded-lg border border-primary leading-5 p-3 text-lg placeholder:text-muted-foreground'
                placeholder='League Name'
                autoCapitalize='words'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={LEAGUE_NAME_MAX_LENGTH}
              />
              <Text className='mt-1 text-right text-sm text-muted-foreground'>
                {value?.length || 0}/{LEAGUE_NAME_MAX_LENGTH}
              </Text>
              {error && (
                <Text className='mt-1 text-sm text-destructive'>{error.message}</Text>
              )}
            </View>
          )}
        />
      </View>

      <View className='mb-6'>
        <Text className='mb-2 text-lg text-card-foreground'>League Admins</Text>
        <Button
          className='w-full rounded-lg border border-primary p-3'
          onPress={adminsModal.openModal}
        >
          <Text className='text-left text-lg text-card-foreground'>
            {selectedAdminNames || 'Select admins...'}
          </Text>
        </Button>
      </View>

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

      <Controller
        control={reactForm.control}
        name='admins'
        render={({ field }) => (
          <SearchableMultiSelect<number>
            isVisible={adminsModal.isVisible}
            onClose={adminsModal.closeModal}
            options={adminsModal.filterOptions(membersList)}
            selectedValues={selectedAdmins}
            onToggleSelect={field.onChange}
            searchText={adminsModal.searchText}
            onSearchChange={adminsModal.setSearchText}
            placeholder='Search members...'
            emptyMessage='No members found.'
          />
        )}
      />
    </View>
  );
}
