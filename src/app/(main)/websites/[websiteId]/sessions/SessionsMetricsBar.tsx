import { useMessages } from '@/components/hooks';
import useWebsiteSessionStats from '@/components/hooks/queries/useWebsiteSessionStats';
import WebsiteDateFilter from '@/components/input/WebsiteDateFilter';
import MetricCard from '@/components/metrics/MetricCard';
import MetricsBar from '@/components/metrics/MetricsBar';
import { formatLongNumber } from '@/lib/format';
import styles from './SessionsMetricsBar.module.css';

export function SessionsMetricsBar({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const { data, isLoading, isFetched, error } = useWebsiteSessionStats(websiteId);

  return (
    <div className={styles.container}>
      <div className={styles.metricsSection}>
        <MetricsBar isLoading={isLoading} isFetched={isFetched} error={error}>
          <MetricCard
            value={data?.visitors?.value}
            label={formatMessage(labels.visitors)}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={data?.visits?.value}
            label={formatMessage(labels.visits)}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={data?.pageviews?.value}
            label={formatMessage(labels.views)}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={data?.countries?.value}
            label={formatMessage(labels.countries)}
            formatValue={formatLongNumber}
          />
        </MetricsBar>
      </div>
      <div className={styles.dateFilterSection}>
        <WebsiteDateFilter websiteId={websiteId} />
      </div>
    </div>
  );
}

export default SessionsMetricsBar;
