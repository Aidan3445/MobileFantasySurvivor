import { View, Text, TextInput, FlatList } from 'react-native';
import { useSearchableSelect, type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement, type ReactNode } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react-native';
import Modal from '~/components/common/modal';
import Button from '~/components/common/button';
import { colors } from '~/lib/colors';

interface SearchableMultiSelectProps<T extends string | number> {
  options: SearchableOption<T>[];
  selectedValues?: T[];
  onToggleSelect: (_: T[]) => void;
  overrideState?: [boolean, (_open: boolean) => void];
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactNode;
  children?: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
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
  disabled
}: SearchableMultiSelectProps<T>) {
  const { isVisible, searchText, setSearchText, openModal, closeModal, filterOptions } =
    useSearchableSelect<T>(overrideState);

  const isSelected = (value: T) => selectedValues?.includes(value);

  const handleToggleSelect = (value: T) => {
    if (isSelected(value)) {
      onToggleSelect(selectedValues?.filter((v) => v !== value) ?? []);
    } else {
      onToggleSelect([...selectedValues ?? [], value]);
    }
  };

  const renderTrigger = () => {
    if (asChild && !children)
      throw new Error(
        'SearchableMultiSelect: asChild is true but no children were provided.'
      );
    if (asChild && children) return children;

    if (children) {
      return (
        <Button
          className='w-full flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 px-3 py-2 active:bg-primary/10'
          disabled={disabled}
          onPress={openModal}>
          {children}
          <View className='w-max flex-row items-center gap-1'>
            {selectedValues && selectedValues.length > 0 && (
              <Button
                className='rounded-full p-0.5 active:bg-primary/20'
                disabled={disabled}
                onPress={(e) => {
                  e.stopPropagation();
                  onToggleSelect([]);
                }}>
                <X size={16} color={colors['muted-foreground']} />
              </Button>
            )}
            <ChevronDown size={18} color={colors['muted-foreground']} />
          </View>
        </Button>
      );
    }

    // Default trigger showing selection count
    const selectedCount = selectedValues?.length ?? 0;
    const selectedLabels = options
      .filter((opt) => opt.value && selectedValues?.includes(opt.value))
      .map((opt) => opt.label);

    return (
      <Button
        className='w-full mx-10 flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 px-3 py-2 active:bg-primary/10'
        disabled={disabled}
        onPress={openModal}>
        <Text
          className={selectedCount === 0 ? 'text-muted-foreground' : 'font-medium text-foreground'}>
          {selectedCount === 0
            ? 'Select...'
            : selectedCount === 1
              ? selectedLabels[0]
              : `${selectedCount} selected`}
        </Text>
        <View className='flex-row items-center gap-1'>
          {selectedCount > 0 && (
            <Button
              className='rounded-full p-0.5 active:bg-primary/20'
              disabled={disabled}
              onPress={(e) => {
                e.stopPropagation();
                onToggleSelect([]);
              }}>
              <X size={16} color={colors['muted-foreground']} />
            </Button>
          )}
          <ChevronDown size={18} color={colors['muted-foreground']} />
        </View>
      </Button>
    );
  };

  return (
    <>
      <Modal isVisible={isVisible} onClose={closeModal} className='gap-2 pb-0'>
        {/* Header with Search and Done */}
        <View className='flex-row items-center gap-2'>
          <View className='flex-1 flex-row items-center gap-2 rounded-lg border-2 border-primary/20 bg-primary/5 px-3'>
            <Search size={18} color={colors['muted-foreground']} />
            <TextInput
              className='flex-1 py-2.5 text-foreground placeholder:text-muted-foreground'
              placeholder={placeholder}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors['muted-foreground']} />
          </View>
          <Button
            className='rounded-lg bg-primary px-4 py-2.5 active:opacity-80'
            onPress={closeModal}>
            <Text className='font-semibold text-white'>Done</Text>
          </Button>
        </View>

        {/* Selected Count */}
        {selectedValues && selectedValues.length > 0 ? (
          <View className='flex-row items-center justify-between'>
            <Text className='text-sm text-muted-foreground'>
              {selectedValues.length} selected
            </Text>
            <Button onPress={() => onToggleSelect([])}>
              <Text key={'clear-all'} className='text-sm font-medium text-primary'>Clear all</Text>
            </Button>
          </View>
        ) : (
          <View>
            <Text className='text-sm text-muted-foreground'>No options selected</Text>
          </View>
        )}

        {/* Options List */}
        <FlatList
          className='max-h-64 pb-4'
          showsVerticalScrollIndicator={false}
          data={filterOptions(options)}
          keyExtractor={(item) => String(item.value)}
          ItemSeparatorComponent={() => <View className='h-1' />}
          renderItem={({ item }) => {
            if (!item.value || (typeof item.value === 'string'
              ? item.value.includes('__null_option_')
              : item.value as number < 0)) {
              return (
                <View key={item.label} className='px-3 py-2'>
                  <Text className='text-center font-bold tracking-widest text-primary'>
                    {item.label}
                  </Text>
                </View>
              );
            }

            const selected = isSelected(item.value);
            return (
              <Button
                className={`flex-row items-center rounded-lg px-3 py-2.5 active:bg-primary/10 ${selected ? 'bg-primary/10' : 'bg-primary/5'
                  } ${item.disabled ? 'opacity-50' : ''}`}
                disabled={item.disabled}
                onPress={() => {
                  if (item.disabled) return;
                  handleToggleSelect(item.value!);
                }}>
                <View
                  className={`mr-3 h-5 w-5 items-center justify-center rounded border-2 ${selected ? 'border-primary bg-primary' : 'border-primary/30 bg-transparent'
                    }`}>
                  {selected && <Check size={14} color='white' />}
                </View>
                {item.renderLabel ? (
                  item.renderLabel()
                ) : (
                  <Text
                    className={`flex-1 ${selected ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                    {item.label}
                  </Text>
                )}
              </Button>
            );
          }}
          ListEmptyComponent={
            <View className='items-center py-8'>
              <Text className='text-muted-foreground'>{emptyMessage}</Text>
            </View>
          }
          ListFooterComponent={footerComponent as ReactElement} />
      </Modal>
      {renderTrigger()}
    </>
  );
}
