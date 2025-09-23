import { type ReactElement } from 'react';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactElement | ReactElement[];
}

export default function Button({
  onPress,
  disabled = false,
  className,
  children
}: ButtonProps) {
  return (
    <Pressable
      className={cn('active:opacity-70 disabled:opacity-50', className)}
      onPress={onPress}
      disabled={disabled}>
      {children}
    </Pressable>
  );
}
