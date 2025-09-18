import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import Collapsible from 'react-native-collapsible';
import { type UseFormReturn } from 'react-hook-form';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';
import EventField from '~/components/leagues/customization/events/base/eventField';

interface OtherScoreSettingsProps {
  disabled?: boolean;
  reactForm: UseFormReturn<any>;
}

export default function OtherScoreSettings({ disabled, reactForm }: OtherScoreSettingsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View>
      <Pressable
        className={cn('flex-row items-center justify-between p-3 bg-secondary rounded-t-lg transition-all rounded-b-lg',
          !isCollapsed ? 'rounded-b-none duration-75' : 'delay-300')}
        onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text className='text-lg font-bold text-muted'>Other</Text>
        {isCollapsed ? (
          <ChevronDown size={24} color={colors.muted} />
        ) : (
          <ChevronUp size={24} color={colors.muted} />
        )}
      </Pressable>

      <Collapsible collapsed={isCollapsed}>
        <View className='p-3 border-primary border border-t-0 rounded-b-lg gap-2'>
          <EventField reactForm={reactForm} eventName='elim' fieldPath='baseEventRules.elim' disabled={disabled} />
          <EventField reactForm={reactForm} eventName='spokeEpTitle' fieldPath='baseEventRules.spokeEpTitle' disabled={disabled} />
          <EventField reactForm={reactForm} eventName='finalists' fieldPath='baseEventRules.finalists' disabled={disabled} />
          <EventField reactForm={reactForm} eventName='fireWin' fieldPath='baseEventRules.fireWin' disabled={disabled} />
          <EventField reactForm={reactForm} eventName='soleSurvivor' fieldPath='baseEventRules.soleSurvivor' disabled={disabled} />
        </View>
      </Collapsible>
    </View>
  );
}
