'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // TODO: Implement search functionality
  };

  return (
    <div className={styles.searchBar}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search for..."
        value={searchValue}
        onChange={handleSearch}
        className={styles.searchInput}
      />
    </div>
  );
}

export default SearchBar;

