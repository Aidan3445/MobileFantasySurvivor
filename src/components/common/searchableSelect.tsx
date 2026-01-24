import { View, Text, TextInput, FlatList } from 'react-native';
import { useSearchableSelect, type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement, type ReactNode } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react-native';
import Modal from '~/components/common/modal';
import Button from '~/components/common/button';
import { colors } from '~/lib/colors';

interface SearchableSelectProps<T extends string | number> {
  options: SearchableOption<T>[];
  selectedValue?: T;
  onSelect: (_: T) => void;
  overrideState?: [boolean, (_open: boolean) => void];
  placeholder?: string;
  emptyMessage?: string;
  footerComponent?: ReactNode;
  children?: ReactNode;
  asChild?: boolean;
}

export default function SearchableSelect<T extends string | number>({
  options,
  selectedValue,
  onSelect,
  overrideState,
  placeholder = 'Search...',
  emptyMessage = 'No options found.',
  footerComponent,
  children,
  asChild,
}: SearchableSelectProps<T>) {
  const { isVisible, searchText, setSearchText, openModal, closeModal, filterOptions } =
    useSearchableSelect<T>(overrideState);

  const renderTrigger = () => {
    if (asChild && !children)
      throw new Error('SearchableSelect: asChild is true but no children were provided.');
    if (asChild && children) return children;

    if (children) {
      return (
        <Button
          className='w-full flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 px-3 py-2 active:bg-primary/10'
          onPress={openModal}>
          {children}
          <ChevronDown size={18} color={colors['muted-foreground']} />
        </Button>
      );
    }

    const selectedOption = options.find((option) => option.value === selectedValue);
    return (
      <Button
        className='w-full flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 px-3 py-2 active:bg-primary/10'
        onPress={openModal}>
        {selectedOption ? (
          selectedOption.renderLabel ? (
            selectedOption.renderLabel()
          ) : (
            <Text className='font-medium text-foreground'>{selectedOption.label}</Text>
          )
        ) : (
          <Text className='text-muted-foreground'>Select...</Text>
        )}
        <ChevronDown size={18} color={colors['muted-foreground']} />
      </Button>
    );
  };

  return (
    <>
      <Modal isVisible={isVisible} onClose={closeModal}>
        {/* Search Input */}
        <View className='flex-row items-center gap-2 rounded-lg border-2 border-primary/20 bg-primary/5 px-3'>
          <Search size={18} color={colors['muted-foreground']} />
          <TextInput
            className='flex-1 py-2.5 text-foreground placeholder:text-muted-foreground'
            placeholder={placeholder}
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={colors['muted-foreground']} />
        </View>

        {/* Options List */}
        <FlatList
          className='mt-3 max-h-64'
          showsVerticalScrollIndicator={false}
          data={filterOptions(options)}
          keyExtractor={(item) => String(item.value)}
          ItemSeparatorComponent={() => <View className='h-1' />}
          renderItem={({ item }) => {
            const isSelected = selectedValue === item.value;
            return (
              <Button
                className={`flex-row items-center rounded-lg px-3 py-2.5 active:bg-primary/10 ${isSelected ? 'bg-primary/10' : 'bg-primary/5'
                  } ${item.disabled ? 'opacity-50' : ''}`}
                disabled={item.disabled}
                onPress={() => {
                  if (item.disabled) return;
                  onSelect(item.value);
                  closeModal();
                }}>
                <View className='w-6'>
                  {isSelected && <Check size={18} color={colors.primary} />}
                </View>
                {item.renderLabel ? (
                  item.renderLabel()
                ) : (
                  <Text
                    className={`flex-1 ${isSelected ? 'font-semibold text-primary' : 'text-foreground'}`}>
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
          ListFooterComponent={footerComponent as ReactElement}
        />
      </Modal>
      {renderTrigger()}
    </>
  );
}
