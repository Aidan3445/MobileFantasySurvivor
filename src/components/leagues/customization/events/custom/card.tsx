import { Flame, Settings2, Trash2 } from 'lucide-react-native';
import { Text, View, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import {
  type CustomEventRule,
  type CustomEventRuleInsert,
  CustomEventRuleInsertZod
} from '~/types/leagues';
import CustomEventModal from '~/components/leagues/customization/events/custom/modal';

interface CustomEventCardProps {
  rule: CustomEventRule;
  locked?: boolean;
  onUpdate: (_: CustomEventRuleInsert, __: number) => Promise<void>;
  onDelete: (_: number, __: string) => Promise<void>;
  leagueMembers: any;
}

export default function CustomEventCard({
  rule,
  locked,
  onUpdate,
  onDelete,
  leagueMembers
}: CustomEventCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const reactForm = useForm<CustomEventRuleInsert>({
    defaultValues: rule,
    resolver: zodResolver(CustomEventRuleInsertZod)
  });

  const handleSubmit = async () => {
    const data = reactForm.getValues();
    await onUpdate(data, rule.customEventRuleId);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Event', `Are you sure you want to delete "${rule.eventName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => void onDelete(rule.customEventRuleId, rule.eventName)
      }
    ]);
  };

  const canEdit = leagueMembers?.loggedIn?.role === 'Owner' && !locked;

  return (
    <View className='relative rounded-xl bg-accent p-3'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-1 flex-row items-center gap-1'>
          <Text className='text-card-foreground flex-shrink text-lg font-semibold'>
            {rule.eventName}
          </Text>
          <Text className='text-card-foreground'>-</Text>
          <View className='flex-row items-center'>
            <Text
              className={cn(
                'text-md font-medium',
                rule.points <= 0 ? 'text-destructive' : 'text-positive'
              )}>
              {rule.points}
            </Text>
            <Flame size={16} color={rule.points <= 0 ? colors.destructive : colors.positive} />
          </View>
        </View>
        {canEdit && (
          <View className='flex-row gap-2'>
            <Pressable onPress={() => setIsEditing(true)}>
              <Settings2 size={18} color={colors.primary} />
            </Pressable>
            <Pressable onPress={handleDelete}>
              <Trash2 size={18} color={colors.destructive} />
            </Pressable>
          </View>
        )}
      </View>
      {rule.eventType === 'Prediction' && (
        <Text className='text-xs italic text-muted-foreground'>
          Predictions: {rule.timing.join(', ')}
        </Text>
      )}
      <Text className='text-sm text-muted-foreground line-clamp-2'>{rule.description}</Text>
      <CustomEventModal
        type='Edit'
        isVisible={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSubmit}
        reactForm={reactForm} />
    </View>
  );
}
