'use client';
import { Icon, Icons, Loading, Text } from 'react-basics';
import Pager from '@/components/common/Pager';
import WebsiteChartList from '../websites/[websiteId]/WebsiteChartList';
import DashboardSettingsButton from '@/app/(main)/dashboard/DashboardSettingsButton';
import DashboardEdit from '@/app/(main)/dashboard/DashboardEdit';
import EmptyPlaceholder from '@/components/common/EmptyPlaceholder';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useMessages, useLocale, useTeamUrl, useWebsites } from '@/components/hooks';
import useDashboard from '@/store/dashboard';
import LinkButton from '@/components/common/LinkButton';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { formatMessage, labels, messages } = useMessages();
  const { teamId, renderTeamUrl } = useTeamUrl();
  const { showCharts, editing, isEdited } = useDashboard();
  const { dir } = useLocale();
  const pageSize = isEdited ? 200 : 10;

  const { result, query, params, setParams } = useWebsites({ teamId }, { pageSize });
  const { page } = params;
  const hasData = !!result?.data?.length;

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  if (query.isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.dashboard}>
      <DashboardHeader />

      {!hasData && (
        <EmptyPlaceholder message={formatMessage(messages.noWebsitesConfigured)}>
          <LinkButton href={renderTeamUrl('/settings')}>
            <Icon rotate={dir === 'rtl' ? 180 : 0}>
              <Icons.ArrowRight />
            </Icon>
            <Text>{formatMessage(messages.goToSettings)}</Text>
          </LinkButton>
        </EmptyPlaceholder>
      )}
      
      {hasData && (
        <>
          {editing && <DashboardEdit teamId={teamId} />}
          {!editing && (
            <>
              <div className={styles.chartsSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Reports overview</h2>
                  <DashboardSettingsButton />
                </div>
                <WebsiteChartList
                  websites={result?.data as any}
                  showCharts={showCharts}
                  limit={pageSize}
                />
                <Pager
                  page={page}
                  pageSize={pageSize}
                  count={result?.count}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
