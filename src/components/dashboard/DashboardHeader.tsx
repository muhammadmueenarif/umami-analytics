'use client';
import { Button, Text } from 'react-basics';
import { useRouter } from 'next/navigation';
import { Download, Plus } from 'lucide-react';
import { useLogin, useMessages, useTeamUrl, useWebsites, useDateRange, useTimezone } from '@/components/hooks';
import { useState, useMemo } from 'react';
import { useApi } from '@/components/hooks/useApi';
import { useSearchParams } from 'next/navigation';
import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  const { user } = useLogin();
  const { formatMessage, labels } = useMessages();
  const { renderTeamUrl } = useTeamUrl();
  const router = useRouter();
  const { result: websites } = useWebsites({}, { pageSize: 1 });
  const firstWebsiteId = websites?.data?.[0]?.id;
  const [isExporting, setIsExporting] = useState(false);
  const { get } = useApi();
  const { dateRange } = useDateRange(firstWebsiteId);
  const { timezone, toUtc } = useTimezone();
  const searchParams = useSearchParams();
  
  // Build params object only when we have a websiteId
  const params = useMemo(() => {
    if (!firstWebsiteId) return {};
    const { startDate, endDate, unit } = dateRange;
    return {
      startAt: +toUtc(startDate),
      endAt: +toUtc(endDate),
      unit,
      timezone,
    };
  }, [firstWebsiteId, dateRange, toUtc, timezone]);

  const handleCreateReport = () => {
    router.push(renderTeamUrl('/reports/create'));
  };

  const handleExport = async () => {
    if (!firstWebsiteId) return;
    
    setIsExporting(true);
    try {
      const { zip } = await get(`/websites/${firstWebsiteId}/export`, { ...params, ...searchParams });

      const binary = atob(zip);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'umami-export.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.username || 'User'}</h1>
          <p className={styles.subtitle}>Measure your advertising ROI and report website traffic.</p>
        </div>
        <div className={styles.actions}>
          <Button 
            variant="secondary" 
            className={styles.actionButton}
            onClick={handleExport}
            disabled={!firstWebsiteId || isExporting}
          >
            <Download size={18} />
            <Text>{isExporting ? 'Exporting...' : 'Export data'}</Text>
          </Button>
          <Button 
            variant="primary" 
            className={styles.actionButton}
            onClick={handleCreateReport}
          >
            <Plus size={18} />
            <Text>Create report</Text>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;

