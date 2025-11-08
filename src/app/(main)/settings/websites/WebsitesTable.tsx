import { ReactNode } from 'react';
import { Edit, ArrowRight } from 'lucide-react';
import { useMessages, useTeamUrl } from '@/components/hooks';
import Link from 'next/link';
import styles from './WebsitesTable.module.css';

export interface WebsitesTableProps {
  data: any[];
  showActions?: boolean;
  allowEdit?: boolean;
  allowView?: boolean;
  teamId?: string;
  children?: ReactNode;
}

export function WebsitesTable({
  data = [],
  showActions,
  allowEdit,
  allowView,
  children,
}: WebsitesTableProps) {
  const { formatMessage, labels } = useMessages();
  const { renderTeamUrl } = useTeamUrl();

  if (!data?.length) {
    return children;
  }

  return (
    <div className={styles.listContainer}>
      {data.map((row) => {
        const { id: websiteId, name, domain } = row;
        return (
          <div key={websiteId} className={styles.listItem}>
            <div className={styles.itemContent}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{name || '-'}</div>
                <div className={styles.itemDomain}>{domain || '-'}</div>
              </div>
              {showActions && (
                <div className={styles.itemActions}>
                  {allowEdit && (
                    <Link
                      href={renderTeamUrl(`/settings/websites/${websiteId}`)}
                      className={styles.actionButton}
                      data-test="link-button-edit"
                    >
                      <Edit size={16} />
                      <span>{formatMessage(labels.edit)}</span>
                    </Link>
                  )}
                  {allowView && (
                    <Link
                      href={renderTeamUrl(`/websites/${websiteId}`)}
                      className={styles.actionButton}
                    >
                      <ArrowRight size={16} />
                      <span>{formatMessage(labels.view)}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WebsitesTable;
