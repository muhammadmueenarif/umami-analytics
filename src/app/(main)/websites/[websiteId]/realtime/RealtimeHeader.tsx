import MetricCard from '@/components/metrics/MetricCard';
import MetricsBar from '@/components/metrics/MetricsBar';
import { useMessages } from '@/components/hooks';
import { RealtimeData } from '@/lib/types';
import { formatLongNumber } from '@/lib/format';
import styles from './RealtimeHeader.module.css';

export function RealtimeHeader({ data }: { data: RealtimeData }) {
  const { formatMessage, labels } = useMessages();
  const { totals }: any = data || {};

  return (
    <div className={styles.header}>
      <MetricsBar isLoading={false} isFetched={true} error={null}>
        <MetricCard
          label={formatMessage(labels.views)}
          value={totals?.views || 0}
          formatValue={formatLongNumber}
        />
        <MetricCard
          label={formatMessage(labels.visitors)}
          value={totals?.visitors || 0}
          formatValue={formatLongNumber}
        />
        <MetricCard
          label={formatMessage(labels.events)}
          value={totals?.events || 0}
          formatValue={formatLongNumber}
        />
        <MetricCard
          label={formatMessage(labels.countries)}
          value={totals?.countries || 0}
          formatValue={formatLongNumber}
        />
      </MetricsBar>
    </div>
  );
}

export default RealtimeHeader;
