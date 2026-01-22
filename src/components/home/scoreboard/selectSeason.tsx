import { Text } from 'react-native';
import Button from '~/components/common/button';
import { Ellipsis } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SearchableSelect from '~/components/common/searchableSelect';
import { type SearchableOption, useSearchableSelect } from '~/hooks/ui/useSearchableSelect';
import { cn } from '~/lib/utils';
import { colors } from '~/lib/colors';

interface SelectSeasonProps {
  seasons: SearchableOption<string>[];
  value: string;
  setValue: (_: string) => void;
  someHidden?: boolean;
  className?: string;
}

export default function SelectSeason({ seasons, value, setValue, someHidden, className }: SelectSeasonProps) {
  const router = useRouter();
  const { isVisible, searchText, setSearchText, openModal, closeModal, filterOptions } =
    useSearchableSelect<string>();

  const footerComponent =
    someHidden !== undefined ? (
      <Button
        className='mb-4 mt-2 rounded bg-muted px-2 py-3'
        onPress={() => {
          router.push('/playground');
          closeModal();
        }}>
        <Text className='text-center text-xs'>
          {someHidden ? 'See all seasons' : 'Try scoring playground'}
        </Text>
      </Button>
    ) : undefined;

  return (
    <>
      <Button
        className={cn('absolute right-3 top-1', className)}
        onPress={openModal}>
        <Ellipsis size={32} color={colors.primary} />
      </Button>
      <SearchableSelect<string>
        isVisible={isVisible}
        onClose={closeModal}
        options={filterOptions(seasons)}
        selectedValue={value}
        onSelect={setValue}
        searchText={searchText}
        onSearchChange={setSearchText}
        placeholder='Search seasons...'
        emptyMessage='No seasons found.'
        footerComponent={footerComponent} />
    </>
  );
}
