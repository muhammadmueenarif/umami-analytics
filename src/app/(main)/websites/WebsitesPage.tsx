'use client';
import WebsitesHeader from '@/app/(main)/settings/websites/WebsitesHeader';
import WebsitesDataTable from '@/app/(main)/settings/websites/WebsitesDataTable';
import { useTeamUrl } from '@/components/hooks';
import styles from './WebsitesPage.module.css';

export default function WebsitesPage() {
  const { teamId } = useTeamUrl();

  return (
    <div className={styles.websitesPage}>
      <WebsitesHeader teamId={teamId} allowCreate={false} />
      <WebsitesDataTable teamId={teamId} allowEdit={false} allowView={true} showActions={true} />
    </div>
  );
}
