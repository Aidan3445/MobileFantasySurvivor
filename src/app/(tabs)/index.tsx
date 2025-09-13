import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Page() {
  return (
    <View className='flex flex-1'>
      <Header />
      <Content />
      <Footer />
    </View>
  );
}

function Content() {
  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
      <View className='bg-white rounded-3xl p-8 shadow-lg max-w-md w-full'>
        <View className='items-center mb-8'>
          <View className='bg-primary/10 rounded-full p-6 mb-4'>
            <Text className='text-4xl'>🏆</Text>
          </View>
          <Text className='text-4xl font-bold text-primary text-center mb-4'>
            Fantasy Survivor
          </Text>
          <Text className='text-secondary text-lg text-center'>
            Compete, predict, and win in the ultimate fantasy survival game!
          </Text>
        </View>

        <View className='gap-y-4'>
          <View className='bg-accent/20 rounded-2xl p-4 border border-accent/50'>
            <Text className='text-primary font-semibold text-lg mb-2'>🎯 Predict Outcomes</Text>
            <Text className='text-secondary'>Make your picks and see how well you know the game</Text>
          </View>

          <View className='bg-accent/20 rounded-2xl p-4 border border-accent/50'>
            <Text className='text-primary font-semibold text-lg mb-2'>🏅 Compete & Win</Text>
            <Text className='text-secondary'>Climb the leaderboard and prove you're the best</Text>
          </View>

          <Link
            suppressHighlighting
            className='bg-primary rounded-2xl py-4 mt-6 shadow-sm flex items-center justify-center'
            href='/playground'
          >
            <Text className='text-white text-lg font-semibold'>Start Playing</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }} className='bg-white border-b border-accent/30'>
      <View className='px-6 h-16 flex items-center flex-row justify-between'>
        <View className='flex-row items-center'>
          <Text className='text-2xl font-bold text-primary'>Fantasy Survivor</Text>
        </View>
        <View className='flex flex-row gap-4'>
          <Link
            className='text-secondary font-medium'
            href='/leagues'
          >
            Leagues
          </Link>
          <Link
            className='text-secondary font-medium'
            href='/profile'
          >
            Profile
          </Link>
        </View>
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className='flex shrink-0 bg-gray-100 native:hidden'
      style={{ paddingBottom: bottom }}
    >
      <View className='py-6 flex-1 items-start px-4 md:px-6 '>
        <Text className={'text-center text-gray-700'}>
          © {new Date().getFullYear()} Me
        </Text>
      </View>
    </View>
  );
}
