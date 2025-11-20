import { Lightbulb, Funnel, Link2, Tag, Target, Infinity, Coins, Sparkles, Plus, LayoutGrid } from 'lucide-react';
import { useMessages, useTeamUrl } from '@/components/hooks';
import PageHeader from '@/components/layout/PageHeader';
import Link from 'next/link';
import { Button, Text } from 'react-basics';
import styles from './ReportTemplates.module.css';

export function ReportTemplates({ showHeader = true }: { showHeader?: boolean }) {
  const { formatMessage, labels } = useMessages();
  const { renderTeamUrl } = useTeamUrl();

  const reports = [
    {
      title: formatMessage(labels.insights),
      description: formatMessage(labels.insightsDescription),
      url: renderTeamUrl('/reports/insights'),
      icon: <Lightbulb size={24} />,
    },
    {
      title: formatMessage(labels.breakdown),
      description: formatMessage(labels.breakdownDescription),
      url: renderTeamUrl('/reports/breakdown'),
      icon: <LayoutGrid size={24} />,
    },
    {
      title: formatMessage(labels.funnel),
      description: formatMessage(labels.funnelDescription),
      url: renderTeamUrl('/reports/funnel'),
      icon: <Funnel size={24} />,
    },
    {
      title: formatMessage(labels.retention),
      description: formatMessage(labels.retentionDescription),
      url: renderTeamUrl('/reports/retention'),
      icon: <Link2 size={24} />,
    },
    {
      title: formatMessage(labels.utm),
      description: formatMessage(labels.utmDescription),
      url: renderTeamUrl('/reports/utm'),
      icon: <Tag size={24} />,
    },
    {
      title: formatMessage(labels.goals),
      description: formatMessage(labels.goalsDescription),
      url: renderTeamUrl('/reports/goals'),
      icon: <Target size={24} />,
    },
    {
      title: formatMessage(labels.journey),
      description: formatMessage(labels.journeyDescription),
      url: renderTeamUrl('/reports/journey'),
      icon: <Infinity size={24} />,
    },
    {
      title: formatMessage(labels.revenue),
      description: formatMessage(labels.revenueDescription),
      url: renderTeamUrl('/reports/revenue'),
      icon: <Coins size={24} />,
    },
    {
      title: formatMessage(labels.attribution),
      description: formatMessage(labels.attributionDescription),
      url: renderTeamUrl('/reports/attribution'),
      icon: <Sparkles size={24} />,
    },
  ];

  return (
    <>
      {showHeader && <PageHeader title={formatMessage(labels.reports)} />}
      <div className={styles.reports}>
        {reports.map(({ title, description, url, icon }) => {
          return (
            <ReportItem key={title} icon={icon} title={title} description={description} url={url} />
          );
        })}
      </div>
    </>
  );
}

function ReportItem({ title, description, url, icon }) {
  const { formatMessage, labels } = useMessages();

  return (
    <div className={styles.report}>
      <div className={styles.title}>
        {icon}
        <Text>{title}</Text>
      </div>
      <div className={styles.description}>{description}</div>
      <div className={styles.buttons}>
        <Link href={url}>
          <Button variant="primary" className={styles.createButton}>
            <Plus size={18} />
            <Text>{formatMessage(labels.create)}</Text>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ReportTemplates;
