import { useCallback, useState } from 'react';
import { type ReactNode } from 'react';

export interface SearchableOption<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  renderLabel?: () => ReactNode;
}

export function useSearchableSelect<T extends string | number>(
  overrideState?: [boolean, (_state: boolean) => void]
) {
  const state = useState(false);
  const [isVisible, setIsVisible] = overrideState ?? state;
  const [searchText, setSearchText] = useState('');

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      // Delay clearing search text to allow modal close animation to finish
      setSearchText('');
    }, 100);
  }, [setIsVisible]);

  const filterOptions = (options: SearchableOption<T>[]) =>
    options.filter(option => option.label.toLowerCase().includes(searchText.toLowerCase()));

  return { isVisible, searchText, setSearchText, openModal, closeModal, filterOptions };
}
