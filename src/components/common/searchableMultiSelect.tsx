import { View, Text, Pressable, TextInput, FlatList } from 'react-native';
import { type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement } from 'react';
import { Check } from 'lucide-react-native';
import Modal from '~/components/common/modal';

interface SearchableMultiSelectProps {
  isVisible: boolean;
  onClose: () => void;
  options: SearchableOption[];
  selectedValues: string[];
  onToggleSelect: (_: string[]) => void;
  searchText: string;
  onSearchChange: (_: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactElement;
}

export default function SearchableMultiSelect({
  isVisible,
  onClose,
  options,
  selectedValues,
  onToggleSelect,
  searchText,
  onSearchChange,
  placeholder = 'Search...',
  emptyMessage = 'No options found.',
  footerComponent,
}: SearchableMultiSelectProps) {
  const isSelected = (value: string) => selectedValues.includes(value);

  const handleToggleSelect = (value: string) => {
    if (isSelected(value)) {
      onToggleSelect(selectedValues.filter(v => v !== value));
    } else {
      onToggleSelect([...selectedValues, value]);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className='flex-row justify-between gap-2'>
        <TextInput
          className='flex-1 border border-primary rounded px-3 py-2 placeholder:text-muted-foreground'
          placeholder={placeholder}
          value={searchText}
          onChangeText={onSearchChange} />
        <Pressable className='rounded bg-primary p-1 items-center justify-center' onPress={onClose}>
          <Text className='text-white'>Done</Text>
        </Pressable>
      </View>
      <FlatList
        className='py-4'
        showsVerticalScrollIndicator={false}
        data={options}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            className='flex-row items-center py-3 px-2 active:bg-accent rounded-md my-0.5 bg-background'
            onPress={() => handleToggleSelect(item.value)}>
            <Check
              size={16}
              color={isSelected(item.value) ? 'black' : 'transparent'}
            />
            <Text className='flex-1 ml-2'>{item.label}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text className='text-center text-muted-foreground py-4'>{emptyMessage}</Text>
        }
        ListFooterComponent={footerComponent} />
    </Modal>
  );
}
