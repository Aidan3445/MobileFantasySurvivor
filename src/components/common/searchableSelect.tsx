import { Text, TextInput, FlatList } from 'react-native';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement } from 'react';
import { Check } from 'lucide-react-native';
import Modal from '~/components/common/modal';
import Button from '~/components/common/button';

interface SearchableSelectProps<T extends string | number> {
  isVisible: boolean;
  onClose: () => void;
  options: SearchableOption<T>[];
  selectedValue: T;
  onSelect: (_: T) => void;
  searchText: string;
  onSearchChange: (_: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactElement;
}

export default function SearchableSelect<T extends string | number>({
  isVisible,
  onClose,
  options,
  selectedValue,
  onSelect,
  searchText,
  onSearchChange,
  placeholder = 'Search...',
  emptyMessage = 'No options found.',
  footerComponent
}: SearchableSelectProps<T>) {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}>
      <TextInput
        className='rounded border border-primary px-3 py-2 placeholder:text-muted-foreground'
        placeholder={placeholder}
        value={searchText}
        onChangeText={onSearchChange}
      />
      <FlatList
        className='py-4'
        showsVerticalScrollIndicator={false}
        data={options}
        keyExtractor={item => String(item.value)}
        renderItem={({ item }) => (
          <Button
            className='!active:bg-accent my-0.5 flex-row items-center rounded-md bg-background px-2 py-3'
            onPress={() => {
              onSelect(item.value);
              onClose();
            }}>
            <Check
              size={16}
              color={selectedValue === item.value ? 'black' : 'transparent'}
            />
            <Text className='ml-2 flex-1'>{item.label}</Text>
          </Button>
        )}
        ListEmptyComponent={
          <Text className='py-4 text-center text-muted-foreground'>{emptyMessage}</Text>
        }
        ListFooterComponent={footerComponent}
      />
    </Modal>
  );
}
