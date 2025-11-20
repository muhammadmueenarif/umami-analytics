import { Button, Icon, Icons, Modal, ModalTrigger, Text } from 'react-basics';
import { FilterEditForm } from '@/components/input/FilterEditForm';
import { useMessages } from '@/components/hooks';
import styles from './WebsiteFilterButton.module.css';

export function WebsiteFilterButton({
  websiteId,
  className,
  position = 'bottom',
  alignment = 'end',
  showText = true,
}: {
  websiteId: string;
  className?: string;
  position?: 'bottom' | 'top' | 'left' | 'right';
  alignment?: 'end' | 'center' | 'start';
  showText?: boolean;
}) {
  const { formatMessage, labels } = useMessages();

  return (
    <ModalTrigger className={className}>
      <Button className={styles.button} variant="quiet">
        <Icon>
          <Icons.Plus />
        </Icon>
        {showText && <Text>{formatMessage(labels.filter)}</Text>}
      </Button>
      <Modal title={formatMessage(labels.filter)}>
        {(close: () => void) => {
          return <FilterEditForm websiteId={websiteId} onClose={close} />;
        }}
      </Modal>
    </ModalTrigger>
  );
}

export default WebsiteFilterButton;
