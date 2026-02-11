import { View, Text, Switch, Pressable } from 'react-native';
import { Bell, BellOff } from 'lucide-react-native';

import { useNotificationSettings } from '~/hooks/user/useNotificationSettings';
import { useNotifications } from '~/hooks/user/useNotifications';
import { colors } from '~/lib/colors';
import { cn } from '~/lib/utils';

export default function NotificationSettings() {
  const { settings, isLoading, updateSetting, toggleEnabled } = useNotificationSettings();
  const { permissionStatus, requestPermissions } = useNotifications();

  if (isLoading) {
    return (
      <View className='w-full rounded-xl border-2 border-primary/20 bg-card p-2'>
        <Text className='text-base text-muted-foreground'>Loading...</Text>
      </View>
    );
  }

  const needsPermission = permissionStatus !== 'granted';

  return (
    <View className='w-full gap-2 rounded-xl border-2 border-primary/20 bg-card p-2'>
      {/* Header */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-6 w-1 rounded-full bg-primary' />
          <Text className='text-xl font-black uppercase tracking-tight text-foreground'>
            Notifications
          </Text>
        </View>
        <Pressable onPress={toggleEnabled}>
          {settings.enabled ? (
            <Bell size={24} color={colors.primary} />
          ) : (
            <BellOff size={24} color={colors.mutedForeground} />
          )}
        </Pressable>
      </View>

      {/* Permission Warning */}
      {needsPermission && (
        <Pressable
          className='rounded-lg border-2 border-destructive/20 bg-destructive/10 px-3 py-2 active:opacity-80'
          onPress={() => void requestPermissions()}>
          <Text className='text-sm font-medium text-destructive'>
            Notifications are disabled. Tap to enable.
          </Text>
        </Pressable>
      )}

      {/* Master Toggle Info */}
      {!settings.enabled && (
        <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2'>
          <Text className='text-sm text-muted-foreground'>
            All notifications are paused. Your preferences below are saved.
          </Text>
        </View>
      )}

      {/* Settings */}
      <View className={cn('gap-2', !settings.enabled && 'opacity-50')}>
        {/* Reminders */}
        <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2 gap-1'>
          <View className='flex-row items-center justify-between'>
            <Text className='font-bold text-foreground'>Reminders</Text>
            <Switch
              value={settings.reminders}
              onValueChange={(value) => updateSetting('reminders', value)}
              disabled={!settings.enabled}
              trackColor={{ false: colors.muted, true: colors.positive }}
              thumbColor='white'
              ios_backgroundColor={colors.destructive} />
          </View>
          <Text className='text-sm text-muted-foreground'>
            Predictions and secondary pick reminders before episodes air.
          </Text>
        </View>

        {/* League Activity */}
        <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2 gap-1'>
          <View className='flex-row items-center justify-between'>
            <Text className='font-bold text-foreground'>League Activity</Text>
            <Switch
              value={settings.leagueActivity}
              onValueChange={(value) => updateSetting('leagueActivity', value)}
              disabled={!settings.enabled}
              trackColor={{ false: colors.muted, true: colors.positive }}
              thumbColor='white'
              ios_backgroundColor={colors.destructive} />
          </View>
          <Text className='text-sm text-muted-foreground'>
            League admission and draft start notifications.
          </Text>
        </View>

        {/* Episode Updates */}
        <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2 gap-1'>
          <View className='flex-row items-center justify-between'>
            <Text className='font-bold text-foreground'>Episode Updates</Text>
            <Switch
              value={settings.episodeUpdates}
              onValueChange={(value) => updateSetting('episodeUpdates', value)}
              disabled={!settings.enabled}
              trackColor={{ false: colors.muted, true: colors.positive }}
              thumbColor='white'
              ios_backgroundColor={colors.destructive} />
          </View>
          <Text className='text-sm text-muted-foreground'>
            Get notified when episodes finish airing.
          </Text>
        </View>

        {/* Live Scoring */}
        <View className='rounded-lg border-2 border-primary/10 bg-primary/5 px-3 py-2 gap-1'>
          <View className='flex-row items-center justify-between'>
            <Text className='font-bold text-foreground'>Live Scoring</Text>
            <Switch
              value={settings.liveScoring}
              onValueChange={(value) => updateSetting('liveScoring', value)}
              disabled={!settings.enabled}
              trackColor={{ false: colors.muted, true: colors.positive }}
              thumbColor='white'
              ios_backgroundColor={colors.destructive} />
          </View>
          <Text className='text-sm text-muted-foreground'>
            Get a prompt when each episode starts to opt into real-time scoring
            notifications. You'll need to opt in each week to avoid spoilers.
          </Text>
        </View>
      </View>
    </View>
  );
}
