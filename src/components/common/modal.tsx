import { type ReactElement } from 'react';
import { Pressable, Modal as RNModal, View } from 'react-native';
import { cn } from '~/lib/utils';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  animationType?: 'slide' | 'fade' | 'none';
  children: ReactElement | ReactElement[];
}

export default function Modal({ isVisible, onClose, animationType = 'slide', children }: ModalProps) {
  return (
    <>
      <RNModal
        visible={isVisible}
        transparent
        animationType={animationType}
        onRequestClose={onClose}>
        <View className={cn(
          'absolute h-[200%] left-0 right-0 bottom-0 bg-black/50 transition-opacity',
          !isVisible && 'opacity-0')} />
        <Pressable
          className='flex-1 justify-center items-center'
          onPress={onClose}>
          <Pressable
            className='bg-card rounded-lg p-4 w-11/12 max-h-4/5'
            onPress={(e) => e.stopPropagation()}>
            {children}
          </Pressable>
        </Pressable>
      </RNModal>
    </>
  );
}
