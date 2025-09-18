import { Text, Pressable, TextInput, FlatList } from 'react-native';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement } from 'react';
import { Check } from 'lucide-react-native';
import Modal from '~/components/common/modal';

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
    <Modal isVisible={isVisible} onClose={onClose}>
      <TextInput
        className='border border-primary rounded px-3 py-2 placeholder:text-muted-foreground'
        placeholder={placeholder}
        value={searchText}
        onChangeText={onSearchChange}
      />
      <FlatList
        className='py-4'
        showsVerticalScrollIndicator={false}
        data={options}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            className='flex-row items-center py-3 px-2 active:bg-accent rounded-md my-0.5 bg-background'
            onPress={() => {
              onSelect(item.value);
              onClose();
            }}>
            <Check size={16} color={selectedValue === item.value ? 'black' : 'transparent'} />
            <Text className='flex-1 ml-2'>{item.label}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text className='text-center text-muted-foreground py-4'>{emptyMessage}</Text>
        }
        ListFooterComponent={footerComponent}
      />
    </Modal>
  );
}
