'use client';
import WebsiteHeader from '../WebsiteHeader';
import SessionsDataTable from './SessionsDataTable';
import SessionsMetricsBar from './SessionsMetricsBar';
import SessionProperties from './SessionProperties';
import WorldMap from '@/components/metrics/WorldMap';
import { GridRow } from '@/components/layout/Grid';
import { Item, Tabs } from 'react-basics';
import { useState } from 'react';
import { useMessages } from '@/components/hooks';
import SessionsWeekly from './SessionsWeekly';
import styles from './SessionsPage.module.css';

export function SessionsPage({ websiteId }) {
  const [tab, setTab] = useState('activity');
  const { formatMessage, labels } = useMessages();

  return (
    <div className={styles.page}>
      <WebsiteHeader websiteId={websiteId} />
      <div className={styles.content}>
        <SessionsMetricsBar websiteId={websiteId} />
        <GridRow columns="two-one">
          <WorldMap websiteId={websiteId} />
          <SessionsWeekly websiteId={websiteId} />
        </GridRow>
        <Tabs selectedKey={tab} onSelect={(value: any) => setTab(value)} style={{ marginBottom: 30 }}>
          <Item key="activity">{formatMessage(labels.activity)}</Item>
          <Item key="properties">{formatMessage(labels.properties)}</Item>
        </Tabs>
        {tab === 'activity' && <SessionsDataTable websiteId={websiteId} />}
        {tab === 'properties' && <SessionProperties websiteId={websiteId} />}
      </div>
    </div>
  );
}

export default SessionsPage;
