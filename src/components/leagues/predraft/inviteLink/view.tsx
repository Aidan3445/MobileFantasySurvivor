'use client';
import { Link as LinkIcon, Share } from 'lucide-react-native';
import { TextInput, Text, View, Pressable, Alert, Share as RNShare } from 'react-native';
import { useMemo, useState } from 'react';
import { cn } from '~/lib/util';
import { useLeague } from '~/hooks/leagues/useLeague';
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
    <View className='p-2 bg-card rounded-xl w-full'>
      <Text className='text-lg font-bold text-card-foreground mb-1'>
        Invite friends to play
      </Text>
      <Text className='text-sm text-muted-foreground mb-3'>
        Copy the link and share with your friends
      </Text>

      <View className='flex-row items-center gap-2'>
        <Pressable
          className='flex-1 relative flex-row items-center'
          onPress={copyLink}>
          <TextInput
            className={cn(
              'flex-1 border border-gray-300 rounded-lg p-3 pr-12 bg-white',
              hasCopied && 'bg-white/40'
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
        </Pressable>

        <Pressable
          className='bg-primary rounded-lg p-3 active:bg-primary/80'
          onPress={shareLink}>
          <Share size={20} color='white' />
        </Pressable>
      </View>
    </View>
  );
}
