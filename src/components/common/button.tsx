import { type ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import { cn } from '~/lib/utils';

interface ButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactElement | (ReactElement | null)[];
}

export default function Button({
  onPress,
  onLongPress,
  disabled = false,
  className,
  children
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn('disabled:opacity-50', className)}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}
