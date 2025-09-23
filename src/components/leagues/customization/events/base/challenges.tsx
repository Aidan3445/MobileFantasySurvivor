import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import Collapsible from 'react-native-collapsible';
import { type UseFormReturn } from 'react-hook-form';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import EventField from '~/components/leagues/customization/events/base/eventField';

interface ChallengeScoreSettingsProps {
  disabled?: boolean;
  reactForm: UseFormReturn<any>;
}

export default function ChallengeScoreSettings({
  disabled,
  reactForm
}: ChallengeScoreSettingsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View>
      <Pressable
        className={cn(
          'flex-row items-center justify-between rounded-b-lg rounded-t-lg bg-secondary p-3 transition-all',
          !isCollapsed ? 'rounded-b-none duration-75' : 'delay-300'
        )}
        onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text className='text-lg font-bold text-muted'>Challenges</Text>
        {isCollapsed ? (
          <ChevronDown
            size={24}
            color={colors.muted}
          />
        ) : (
          <ChevronUp
            size={24}
            color={colors.muted}
          />
        )}
      </Pressable>
      <Collapsible collapsed={isCollapsed}>
        <View className='gap-2 rounded-b-lg border border-t-0 border-primary p-3'>
          <EventField
            reactForm={reactForm}
            eventName='indivWin'
            fieldPath='baseEventRules.indivWin'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='indivReward'
            fieldPath='baseEventRules.indivReward'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='tribe1st'
            fieldPath='baseEventRules.tribe1st'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='tribe2nd'
            fieldPath='baseEventRules.tribe2nd'
            disabled={disabled}
          />
        </View>
      </Collapsible>
    </View>
  );
}
