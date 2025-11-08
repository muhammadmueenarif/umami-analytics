'use client';
import { useMemo } from 'react';
import { Icon, Text } from 'react-basics';
import { Eye, Users, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useWebsites, useDateRange, useTimezone } from '@/components/hooks';
import { useApi } from '@/components/hooks/useApi';
import { formatLongNumber } from '@/lib/format';
import styles from './SummaryCards.module.css';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function SummaryCard({ title, value, change, changeLabel, icon, isLoading }: SummaryCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const changeDisplay = change !== undefined ? Math.abs(change) : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>{icon}</div>
        <Text className={styles.cardTitle}>{title}</Text>
      </div>
      <div className={styles.cardContent}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <Text className={styles.cardValue}>{value}</Text>
            {change !== undefined && changeDisplay !== null && (
              <div className={styles.cardChange}>
                {isPositive ? <TrendingUp size={16} className={styles.positive} /> : <TrendingDown size={16} className={styles.negative} />}
                <Text className={isPositive ? styles.positive : styles.negative}>
                  {changeLabel || `${changeDisplay.toFixed(1)}%`}
                </Text>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function SummaryCards({ teamId }: { teamId?: string }) {
  const { result: websites } = useWebsites({ teamId }, { pageSize: 100 });
  const { dateRange } = useDateRange();
  const { get, useQuery } = useApi();
  const { toUtc } = useTimezone();
  const websiteIds = websites?.data?.map((w: any) => w.id) || [];
  const { startDate, endDate } = dateRange;

  // Fetch stats for all websites using a single query
  const { data: allStatsData, isLoading } = useQuery({
    queryKey: ['dashboard:stats', { websiteIds, startDate, endDate }],
    queryFn: async () => {
      if (!websiteIds.length) return [];
      const params = {
        startAt: +toUtc(startDate),
        endAt: +toUtc(endDate),
      };
      const promises = websiteIds.map((websiteId: string) =>
        get(`/websites/${websiteId}/stats`, params).catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    enabled: websiteIds.length > 0 && !!startDate && !!endDate,
  });

  const allStats = allStatsData || [];

  const totals = useMemo(() => {
    if (!allStats.length) {
      return {
        pageviews: { value: 0, prev: 0 },
        visitors: { value: 0, prev: 0 },
        visits: { value: 0, prev: 0 },
        bounces: { value: 0, prev: 0 },
      };
    }

    return allStats.reduce(
      (acc, stat) => {
        return {
          pageviews: {
            value: acc.pageviews.value + (stat.pageviews?.value || 0),
            prev: acc.pageviews.prev + (stat.pageviews?.prev || 0),
          },
          visitors: {
            value: acc.visitors.value + (stat.visitors?.value || 0),
            prev: acc.visitors.prev + (stat.visitors?.prev || 0),
          },
          visits: {
            value: acc.visits.value + (stat.visits?.value || 0),
            prev: acc.visits.prev + (stat.visits?.prev || 0),
          },
          bounces: {
            value: acc.bounces.value + (stat.bounces?.value || 0),
            prev: acc.bounces.prev + (stat.bounces?.prev || 0),
          },
        };
      },
      {
        pageviews: { value: 0, prev: 0 },
        visitors: { value: 0, prev: 0 },
        visits: { value: 0, prev: 0 },
        bounces: { value: 0, prev: 0 },
      },
    );
  }, [allStats]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const pageviewsChange = calculateChange(totals.pageviews.value, totals.pageviews.prev);
  const visitorsChange = calculateChange(totals.visitors.value, totals.visitors.prev);
  const visitsChange = calculateChange(totals.visits.value, totals.visits.prev);
  const bounceRate =
    totals.visits.value > 0
      ? (Math.min(totals.visits.value, totals.bounces.value) / totals.visits.value) * 100
      : 0;
  const bounceRatePrev =
    totals.visits.prev > 0
      ? (Math.min(totals.visits.prev, totals.bounces.prev) / totals.visits.prev) * 100
      : 0;
  const bounceRateChange = bounceRate - bounceRatePrev;

  return (
    <div className={styles.container}>
      <SummaryCard
        title="Pageviews"
        value={formatLongNumber(totals.pageviews.value)}
        change={pageviewsChange}
        icon={<Eye size={20} />}
        isLoading={isLoading}
      />
      <SummaryCard
        title="Visitors"
        value={formatLongNumber(totals.visitors.value)}
        change={visitorsChange}
        icon={<Users size={20} />}
        isLoading={isLoading}
      />
      <SummaryCard
        title="Sessions"
        value={formatLongNumber(totals.visits.value)}
        change={visitsChange}
        icon={<BarChart3 size={20} />}
        isLoading={isLoading}
      />
      <SummaryCard
        title="Bounce Rate"
        value={`${Math.round(bounceRate)}%`}
        change={bounceRateChange}
        icon={<TrendingUp size={20} />}
        isLoading={isLoading}
        reverseColors={true}
      />
    </div>
  );
}

export default SummaryCards;

