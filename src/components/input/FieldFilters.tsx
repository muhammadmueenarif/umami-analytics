import { Key } from 'react';
import { subMonths, endOfDay } from 'date-fns';
import { useFields, useMessages } from '@/components/hooks';
import { FilterRecord } from '@/components/input/FilterRecord';
import Empty from '@/components/common/Empty';
import styles from './FieldFilters.module.css';

export interface FieldFiltersProps {
  websiteId: string;
  value?: { name: string; operator: string; value: string }[];
  exclude?: string[];
  onChange?: (data: any) => void;
}

export function FieldFilters({ websiteId, value = [], exclude = [], onChange }: FieldFiltersProps) {
  const { formatMessage, labels } = useMessages();
  const { fields } = useFields();
  const startDate = subMonths(endOfDay(new Date()), 6);
  const endDate = endOfDay(new Date());

  const updateFilter = (name: string, props: Record<string, any>) => {
    onChange?.(value.map(filter => (filter.name === name ? { ...filter, ...props } : filter)));
  };

  const handleAdd = (name: Key) => {
    // Add filter with empty value - user will fill it in
    onChange?.(value.concat({ name: name.toString(), operator: 'eq', value: '' }));
  };

  const handleChange = (name: string, filterValue: string) => {
    updateFilter(name, { value: filterValue });
  };

  const handleSelect = (name: string, operator: string) => {
    updateFilter(name, { operator });
  };

  const handleRemove = (name: string) => {
    onChange?.(value.filter(filter => filter.name !== name));
  };

  const availableFields = fields.filter(({ name }) => !exclude.includes(name));

  return (
    <div className={styles.grid}>
      {/* Left sidebar - Available fields */}
      <div className={styles.sidebar}>
        <div className={styles.fieldList}>
          {availableFields.map(field => {
            const isDisabled = !!value.find(({ name }) => name === field.name);
            return (
              <div
                key={field.name}
                className={isDisabled ? styles.fieldItemDisabled : styles.fieldItem}
                onClick={() => !isDisabled && handleAdd(field.name)}
              >
                {field.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side - Active filters */}
      <div className={styles.content}>
        {value.map((filter, index) => {
          return (
            <FilterRecord
              key={`${filter.name}-${index}`}
              websiteId={websiteId}
              type={filter.name}
              startDate={startDate}
              endDate={endDate}
              {...filter}
              onSelect={handleSelect}
              onRemove={handleRemove}
              onChange={handleChange}
            />
          );
        })}
        {!value.length && <Empty message={formatMessage(labels.noFilters)} />}
      </div>
    </div>
  );
}

