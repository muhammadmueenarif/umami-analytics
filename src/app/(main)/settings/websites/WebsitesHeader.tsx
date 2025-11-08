import { useMessages } from '@/components/hooks';
import WebsiteAddButton from './WebsiteAddButton';
import styles from './WebsitesHeader.module.css';

export interface WebsitesHeaderProps {
  teamId?: string;
  allowCreate?: boolean;
}

export function WebsitesHeader({ teamId, allowCreate = true }: WebsitesHeaderProps) {
  const { formatMessage, labels } = useMessages();

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{formatMessage(labels.websites)}</h1>
      {allowCreate && <WebsiteAddButton teamId={teamId} />}
    </div>
  );
}

export default WebsitesHeader;
