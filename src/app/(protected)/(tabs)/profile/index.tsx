import { Linking, ScrollView, View, Text, Image, Alert } from 'react-native';
import { Bug, Heart, ExternalLink } from 'lucide-react-native';
import SignOutButton from '~/components/auth/signOutButton';
import AccountSettings from '~/components/profile/management/view';
import NotificationSettings from '~/components/profile/notifications';
import { colors } from '~/lib/colors';
import Button from '~/components/common/button';
import * as WebBrowser from 'expo-web-browser';

const BUY_ME_A_COFFEE_URL = 'https://www.buymeacoffee.com/aidanweinberg';
const ISSUE_REPORT_URL = 'mailto:yourfantasysurvivor@gmail.com?subject=Bug%20Report%20%2F%20Feature%20Request';

export default function ProfileScreen() {
  const openIssueReport = async () => {
    const url = ISSUE_REPORT_URL;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'No Mail App',
        'Send bug reports or feature requests to yourfantasysurvivor@gmail.com'
      );
    }
  };

  return (
    <View className='flex-1 bg-background relative'>
      <ScrollView
        className='w-full'
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 10 }}>
        <View className='page justify-start gap-y-4 px-1.5 pt-8 pb-1.5'>
          <AccountSettings locked />
          <NotificationSettings />

          {/* Report Issue / Request Feature */}
          <Button
            className='flex-row items-center gap-3 rounded-xl bg-card p-4 active:opacity-70 border-2 border-primary/20'
            onPress={openIssueReport}>
            <Bug size={22} color={colors.primary} />
            <Text className='text-primary text-base font-medium flex-1'>
              Report a Bug or Request a Feature
            </Text>
            <ExternalLink size={18} color={colors.mutedForeground} />
          </Button>

          {/* Support the Developer */}
          <View className='rounded-xl bg-card p-4 gap-3 border-2 border-primary/20'>
            <View className='flex-row items-center gap-2'>
              <Heart size={22} color={colors.primary} />
              <Text className='text-primary text-base font-semibold'>
                Support the Developer
              </Text>
            </View>
            <Text className='text-muted-foreground text-sm leading-5'>
              This app is completely free. If you'd like, you can leave a voluntary
              tip to support me as an independent developer.
              Tips do not unlock any features.
            </Text>
            <Button
              className='self-start active:opacity-70'
              onPress={() => WebBrowser.openBrowserAsync(BUY_ME_A_COFFEE_URL)}>
              <Image
                source={{ uri: 'https://cdn.buymeacoffee.com/buttons/v2/default-green.png' }}
                className='h-10 w-36'
                resizeMode='contain'
                alt='Buy me a coffee' />
            </Button>
          </View>

          <SignOutButton />
        </View>
      </ScrollView>
    </View>
  );
}
