import { Plus } from 'lucide-react';
import { useMessages, useModified } from '@/components/hooks';
import { Button, Modal, ModalTrigger, Text, useToasts } from 'react-basics';
import WebsiteAddForm from './WebsiteAddForm';
import styles from './WebsiteAddButton.module.css';

export function WebsiteAddButton({ teamId, onSave }: { teamId?: string; onSave?: () => void }) {
  const { formatMessage, labels, messages } = useMessages();
  const { showToast } = useToasts();
  const { touch } = useModified();

  const handleSave = async () => {
    showToast({ message: formatMessage(messages.saved), variant: 'success' });
    touch('websites');
    onSave?.();
  };

  return (
    <ModalTrigger>
      <Button data-test="button-website-add" variant="primary" className={styles.addButton}>
        <Plus size={18} />
        <Text>{formatMessage(labels.addWebsite)}</Text>
      </Button>
      <Modal title={formatMessage(labels.addWebsite)}>
        {(close: () => void) => (
          <WebsiteAddForm teamId={teamId} onSave={handleSave} onClose={close} />
        )}
      </Modal>
    </ModalTrigger>
  );
}

export default WebsiteAddButton;
