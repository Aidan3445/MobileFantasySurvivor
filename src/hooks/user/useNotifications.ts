import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFetch } from '~/hooks/helpers/useFetch';

const TOKEN_STORAGE_KEY = 'expo_push_token';

// Configure how notifications appear when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const registeringRef = useRef<Promise<void> | null>(null);

  const postData = useFetch('POST');
  const deleteData = useFetch('DELETE');

  const registerTokenWithServer = useCallback(
    async (token: string) => {
      try {
        const settingsStr = await AsyncStorage.getItem('notification_settings');
        const settings = settingsStr ? JSON.parse(settingsStr) : null;

        await postData('/api/notifications', {
          body: {
            token,
            platform: Platform.OS as 'ios' | 'android',
            preferences: settings
              ? {
                reminders: settings.reminders,
                leagueActivity: settings.leagueActivity,
                episodeUpdates: settings.episodeUpdates,
                liveScoring: settings.liveScoring,
              }
              : undefined,
          },
        });
      } catch (error) {
        console.error('Failed to register token with server:', error);
      }
    },
    [postData],
  );

  const ensureTokenRegistered = useCallback(async () => {
    if (registeringRef.current) {
      return registeringRef.current;
    }

    registeringRef.current = (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      if (status !== 'granted') return;

      const token = await getExpoPushToken();
      if (!token) return;

      const cachedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (cachedToken === token) {
        setExpoPushToken(token);
        return;
      }

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      await registerTokenWithServer(token);
      setExpoPushToken(token);
    })();

    try {
      await registeringRef.current;
    } finally {
      registeringRef.current = null;
    }
  }, [registerTokenWithServer]);

  // Check and register on mount (if permission already granted)
  useEffect(() => {
    void ensureTokenRegistered();
  }, [ensureTokenRegistered]);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Push notifications require a physical device');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissionStatus(finalStatus);

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications in your device settings to receive updates about your leagues.',
      );
      return false;
    }

    await ensureTokenRegistered();
    return true;
  }, [ensureTokenRegistered]);

  const unregisterToken = useCallback(async () => {
    if (!expoPushToken) return;

    try {
      await deleteData('/api/notifications', { body: { token: expoPushToken } });
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setExpoPushToken(null);
    } catch (error) {
      console.error('Failed to unregister token:', error);
    }
  }, [expoPushToken, deleteData]);

  const scheduleLocalNotification = useCallback(
    async (title: string, body: string, delaySeconds: number = 0) => {
      if (permissionStatus !== 'granted') {
        const granted = await requestPermissions();
        if (!granted) return;
      }

      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(delaySeconds, 0.1),
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissionStatus],
  );

  return {
    expoPushToken,
    permissionStatus,
    requestPermissions,
    unregisterToken,
    scheduleLocalNotification,
  };
}

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.warn('No projectId found in app config');
      return null;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E5BC8F',
      });
    }

    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}
