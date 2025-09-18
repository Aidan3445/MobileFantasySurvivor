'use client';
import { View, Text, Pressable } from 'react-native';
import { getContrastingColor } from '@uiw/color-convert';
import { cn } from '~/lib/utils';
import { GripVertical, Lock, LockOpen } from 'lucide-react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { type MemberWithId, useUpdateDraftOrder } from '~/hooks/leagues/mutation/useUpdateDraftOrder';
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
    handleSubmit
  } = useUpdateDraftOrder();

  const renderItem = ({ item, getIndex, drag, isActive }: RenderItemParams<MemberWithId>) => (
    <Pressable
      onLongPress={orderLocked ? undefined : drag}
      disabled={isActive}
      className={cn('mb-2', isActive && 'opacity-50')} >
      <View
        className='flex-row items-center p-4 rounded-lg'
        style={{ backgroundColor: item.color }} >
        <Text
          className='text-lg font-bold w-8'
          style={{ color: getContrastingColor(item.color) }} >
          {(getIndex() ?? 0) + 1}
        </Text>
        <Text
          className='text-xl font-semibold flex-1 ml-4'
          style={{ color: getContrastingColor(item.color) }} >
          {item.displayName}
        </Text>
        {!orderLocked && (<GripVertical size={24} color={getContrastingColor(item.color)} />)}
      </View>
    </Pressable>
  );

  return (
    <View className={cn('w-full p-2 bg-card rounded-xl', className)}>
      <View className='flex-row items-center justify-between mb-4'>
        <View className='flex-row items-center gap-6'>
          <Text className='text-lg font-bold text-card-foreground'>Draft Order</Text>
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
              }}>
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
        <View className='flex-row gap-2 mb-4'>
          <Pressable
            className={'flex-1 bg-primary rounded-lg p-3'}
            onPress={() => {
              resetOrder();
            }}>
            <Text className='text-white font-semibold text-center'>Cancel</Text>
          </Pressable>
          <Pressable
            className={'flex-1 bg-primary rounded-lg p-3 disabled:opacity-50'}
            disabled={!orderChanged}
            onPress={handleSubmit} >
            <Text className='text-white font-semibold text-center'>Save</Text>
          </Pressable>
        </View>
      )}
      <DraggableFlatList
        data={order}
        onDragEnd={({ data }) => !orderLocked && setOrder(data)}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        scrollEnabled={false}
        activationDistance={orderLocked ? 999999 : 10}
      />
    </View>
  );
}
