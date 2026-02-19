import { useEffect, useState } from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, BellOff, Radio, ChevronRight, Zap } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '~/components/common/button';
import { colors } from '~/lib/colors';
import { cn } from '~/lib/utils';
import { useLivePredictions } from '~/hooks/livePredictions/query/useLivePredictions';
import { useLiveScoringSession } from '~/hooks/user/useLiveScoringSession';
import { useNotificationSettings } from '~/hooks/user/useNotificationSettings';
import LivePredictionsHeader from '~/components/livePredictions/play/header/view';

const DISMISSED_KEY = 'live_opt_in_dismissed_ep';

export default function LivePredictionsScreen() {
  const router = useRouter();
  const { airingEpisode, data: predictions } = useLivePredictions();
  const { isOptedIn, optIn, isOptingIn } = useLiveScoringSession(airingEpisode?.episodeId);
  const { settings } = useNotificationSettings();

  const [pushPermission, setPushPermission] = useState<Notifications.PermissionStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const episodeId = airingEpisode?.episodeId;
  const dismissKey = `${DISMISSED_KEY}_${episodeId}`;

  // Check push permission and dismissed state on mount
  useEffect(() => {
    void (async () => {
      const status = await Notifications.getPermissionsAsync();
      setPushPermission(status.status);

      if (episodeId) {
        const wasDismissed = await AsyncStorage.getItem(dismissKey);
        setDismissed(wasDismissed === 'true');
      }
      setLoaded(true);
    })();
  }, [episodeId, dismissKey]);

  const handleDismiss = () => {
    setDismissed(true);
    if (episodeId) {
      void AsyncStorage.setItem(dismissKey, 'true');
    }
  };

  const handleOptIn = () => {
    optIn();
    handleDismiss();
  };

  if (!loaded) return null;

  const notificationsDisabled = pushPermission !== 'granted' || !settings.enabled;
  const liveSettingOff = !settings.liveScoring;
  const showBanner = !isOptedIn && !dismissed && !!episodeId;

  return (
    <SafeAreaView className='flex-1 bg-background py-16'>
      <LivePredictionsHeader episodeId={episodeId} />

      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='flex-1 px-4 gap-4 pt-4'>
          <Button onPress={() => AsyncStorage.clear()}>
            <Text>Clear AsyncStorage (for testing)</Text>
          </Button>



          {/* No episode airing */}
          {!airingEpisode && (
            <View className='flex-1 justify-center items-center gap-4'>
              <Radio size={48} color={colors.mutedForeground} />
              <Text className='text-lg font-bold text-muted-foreground text-center'>
                No episode is currently airing
              </Text>
              <Text className='text-base text-muted-foreground text-center max-w-xs'>
                Live predictions will appear here when an episode is live.
              </Text>
            </View>
          )}

          {/* Episode airing — show banners + content */}
          {!!airingEpisode && (
            <>
              {/* Notifications disabled entirely */}
              {showBanner && notificationsDisabled && (
                <Pressable
                  onPress={() => router.dismissTo('/profile')}
                  className='rounded-xl border-2 border-destructive/20 bg-card p-4 flex-row items-center gap-3 active:opacity-80'>
                  <BellOff size={20} color={colors.destructive} />
                  <View className='flex-1 gap-0.5'>
                    <Text className='text-base font-bold text-destructive'>
                      Notifications are off
                    </Text>
                    <Text className='text-sm text-muted-foreground'>
                      You can still play along, but enable notifications in your profile to get live alerts.
                    </Text>
                  </View>
                  <ChevronRight size={16} color={colors.destructive} />
                </Pressable>
              )}

              {/* Notifications on, not opted in for episode */}
              {showBanner && !notificationsDisabled && (
                <View className='rounded-xl border-2 border-primary/20 bg-card p-4 gap-3'>
                  <View className='flex-row items-center gap-2'>
                    <Zap size={20} color={colors.primary} />
                    <Text className='text-base font-bold text-foreground'>
                      Watching live tonight?
                    </Text>
                  </View>
                  <Text className='text-sm text-muted-foreground'>
                    Opt in to get push notifications for live predictions during this episode.
                  </Text>

                  {/* Extra hint if general live scoring setting is off */}
                  {liveSettingOff && (
                    <Text className='text-sm text-muted-foreground'>
                      Want to be prompted automatically each week? Toggle{' '}
                      <Text className='font-bold text-primary'>Live Scoring</Text> in your
                      notification settings.
                    </Text>
                  )}

                  <View className='flex-row gap-2'>
                    <Button
                      onPress={handleDismiss}
                      className='flex-1 rounded-lg border-2 border-primary/20 bg-card p-3 active:opacity-80'>
                      <Text className='text-center font-semibold text-foreground'>
                        Not Tonight
                      </Text>
                    </Button>
                    <Button
                      onPress={handleOptIn}
                      disabled={isOptingIn}
                      className={cn(
                        'flex-1 rounded-lg bg-primary p-3 active:opacity-80',
                        isOptingIn && 'opacity-50'
                      )}>
                      <Text className='text-center font-semibold text-primary-foreground'>
                        {isOptingIn ? 'Opting in...' : 'Go Live'}
                      </Text>
                    </Button>
                  </View>
                </View>
              )}

              {/* Opted in confirmation */}
              {isOptedIn && (
                <View className='rounded-xl border-2 border-positive/20 bg-card p-3 flex-row items-center gap-2'>
                  <Bell size={16} color={colors.positive} />
                  <Text className='text-sm font-semibold text-positive'>
                    You're live — predictions will appear as they drop
                  </Text>
                </View>
              )}

              {/* Live predictions content goes here */}
              {/* TODO: prediction cards, response UI, results */}
              <View className='flex-1 justify-center items-center'>
                <Text className='text-muted-foreground'>
                  {predictions && predictions.length > 0
                    ? `${predictions.length} prediction${predictions.length === 1 ? '' : 's'} this episode`
                    : 'No predictions yet — stay tuned!'}
                </Text>
              </View>
            </>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
