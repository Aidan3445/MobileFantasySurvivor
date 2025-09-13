import { View, Image } from 'react-native';
import React from 'react';
const LogoImage = require('~/assets/Logo.png');

export default function Header() {
  return (
    <View className='items-center'>
      <Image
        source={LogoImage}
        className='w-72 h-72'
        resizeMode='contain'
      />
    </View>
  );
}
