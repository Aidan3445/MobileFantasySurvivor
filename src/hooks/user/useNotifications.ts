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
  const hasRegistered = useRef(false);

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

  // Check and register on mount (if permission already granted)
  useEffect(() => {
    if (hasRegistered.current) return;

    void (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') return;

      const currentToken = await getExpoPushToken();
      if (!currentToken) return;

      const cachedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      // Only register if token is new or changed
      if (currentToken !== cachedToken) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, currentToken);
        await registerTokenWithServer(currentToken);
      }

      setExpoPushToken(currentToken);
      hasRegistered.current = true;
    })();
  }, [registerTokenWithServer]);

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

    // Get and register push token
    const token = await getExpoPushToken();
    if (token) {
      setExpoPushToken(token);
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      await registerTokenWithServer(token);
    }

    return true;
  }, [registerTokenWithServer]);

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
    [permissionStatus, requestPermissions],
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
