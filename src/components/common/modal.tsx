import { type ReactElement } from 'react';
import { Pressable, Modal as RNModal, View } from 'react-native';

import { cn } from '~/lib/utils';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  animationType?: 'slide' | 'fade' | 'none';
  className?: string;
  children: ReactElement | ReactElement[];
}

export default function Modal({
  isVisible,
  onClose,
  animationType = 'slide',
  className,
  children
}: ModalProps) {
  return (
    <>
      <RNModal
        visible={isVisible}
        transparent
        animationType={animationType}
        onRequestClose={onClose}>
        <View
          className={cn(
            'absolute bottom-0 left-0 right-0 h-[200%] bg-black/50 transition-opacity',
            'animate-fade-in',
            !isVisible && '!opacity-0'
          )} />
        <Pressable
          className='flex-1 items-center justify-center'
          onPress={onClose}>
          <Pressable
            className={cn('max-h-4/5 w-11/12 rounded-xl bg-card p-4 border-2 border-primary/20', className)}
            onPress={e => e.stopPropagation()}>
            {children}
          </Pressable>
        </Pressable>
      </RNModal>
    </>
  );
}
