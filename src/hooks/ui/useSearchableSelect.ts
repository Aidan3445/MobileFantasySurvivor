import { useState } from 'react';

export interface SearchableOption<T extends string | number> {
  value: T;
  label: string;
}

export function useSearchableSelect<T extends string | number>() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const openModal = () => setIsVisible(true);
  const closeModal = () => {
    setIsVisible(false);
    setSearchText('');
  };

  const filterOptions = (options: SearchableOption<T>[]) =>
    options.filter(option =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );

  return {
    isVisible,
    searchText,
    setSearchText,
    openModal,
    closeModal,
    filterOptions
  };
}
