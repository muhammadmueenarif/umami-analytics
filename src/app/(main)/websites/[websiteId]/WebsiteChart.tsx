import { useMemo } from 'react';
import PageviewsChart from '@/components/metrics/PageviewsChart';
import useWebsitePageviews from '@/components/hooks/queries/useWebsitePageviews';
import { useDateRange } from '@/components/hooks';
import styles from './WebsiteChart.module.css';

export function WebsiteChart({
  websiteId,
  compareMode = false,
}: {
  websiteId: string;
  compareMode?: boolean;
}) {
  const { dateRange, dateCompare } = useDateRange(websiteId);
  const { startDate, endDate, unit, value } = dateRange;
  const { data, isLoading } = useWebsitePageviews(websiteId, compareMode ? dateCompare : undefined);
  const { pageviews, sessions, compare } = (data || {}) as any;

  const chartData = useMemo(() => {
    if (!data || !pageviews || !sessions) {
      return { pageviews: [], sessions: [] };
    }
    
    const result = {
      pageviews: Array.isArray(pageviews) ? pageviews : [],
      sessions: Array.isArray(sessions) ? sessions : [],
    };

    if (compare && Array.isArray(compare.pageviews) && Array.isArray(compare.sessions)) {
      result['compare'] = {
        pageviews: result.pageviews.map(({ x }, i) => ({
          x,
          y: compare.pageviews[i]?.y || 0,
          d: compare.pageviews[i]?.x,
        })),
        sessions: result.sessions.map(({ x }, i) => ({
          x,
          y: compare.sessions[i]?.y || 0,
          d: compare.sessions[i]?.x,
        })),
      };
    }

    return result;
  }, [data, pageviews, sessions, compare, startDate, endDate, unit]);

  return (
    <div className={styles.chartWrapper}>
      <PageviewsChart
        data={chartData}
        minDate={startDate.toISOString()}
        maxDate={endDate.toISOString()}
        unit={unit}
        isLoading={isLoading}
        isAllTime={value === 'all'}
      />
    </div>
  );
}

export default WebsiteChart;
