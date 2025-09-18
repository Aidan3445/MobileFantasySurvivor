import { Pressable, Text } from 'react-native';
import { Ellipsis } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SearchableSelect from '~/components/common/searchableSelect';
import { type SearchableOption, useSearchableSelect } from '~/hooks/ui/useSearchableSelect';

interface SelectSeasonProps {
  seasons: SearchableOption[];
  value: string;
  setValue: (_: string) => void;
  someHidden?: boolean;
}

export default function SelectSeason({ seasons, value, setValue, someHidden }: SelectSeasonProps) {
  const router = useRouter();
  const {
    isVisible,
    searchText,
    setSearchText,
    openModal,
    closeModal,
    filterOptions
  } = useSearchableSelect();

  const footerComponent = someHidden !== undefined ? (
    <Pressable
      className='bg-muted py-3 px-2 mt-2 mb-4 rounded active:bg-muted/50'
      onPress={() => {
        router.push('/playground');
        closeModal();
      }}>
      <Text className='text-center text-xs'>
        {someHidden ? 'See all seasons' : 'Try scoring playground'}
      </Text>
    </Pressable>
  ) : undefined;

  return (
    <>
      <Pressable
        className='absolute right-2'
        onPress={openModal}>
        <Ellipsis size={20} />
      </Pressable>
      <SearchableSelect
        isVisible={isVisible}
        onClose={closeModal}
        options={filterOptions(seasons)}
        selectedValue={value}
        onSelect={setValue}
        searchText={searchText}
        onSearchChange={setSearchText}
        placeholder='Search seasons...'
        emptyMessage='No seasons found.'
        footerComponent={footerComponent}
      />
    </>
  );
}
