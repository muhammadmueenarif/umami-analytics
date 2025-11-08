import { Text } from 'react-basics';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMessages, useLogin, useTeamUrl } from '@/components/hooks';
import { REPORT_TYPES } from '@/lib/constants';
import ReportDeleteButton from './ReportDeleteButton';
import styles from './ReportsTable.module.css';

export function ReportsTable({ data = [], showDomain }: { data: any[]; showDomain?: boolean }) {
  const { formatMessage, labels } = useMessages();
  const { user } = useLogin();
  const { renderTeamUrl } = useTeamUrl();

  if (!data?.length) {
    return (
      <div className={styles.empty}>
        <Text>{formatMessage(labels.noReportsFound)}</Text>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {data.map((row) => {
        const { id, name, description, type, userId, website } = row;
        const canDelete = user.id === userId || user.id === website?.userId;
        
        return (
          <div key={id} className={styles.listItem}>
            <div className={styles.itemContent}>
              <div className={styles.itemMain}>
                <div className={styles.itemName}>{name}</div>
                {description && (
                  <div className={styles.itemDescription}>{description}</div>
                )}
                <div className={styles.itemMeta}>
                  <span className={styles.itemType}>
                    {formatMessage(
                      labels[Object.keys(REPORT_TYPES).find(key => REPORT_TYPES[key] === type)],
                    )}
                  </span>
                  {showDomain && website?.domain && (
                    <>
                      <span className={styles.itemSeparator}>•</span>
                      <span className={styles.itemDomain}>{website.domain}</span>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.itemActions}>
                {canDelete && <ReportDeleteButton reportId={id} reportName={name} />}
                <Link href={renderTeamUrl(`/reports/${id}`)} className={styles.viewButton}>
                  <ArrowRight size={16} />
                  <Text>{formatMessage(labels.view)}</Text>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReportsTable;
