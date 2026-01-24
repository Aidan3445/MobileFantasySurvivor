import { View, Text, TextInput, FlatList } from 'react-native';
import { useSearchableSelect, type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement } from 'react';
import { Check } from 'lucide-react-native';
import Modal from '~/components/common/modal';
import Button from '~/components/common/button';

interface SearchableMultiSelectProps<T extends string | number> {
  options: SearchableOption<T>[];
  selectedValues: T[];
  onToggleSelect: (_: T[]) => void;
  overrideState?: [boolean, (_open: boolean) => void];
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactElement;
  children?: ReactElement;
  asChild?: boolean;
}

export default function SearchableMultiSelect<T extends string | number>({
  options,
  selectedValues,
  onToggleSelect,
  overrideState,
  placeholder = 'Search...',
  emptyMessage = 'No options found.',
  footerComponent,
  children,
  asChild,
}: SearchableMultiSelectProps<T>) {
  const {
    isVisible,
    searchText,
    setSearchText,
    openModal,
    closeModal,
    filterOptions,
  } = useSearchableSelect<T>(overrideState);

  const isSelected = (value: T) => selectedValues.includes(value);

  const handleToggleSelect = (value: T) => {
    if (isSelected(value)) {
      onToggleSelect(selectedValues.filter((v) => v !== value));
    } else {
      onToggleSelect([...selectedValues, value]);
    }
  };

  const renderTrigger = () => {
    if (asChild && !children) throw new Error('SearchableMultiSelect: asChild is true but no children were provided.');
    if (asChild && children) return children;
    if (children) {
      return (
        <Button
          className='items-center justify-center rounded border border-primary/20 bg-primary/10 p-1'
          onPress={openModal}>
          {children}
        </Button>
      );
    }
    // Default trigger showing selection count
    const selectedCount = selectedValues.length;
    const selectedLabels = options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label);
    return (
      <Button
        className='items-center justify-center rounded border border-primary/20 bg-primary/10 p-1'
        onPress={openModal}>
        <Text>
          {selectedCount === 0
            ? 'Select...'
            : selectedCount === 1
              ? selectedLabels[0]
              : `${selectedCount} selected`}
        </Text>
      </Button>
    );
  };

  return (
    <>
      <Modal isVisible={isVisible} onClose={closeModal}>
        <View className='flex-row justify-between gap-2'>
          <TextInput
            className='flex-1 rounded border border-primary px-3 py-2 placeholder:text-muted-foreground'
            placeholder={placeholder}
            value={searchText}
            onChangeText={setSearchText} />
          <Button
            className='items-center justify-center rounded bg-primary p-1'
            onPress={closeModal}>
            <Text className='text-white'>Done</Text>
          </Button>
        </View>
        <FlatList
          className='py-4'
          showsVerticalScrollIndicator={false}
          data={filterOptions(options)}
          keyExtractor={(item) => String(item.value)}
          renderItem={({ item }) => (
            <Button
              className='!active:bg-accent my-0.5 flex-row items-center rounded-md bg-background px-2 py-3'
              disabled={item.disabled}
              onPress={() => {
                if (item.disabled) return;
                handleToggleSelect(item.value);
              }}>
              <Check
                size={16}
                color={isSelected(item.value) ? 'black' : 'transparent'}
              />
              {item.renderLabel ? (
                item.renderLabel()
              ) : (
                <Text className='ml-2 flex-1'>{item.label}</Text>
              )}
            </Button>
          )}
          ListEmptyComponent={
            <Text className='py-4 text-center text-muted-foreground'>
              {emptyMessage}
            </Text>
          }
          ListFooterComponent={footerComponent} />
      </Modal>
      {renderTrigger()}
    </>
  );
}
