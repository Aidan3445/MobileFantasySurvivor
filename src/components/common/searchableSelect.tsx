import { Text, TextInput, FlatList } from 'react-native';
import { useSearchableSelect, type SearchableOption } from '~/hooks/ui/useSearchableSelect';
import { type ReactElement, type ReactNode } from 'react';
import { Check } from 'lucide-react-native';
import Modal from '~/components/common/modal';
import Button from '~/components/common/button';

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
  asChild
}: SearchableSelectProps<T>) {
  const {
    isVisible,
    searchText,
    setSearchText,
    openModal,
    closeModal,
    filterOptions
  } = useSearchableSelect<T>(overrideState);

  const renderTrigger = () => {
    if (asChild && !children) throw new Error('SearchableSelect: asChild is true but no children were provided.');
    if (asChild && children) return children;

    if (children) {
      return (
        <Button
          className='w-full items-center justify-center bg-primary/10 p-1 rounded border border-primary/20'
          onPress={openModal}>
          {children}
        </Button>
      );
    }

    const selectedOption = options.find(option => option.value === selectedValue);
    return (
      <Button
        className='w-full items-center justify-center bg-primary/10 p-1 rounded border border-primary/20'
        onPress={openModal}>
        {selectedOption ?
          selectedOption.renderLabel
            ? selectedOption.renderLabel()
            : <Text>{selectedOption.label}</Text>
          : <Text>Select...</Text>}
      </Button>
    );
  };

  return (
    <>
      <Modal
        isVisible={isVisible}
        onClose={() => {
          closeModal();
        }}>
        <TextInput
          className='rounded border border-primary px-3 py-2 placeholder:text-muted-foreground'
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText} />
        <FlatList
          className='py-4'
          showsVerticalScrollIndicator={false}
          data={filterOptions(options)}
          keyExtractor={item => String(item.value)}
          renderItem={({ item }) => (
            <Button
              className='!active:bg-accent my-0.5 flex-row items-center rounded-md bg-background px-2 py-3'
              disabled={item.disabled}
              onPress={() => {
                if (item.disabled) return;
                onSelect(item.value);
                closeModal();
              }}>
              <Check size={16} color={selectedValue === item.value ? 'black' : 'transparent'} />
              {item.renderLabel ? (
                item.renderLabel()
              ) : (
                <Text className='ml-2 flex-1'>{item.label}</Text>
              )}
            </Button>
          )}
          ListEmptyComponent={
            <Text className='py-4 text-center text-muted-foreground'>{emptyMessage}</Text>
          }
          ListFooterComponent={footerComponent as ReactElement} />
      </Modal>
      {renderTrigger()}
    </>
  );
}
