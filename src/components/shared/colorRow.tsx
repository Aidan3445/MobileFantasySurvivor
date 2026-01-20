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
        'w-full inline-flex px-4 py-0.5 gap-4 text-nowrap items-center rounded-md border-t border-b border-r border-transparent',
        loggedIn && 'text-primary',
        className
      )}
      style={{
        backgroundColor: `${color ?? '#AAAAAA'}20`,
        borderLeftColor: color ?? '#000000',
        borderLeftWidth: 4,
      }}>
      {children}
    </View>
  );
}
