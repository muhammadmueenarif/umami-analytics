import { useState } from 'react';
import {
  Button,
  Dropdown,
  Icon,
  Icons,
  Item,
  Loading,
  Menu,
  SearchField,
  TextField,
} from 'react-basics';
import { useFilters, useFields, useFormat, useWebsiteValues } from '@/components/hooks';
import { isSearchOperator } from '@/lib/params';
import styles from './FilterRecord.module.css';

export interface FilterRecordProps {
  websiteId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  name: string;
  operator: string;
  value: string;
  onSelect?: (name: string, value: any) => void;
  onRemove?: (name: string) => void;
  onChange?: (name: string, value: string) => void;
}

export function FilterRecord({
  websiteId,
  type,
  startDate,
  endDate,
  name,
  operator,
  value,
  onSelect,
  onRemove,
  onChange,
}: FilterRecordProps) {
  const { fields } = useFields();
  const { filters: operators } = useFilters();
  const [selected, setSelected] = useState(value);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { formatValue } = useFormat();
  const {
    data: values = [],
    isLoading,
  } = useWebsiteValues({
    websiteId,
    type: name,
    startDate,
    endDate,
    search,
  });
  const isSearch = isSearchOperator(operator);
  const items = Array.isArray(values) ? values.filter(({ value }) => value) : [];
  const field = fields.find(f => f.name === name);
  const fieldType = field?.type || 'string';

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSelectOperator = (value: any) => {
    onSelect?.(name, value);
  };

  const handleSelectValue = (key: any) => {
    // Menu onSelect passes the key, which is the value in our case
    const selectedValue = key as string;
    setSelected(selectedValue);
    onChange?.(name, selectedValue);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelected(newValue);
    onChange?.(name, newValue);
  };

  const handleReset = () => {
    setSelected('');
    setSearch('');
  };

  const renderValue = () => {
    return formatValue(selected, type);
  };

  const renderOperatorValue = (value: any) => {
    return operators.find((op: { value: any }) => op.value === value)?.label;
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>{field?.label || name}</div>
      <div className={styles.controls}>
        <div className={styles.grid}>
          <Dropdown
            className={styles.dropdown}
            items={operators.filter(({ type }) => type === fieldType)}
            value={operator}
            renderValue={renderOperatorValue}
            onChange={handleSelectOperator}
          >
            {({ value, label }) => {
              return <Item key={value}>{label}</Item>;
            }}
          </Dropdown>
          {isSearch && (
            <TextField
              className={styles.input}
              value={selected}
              onChange={handleTextChange}
              placeholder="Enter value"
            />
          )}
          {!isSearch && selected && (
            <div className={styles.selected} onClick={handleReset}>
              <span>{formatValue(selected, name)}</span>
              <Icon>
                <Icons.Close />
              </Icon>
            </div>
          )}
          {!isSearch && !selected && (
            <div className={styles.search}>
              <SearchField
                className={styles.searchField}
                value={search}
                placeholder="Search..."
                onChange={e => setSearch(e.target.value)}
                onSearch={handleSearch}
                delay={500}
                onFocus={() => setShowMenu(true)}
                onBlur={() => setTimeout(() => setShowMenu(false), 200)}
              />
              {showMenu && (
                <Menu className={styles.menu} onSelect={handleSelectValue}>
                  {isLoading && (
                    <Item>
                      <Loading icon="dots" position="center" />
                    </Item>
                  )}
                  {!isLoading &&
                    items?.map(({ value }) => {
                      return <Item key={value} id={value}>{formatValue(value, type)}</Item>;
                    })}
                  {!isLoading && items.length === 0 && <Item>No results</Item>}
                </Menu>
              )}
            </div>
          )}
        </div>
        <Button
          className={styles.removeButton}
          variant="quiet"
          onClick={() => onRemove?.(name)}
        >
          <Icon>
            <Icons.Close />
          </Icon>
        </Button>
      </div>
    </div>
  );
}

