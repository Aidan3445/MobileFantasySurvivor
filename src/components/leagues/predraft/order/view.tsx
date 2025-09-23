'use client';
import { View, Text, Pressable } from 'react-native';
import Button from '~/components/common/button';
import { getContrastingColor } from '@uiw/color-convert';
import { cn } from '~/lib/utils';
import { GripVertical, Lock, LockOpen } from 'lucide-react-native';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  type MemberWithId,
  useUpdateDraftOrder,
} from '~/hooks/leagues/mutation/useUpdateDraftOrder';
import { colors } from '~/lib/colors';

interface DraftOrderProps {
  className?: string;
}

export default function DraftOrder({ className }: DraftOrderProps) {
  const {
    orderLocked,
    setLocked,
    order,
    setOrder,
    resetOrder,
    orderChanged,
    leagueMembers,
    handleSubmit,
  } = useUpdateDraftOrder();

  const renderItem = ({
    item,
    getIndex,
    drag,
    isActive,
  }: RenderItemParams<MemberWithId>) => (
    <Pressable
      onLongPress={orderLocked ? undefined : drag}
      disabled={isActive}
      className={cn('mb-2', isActive && 'opacity-50')}
    >
      <View
        className='flex-row items-center rounded-lg p-4'
        style={{ backgroundColor: item.color }}
      >
        <Text
          className='w-8 text-lg font-bold'
          style={{ color: getContrastingColor(item.color) }}
        >
          {(getIndex() ?? 0) + 1}
        </Text>
        <Text
          className='ml-4 flex-1 text-xl font-semibold'
          style={{ color: getContrastingColor(item.color) }}
        >
          {item.displayName}
        </Text>
        {!orderLocked && (
          <GripVertical size={24} color={getContrastingColor(item.color)} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View className={cn('w-full rounded-xl bg-card p-2', className)}>
      <View className='mb-4 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-6'>
          <Text className='text-card-foreground text-lg font-bold'>
            Draft Order
          </Text>
          {!orderLocked && (
            <Text className='text-sm text-muted-foreground'>
              Tap and hold to drag and reorder
            </Text>
          )}
        </View>
        <View className='flex-row items-center gap-2'>
          {leagueMembers?.loggedIn?.role === 'Owner' && (
            <Pressable
              onPress={() => {
                if (orderLocked) {
                  setLocked(false);
                } else {
                  resetOrder();
                  setLocked(true);
                }
              }}
            >
              {orderLocked ? (
                <Lock size={24} color={colors.primary} />
              ) : (
                <LockOpen size={24} color={colors.secondary} />
              )}
            </Pressable>
          )}
        </View>
      </View>
      {!orderLocked && (
        <View className='mb-4 flex-row gap-2'>
          <Button
            className={'flex-1 rounded-lg bg-destructive p-3'}
            onPress={() => {
              resetOrder();
            }}
          >
            <Text className='text-center font-semibold text-white'>Cancel</Text>
          </Button>
          <Button
            className={'flex-1 rounded-lg bg-primary p-3'}
            disabled={!orderChanged}
            onPress={handleSubmit}
          >
            <Text className='text-center font-semibold text-white'>Save</Text>
          </Button>
        </View>
      )}
      <DraggableFlatList
        data={order}
        onDragEnd={({ data }) => !orderLocked && setOrder(data)}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        scrollEnabled={false}
        activationDistance={orderLocked ? 999999 : 10}
      />
    </View>
  );
}
