import { Menu, Item, Form, FormRow } from 'react-basics';
import { useMessages } from '@/components/hooks';
import styles from './FieldSelectForm.module.css';
import { Key } from 'react';

export interface FieldSelectFormProps {
  fields?: any[];
  onSelect?: (key: any) => void;
  showType?: boolean;
}

export default function FieldSelectForm({
  fields = [],
  onSelect,
  showType = true,
}: FieldSelectFormProps) {
  const { formatMessage, labels } = useMessages();

  const handleSelect = (key: any) => {
    if (onSelect && fields[key as any]) {
      onSelect(fields[key as any]);
    }
  };

  return (
    <Form>
      <FormRow label={formatMessage(labels.fields)}>
        <Menu className={styles.menu} onSelect={handleSelect}>
          {fields.map(({ name, label, type }: any, index: Key) => {
            return (
              <Item key={index} className={styles.item}>
                <div>{label || name}</div>
                {showType && type && <div className={styles.type}>{type}</div>}
              </Item>
            );
          })}
        </Menu>
      </FormRow>
    </Form>
  );
}
