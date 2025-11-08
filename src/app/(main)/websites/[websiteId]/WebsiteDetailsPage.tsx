'use client';
import { usePathname } from 'next/navigation';
import FilterTags from '@/components/metrics/FilterTags';
import { useNavigation } from '@/components/hooks';
import WebsiteChart from './WebsiteChart';
import WebsiteExpandedView from './WebsiteExpandedView';
import WebsiteHeader from './WebsiteHeader';
import WebsiteMetricsBar from './WebsiteMetricsBar';
import WebsiteTableView from './WebsiteTableView';
import { FILTER_COLUMNS, FILTER_GROUPS } from '@/lib/constants';
import styles from './WebsiteDetailsPage.module.css';

export default function WebsiteDetailsPage({ websiteId }: { websiteId: string }) {
  const pathname = usePathname();
  const { query } = useNavigation();

  const showLinks = !pathname.includes('/share/');
  const { view } = query;

  const params = Object.keys(query).reduce((obj, key) => {
    if (FILTER_COLUMNS[key] || FILTER_GROUPS[key]) {
      obj[key] = query[key];
    }
    return obj;
  }, {});

  return (
    <div className={styles.page}>
      <WebsiteHeader websiteId={websiteId} showLinks={showLinks} />
      <div className={styles.content}>
        <FilterTags websiteId={websiteId} params={params} />
        <WebsiteMetricsBar websiteId={websiteId} showFilter={true} showChange={true} sticky={false} />
        <WebsiteChart websiteId={websiteId} />
        {!view && <WebsiteTableView websiteId={websiteId} />}
        {view && <WebsiteExpandedView websiteId={websiteId} />}
      </div>
    </div>
  );
}
