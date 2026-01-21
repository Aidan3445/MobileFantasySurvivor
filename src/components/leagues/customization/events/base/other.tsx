import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Button from '~/components/common/button';
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
      <Button
        className={cn(
          'flex-row items-center justify-between rounded-b-lg rounded-t-lg bg-secondary p-3 transition-all',
          !isCollapsed ? 'rounded-b-none duration-75' : 'delay-300'
        )}
        onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text className='text-lg font-bold text-muted'>Other</Text>
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
      </Button>

      <Collapsible collapsed={isCollapsed}>
        <View className='gap-2 rounded-b-lg border border-t-0 border-primary p-3'>
          <EventField
            reactForm={reactForm}
            eventName='elim'
            fieldPath='baseEventRules.elim'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='spokeEpTitle'
            fieldPath='baseEventRules.spokeEpTitle'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='finalists'
            fieldPath='baseEventRules.finalists'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='fireWin'
            fieldPath='baseEventRules.fireWin'
            disabled={disabled}
          />
          <EventField
            reactForm={reactForm}
            eventName='soleSurvivor'
            fieldPath='baseEventRules.soleSurvivor'
            disabled={disabled}
          />
        </View>
      </Collapsible>
    </View>
  );
}
