'use client';

import { type ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';

interface ColorRowProps {
  color: string;
  className?: string;
  children: ReactNode;
  loggedIn?: boolean;
}

export default function ColorRow({ color, className, children, loggedIn }: ColorRowProps) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-lg p-4',
        loggedIn && 'border-2 border-primary',
        className
      )}
      style={{ backgroundColor: color }}>
      {children}
    </View>
  );
}
