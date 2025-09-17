import { View, Image } from 'react-native';
import React from 'react';
import { cn } from '~/lib/utils';
const LogoImage = require('~/assets/Logo.png');

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <View className={cn('items-center', className)}>
      <Image
        source={LogoImage}
        className='w-40 h-40'
        resizeMode='contain'
      />
    </View>
  );
}
