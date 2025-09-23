import { View, Text, TextInput, FlatList } from 'react-native';
import Button from '~/components/common/button';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement } from 'react';
import { Check } from 'lucide-react-native';
import Modal from '~/components/common/modal';

interface SearchableMultiSelectProps<T extends string | number> {
  isVisible: boolean;
  onClose: () => void;
  options: SearchableOption<T>[];
  selectedValues: T[];
  onToggleSelect: (_: T[]) => void;
  searchText: string;
  onSearchChange: (_: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactElement;
}

export default function SearchableMultiSelect<T extends string | number>({
  isVisible,
  onClose,
  options,
  selectedValues,
  onToggleSelect,
  searchText,
  onSearchChange,
  placeholder = 'Search...',
  emptyMessage = 'No options found.',
  footerComponent
}: SearchableMultiSelectProps<T>) {
  const isSelected = (value: T) => selectedValues.includes(value);

  const handleToggleSelect = (value: T) => {
    if (isSelected(value)) {
      onToggleSelect(selectedValues.filter(v => v !== value));
    } else {
      onToggleSelect([...selectedValues, value]);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}>
      <View className='flex-row justify-between gap-2'>
        <TextInput
          className='flex-1 rounded border border-primary px-3 py-2 placeholder:text-muted-foreground'
          placeholder={placeholder}
          value={searchText}
          onChangeText={onSearchChange}
        />
        <Button
          className='items-center justify-center rounded bg-primary p-1'
          onPress={onClose}>
          <Text className='text-white'>Done</Text>
        </Button>
      </View>
      <FlatList
        className='py-4'
        showsVerticalScrollIndicator={false}
        data={options}
        keyExtractor={item => String(item.value)}
        renderItem={({ item }) => (
          <Button
            className='!active:bg-accent my-0.5 flex-row items-center rounded-md bg-background px-2 py-3'
            onPress={() => handleToggleSelect(item.value)}>
            <Check
              size={16}
              color={isSelected(item.value) ? 'black' : 'transparent'}
            />
            <Text className='ml-2 flex-1'>{item.label}</Text>
          </Button>
        )}
        ListEmptyComponent={
          <Text className='py-4 text-center text-muted-foreground'>
            {emptyMessage}
          </Text>
        }
        ListFooterComponent={footerComponent}
      />
    </Modal>
  );
}
