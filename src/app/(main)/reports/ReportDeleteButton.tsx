import { Trash2 } from 'lucide-react';
import { Button, Modal, ModalTrigger, Text } from 'react-basics';
import { useApi, useMessages, useModified } from '@/components/hooks';
import ConfirmationForm from '@/components/common/ConfirmationForm';
import styles from './ReportDeleteButton.module.css';

export function ReportDeleteButton({
  reportId,
  reportName,
  onDelete,
}: {
  reportId: string;
  reportName: string;
  onDelete?: () => void;
}) {
  const { formatMessage, labels, messages } = useMessages();
  const { del, useMutation } = useApi();
  const { mutate, isPending, error } = useMutation({
    mutationFn: reportId => del(`/reports/${reportId}`),
  });
  const { touch } = useModified();

  const handleConfirm = (close: () => void) => {
    mutate(reportId as any, {
      onSuccess: () => {
        touch('reports');
        onDelete?.();
        close();
      },
    });
  };

  return (
    <ModalTrigger>
      <Button variant="secondary" className={styles.deleteButton}>
        <Trash2 size={16} />
        <Text>{formatMessage(labels.delete)}</Text>
      </Button>
      <Modal title={formatMessage(labels.deleteReport)}>
        {(close: () => void) => (
          <ConfirmationForm
            message={formatMessage(messages.confirmDelete, {
              target: <b key={messages.confirmDelete.id}>{reportName}</b>,
            })}
            isLoading={isPending}
            error={error}
            onConfirm={handleConfirm.bind(null, close)}
            onClose={close}
            buttonLabel={formatMessage(labels.delete)}
          />
        )}
      </Modal>
    </ModalTrigger>
  );
}

export default ReportDeleteButton;
