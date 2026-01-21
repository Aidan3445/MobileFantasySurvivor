import { type ReactElement } from 'react';
import { Pressable, Modal as RNModal, View } from 'react-native';

import { cn } from '~/lib/utils';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  animationType?: 'slide' | 'fade' | 'none';
  children: ReactElement | ReactElement[];
}

export default function Modal({
  isVisible,
  onClose,
  animationType = 'slide',
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
            !isVisible && 'opacity-0'
          )} />
        <Pressable
          className='flex-1 items-center justify-center'
          onPress={onClose}>
          <Pressable
            className='max-h-4/5 w-11/12 rounded-lg bg-card p-4'
            onPress={e => e.stopPropagation()}>
            {children}
          </Pressable>
        </Pressable>
      </RNModal>
    </>
  );
}
