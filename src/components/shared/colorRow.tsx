'use client';

import { type ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';

interface ColorRowProps {
  color: string;
  className?: string;
  children: ReactNode;
}

export default function ColorRow({ color, className, children }: ColorRowProps) {
  return (
    <View
      className={cn(
        'w-full inline-flex px-1 py-0.5 gap-4 text-nowrap items-center rounded-md border-t border-b border-r border-transparent',
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
