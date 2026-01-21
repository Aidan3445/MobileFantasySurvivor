'use client';

import { Link as LinkIcon, Share } from 'lucide-react-native';
import { TextInput, Text, View, Alert, Share as RNShare } from 'react-native';
import Button from '~/components/common/button';
import { useMemo, useState } from 'react';
import { cn } from '~/lib/utils';
import { useLeague } from '~/hooks/leagues/query/useLeague';
import * as Clipboard from 'expo-clipboard';

export default function InviteLink() {
  const { data: league } = useLeague();
  const [hasCopied, setHasCopied] = useState(false);

  const origin = useMemo(() => {
    return 'https://yourfantasysurvivor.com';
  }, []);

  if (!league) return null;

  const link = `${origin}/i/${league.hash}`;

  const copyLink = async () => {
    await Clipboard.setStringAsync(link);
    setHasCopied(true);
    Alert.alert('Success', 'Link copied to clipboard');
    // eslint-disable-next-line no-undef
    setTimeout(() => setHasCopied(false), 1000);
  };

  const shareLink = async () => {
    try {
      await RNShare.share({
        message: `Join ${league.name} on Fantasy Survivor! ${link}`,
        url: link, // iOS will use this
        title: `Join ${league.name}!`
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying
      await copyLink();
    }
  };

  return (
    <View className='w-full rounded-xl bg-card p-2'>
      <Text className='text-card-foreground mb-1 text-lg font-bold'>Invite friends to play</Text>
      <Text className='mb-3 text-sm text-muted-foreground'>
        Copy the link and share with your friends
      </Text>

      <View className='flex-row items-center gap-2'>
        <Button
          className='relative flex-1 flex-row items-center'
          onPress={copyLink}>
          <TextInput
            className={cn(
              'flex-1 rounded-lg border border-muted bg-white p-3 pr-12',
              hasCopied && 'bg-muted/40'
            )}
            editable={false}
            value={link}
            multiline={false}
          />
          <View className='absolute right-3'>
            <LinkIcon
              size={20}
              color={hasCopied ? 'gray' : 'black'}
            />
          </View>
        </Button>

        <Button
          className='!active:bg-primary/80 rounded-lg bg-primary p-3'
          onPress={shareLink}>
          <Share size={20} color='white' />
        </Button>
      </View>
    </View>
  );
}
