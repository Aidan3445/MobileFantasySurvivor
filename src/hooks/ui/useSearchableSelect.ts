import { useState } from 'react';

export interface SearchableOption {
  value: string;
  label: string;
}

export function useSearchableSelect() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const openModal = () => setIsVisible(true);
  const closeModal = () => {
    setIsVisible(false);
    setSearchText('');
  };

  const filterOptions = (options: SearchableOption[]) =>
    options.filter(option =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );

  return {
    isVisible,
    searchText,
    setSearchText,
    openModal,
    closeModal,
    filterOptions,
  };
}
