import { type ReactElement } from 'react';
import { KeyboardAvoidingView, Pressable, Modal as RNModal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}>
      <SafeAreaView
        edges={{ top: 'maximum', bottom: 'maximum' }}
        className='flex-1 px-2 py-32 items-center justify-center'>
        <Pressable
          onPress={onClose}
          className={cn(
            'absolute bottom-0 left-0 right-0 h-[200%] bg-black/50 transition-opacity',
            'animate-fade-in',
            !isVisible && '!opacity-0'
          )} />
        <KeyboardAvoidingView
          className='w-full transition-all duration-100'
          behavior='padding'>
          <Pressable
            className={cn(
              'w-full rounded-xl border-2 border-primary/20 bg-card p-4 transition-all',
              className
            )}
            onPress={(e) => e.stopPropagation()}>
            {children}
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </RNModal>
  );
}
