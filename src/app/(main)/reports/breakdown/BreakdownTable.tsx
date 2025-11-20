import { useContext } from 'react';
import { Loading } from 'react-basics';
import { ReportContext } from '../[reportId]/Report';
import DataTable from '@/components/common/DataTable';
import { useFormat, useMessages } from '@/components/hooks';
import { formatShortTime } from '@/lib/format';

export default function BreakdownTable() {
  const { report } = useContext(ReportContext);
  const { formatMessage, labels } = useMessages();
  const { formatValue } = useFormat();

  const {
    data,
    parameters: { fields: selectedFields = ['path'] },
  } = report || {};

  if (!data) {
    return <Loading icon="dots" />;
  }

  const columns = [
    ...selectedFields.map((field: string) => ({
      key: field,
      label: field.charAt(0).toUpperCase() + field.slice(1),
      render: (row: any) => formatValue(row[field], field),
    })),
    {
      key: 'visitors',
      label: formatMessage(labels.visitors),
      render: (row: any) => row?.visitors?.toLocaleString() || 0,
      className: 'align-right',
    },
    {
      key: 'visits',
      label: formatMessage(labels.visits),
      render: (row: any) => row?.visits?.toLocaleString() || 0,
      className: 'align-right',
    },
    {
      key: 'views',
      label: formatMessage(labels.views),
      render: (row: any) => row?.views?.toLocaleString() || 0,
      className: 'align-right',
    },
    {
      key: 'bounceRate',
      label: formatMessage(labels.bounceRate),
      render: (row: any) => {
        const rate = (Math.min(row?.visits, row?.bounces) / row?.visits) * 100;
        return `${Math.round(rate)}%`;
      },
      className: 'align-right',
    },
    {
      key: 'visitDuration',
      label: formatMessage(labels.visitDuration),
      render: (row: any) => {
        const duration = row?.totaltime / row?.visits;
        return `${duration < 0 ? '-' : ''}${formatShortTime(Math.abs(Math.floor(duration)), ['m', 's'], ' ')}`;
      },
      className: 'align-right',
    },
  ];

  return <DataTable data={data} columns={columns} />;
}

