import { Plus } from 'lucide-react';
import { Button, Text } from 'react-basics';
import { useLogin, useMessages, useTeamUrl } from '@/components/hooks';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/lib/constants';
import styles from './ReportsHeader.module.css';

export function ReportsHeader() {
  const { formatMessage, labels } = useMessages();
  const { renderTeamUrl } = useTeamUrl();
  const { user } = useLogin();
  const router = useRouter();
  const canEdit = user.role !== ROLES.viewOnly;

  const handleCreateReport = () => {
    router.push(renderTeamUrl('/reports/create'));
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{formatMessage(labels.reports)}</h1>
      {canEdit && (
        <Button variant="primary" onClick={handleCreateReport} className={styles.createButton}>
          <Plus size={18} />
          <Text>{formatMessage(labels.createReport)}</Text>
        </Button>
      )}
    </div>
  );
}

export default ReportsHeader;
