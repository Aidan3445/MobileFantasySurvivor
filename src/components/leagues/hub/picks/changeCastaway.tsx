import { View, Text, Pressable } from 'react-native';
import { Controller } from 'react-hook-form';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import SearchableSelect from '~/components/common/searchableSelect';
import ColorRow from '~/components/shared/colorRow';
import ShotInTheDark from '~/components/leagues/hub/picks/shotInTheDark';
import { useChangeCastaway } from '~/hooks/leagues/mutation/useChangeCastaway';
import Modal from '~/components/common/modal';

export default function ChangeCastaway() {
  const {
    keyEpisodes,
    secondaryPickSettings,
    availableCastaways,
    pickPriority,
    secondaryCastawayOptions,
    form,
    selected,
    secondarySelected,
    handleSelectionChange,
    handleSubmit,
    handleSecondarySubmit,
    isSubmitting,
    isSubmittingSecondary,
    canSubmitMain,
    canSubmitSecondary,
    isEpisodeAiring,
    dialogOpen,
    closedDialog,
    markDialogClosed,
    uiState,
    hoursRemainingForPriority,
  } = useChangeCastaway();

  // Inactive league
  if (uiState === 'inactive') return null;

  // No castaways available
  if (uiState === 'no-castaways') {
    return (
      <View className='w-full rounded-xl border-2 border-primary/20 bg-card p-4 gap-2 items-center'>
        <Text className='text-xl font-bold uppercase tracking-wider text-muted-foreground'>
          No Castaways Available
        </Text>
        <Text className='text-base text-muted-foreground text-center'>
          All castaways are either selected or eliminated.
        </Text>
      </View>
    );
  }

  // Wait for priority picks
  if (uiState === 'wait-for-priority') {
    return (
      <View className='rounded-xl border-2 border-primary/20 bg-card p-2 gap-2'>
        <View className='flex-row items-center gap-2 px-1'>
          <View className='h-6 w-1 rounded-full bg-primary' />
          <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
            Wait to Swap
          </Text>
        </View>
        <Text className='text-base text-muted-foreground px-1'>
          Recently eliminated members have {hoursRemainingForPriority} hours left to pick first:
        </Text>
        <View className='gap-1 px-1'>
          {pickPriority.map((member) => (
            <ColorRow key={member.memberId} color={member.color}>
              <Text className='text-base text-foreground'>{member.displayName}</Text>
            </ColorRow>
          ))}
        </View>
      </View>
    );
  }

  // Build select options for main pick
  const mainPickOptions = availableCastaways.map((castaway) => {
    const isDisabled = !!(castaway.pickedBy || castaway.eliminatedEpisode);
    return {
      value: castaway.castawayId,
      label: castaway.fullName,
      disabled: isDisabled,
      renderLabel: () => (
        <View
          className='flex-1 flex-row items-center gap-2 rounded-md p-1'
          style={isDisabled ? { backgroundColor: castaway.pickedBy?.color ?? colors.neutral } : undefined}>
          {castaway.tribe && (
            <ColorRow className='w-min' color={castaway.tribe.color}>
              <Text className='text-base font-medium'>
                {castaway.tribe.name}
              </Text>
            </ColorRow>
          )}
          <Text className='text-base'>
            {castaway.fullName}
            {castaway.pickedBy && ` (${castaway.pickedBy.displayName})`}
          </Text>
        </View>
      ),
    };
  });

  const onSubmitMain = () => {
    void handleSubmit();
  };

  const onSubmitSecondary = () => {
    void handleSecondarySubmit();
  };

  return (
    <>
      <View className='rounded-xl border-2 border-primary/20 bg-card p-2 gap-4'>
        {/* Main Survivor Section */}
        <View className='gap-2'>
          <View className='flex-row items-center gap-2 px-1'>
            <View className='h-6 w-1 rounded-full bg-primary' />
            <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
              Swap your Survivor Pick
            </Text>
          </View>

          <View className='gap-2'>
            <Controller
              control={form.control}
              name='castawayId'
              render={() => (
                <SearchableSelect
                  options={mainPickOptions}
                  selectedValue={selected ? parseInt(selected) : undefined}
                  onSelect={(value) => handleSelectionChange('survivor', String(value))}
                  placeholder='Select new survivor' />
              )} />
            <Pressable
              onPress={onSubmitMain}
              disabled={!canSubmitMain}
              className={cn(
                'rounded-lg bg-primary p-3 active:opacity-80',
                !canSubmitMain && 'opacity-50'
              )}>
              <Text className='text-center text-base font-bold uppercase tracking-wider text-white'>
                {isEpisodeAiring ? 'Episode Airing' : isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Secondary Pick Section */}
        {secondaryPickSettings?.enabled && keyEpisodes?.nextEpisode && (
          <View className='gap-2'>
            <View className='flex-row items-center gap-2 px-1'>
              <View className='h-6 w-1 rounded-full bg-primary' />
              <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
                Secondary Pick
              </Text>
            </View>

            <View className='gap-2'>
              <SearchableSelect
                key={secondarySelected || 'no-selection'}
                options={secondaryCastawayOptions}
                selectedValue={secondarySelected ? parseInt(secondarySelected) : undefined}
                onSelect={(value) => handleSelectionChange('secondary', String(value))}
                placeholder='Select secondary pick' />
              <Pressable
                onPress={onSubmitSecondary}
                disabled={!canSubmitSecondary}
                className={cn(
                  'rounded-lg bg-primary p-3 active:opacity-80',
                  !canSubmitSecondary && 'opacity-50'
                )}>
                <Text className='text-center text-base font-bold uppercase tracking-wider text-white'>
                  {isEpisodeAiring ? 'Episode Airing' : isSubmittingSecondary ? 'Submitting...' : 'Submit'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <ShotInTheDark />
      </View>

      {/* Elimination Dialog */}
      <Modal visible={dialogOpen && !closedDialog} onClose={markDialogClosed}>
        <View className='gap-4'>
          <Text className='text-xl font-black uppercase tracking-tight text-foreground text-center'>
            Oh no!
          </Text>
          <Text className='text-base text-muted-foreground'>
            Your survivor was eliminated, but you get another chance.
            {'\n\n'}
            Choose from the remaining castaways to continue earning points.
            {'\n\n'}
            You're still in it, good luck!
          </Text>
          <Pressable
            onPress={markDialogClosed}
            className='rounded-lg bg-primary p-3 active:opacity-80'>
            <Text className='text-center text-base font-bold uppercase tracking-wider text-primary-foreground'>
              Got it!
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}
