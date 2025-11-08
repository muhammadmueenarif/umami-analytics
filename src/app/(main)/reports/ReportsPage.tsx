'use client';
import { Metadata } from 'next';
import ReportsHeader from './ReportsHeader';
import ReportsDataTable from './ReportsDataTable';
import { useTeamUrl } from '@/components/hooks';
import styles from './ReportsPage.module.css';

export default function ReportsPage() {
  const { teamId } = useTeamUrl();

  return (
    <div className={styles.reportsPage}>
      <ReportsHeader />
      <ReportsDataTable teamId={teamId} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Reports',
};
