import { Modal as RNModal, Text, Pressable, TextInput, FlatList } from 'react-native';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement } from 'react';
import { Check } from 'lucide-react-native';

interface SearchableSelectProps {
  isVisible: boolean;
  onClose: () => void;
  options: SearchableOption[];
  selectedValue: string;
  onSelect: (_: string) => void;
  searchText: string;
  onSearchChange: (_: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactElement;
}

export default function SearchableSelect({
  isVisible,
  onClose,
  options,
  selectedValue,
  onSelect,
  searchText,
  onSearchChange,
  placeholder = 'Search...',
  emptyMessage = 'No options found.',
  footerComponent,
}: SearchableSelectProps) {
  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType='none'
      onRequestClose={onClose}>
      <Pressable
        className='flex-1 justify-center items-center'
        onPress={onClose}>
        <Pressable
          className='bg-card shadow rounded-lg p-4 pb-0 max-h-96 w-80 mx-4 focus:-translate-y-32 transition-keyboard'
          onPress={(e) => e.stopPropagation()}>
          <TextInput
            className='border border-primary rounded px-3 py-2 mb-4 placeholder:text-muted-foreground'
            placeholder={placeholder}
            value={searchText}
            onChangeText={onSearchChange}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                className='flex-row items-center py-3 px-2 active:bg-gray-100 rounded-md my-0.5 bg-background'
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}>
                <Check size={16} color={selectedValue === item.value ? 'black' : 'transparent'} />
                <Text className='flex-1 ml-2'>{item.label}</Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text className='text-center text-gray-500 py-4'>{emptyMessage}</Text>
            }
            ListFooterComponent={footerComponent}
          />
        </Pressable>
      </Pressable>
    </RNModal >
  );
}
