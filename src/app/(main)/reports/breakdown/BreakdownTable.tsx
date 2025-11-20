import { useContext } from 'react';
import { Loading, GridTable, GridColumn } from 'react-basics';
import { ReportContext } from '../[reportId]/Report';
import { useFormat, useFields, useMessages } from '@/components/hooks';
import { formatShortTime } from '@/lib/format';

export default function BreakdownTable() {
  const { report } = useContext(ReportContext);
  const { formatMessage, labels } = useMessages();
  const { formatValue } = useFormat();
  const { fields } = useFields();

  const {
    data,
    parameters: { fields: selectedFields = ['path'] },
  } = report || {};

  if (!data || !Array.isArray(data)) {
    return <Loading icon="dots" />;
  }

  return (
    <GridTable data={data}>
      {selectedFields.map((fieldName: string) => {
        const field = fields.find((f: any) => f.name === fieldName);
        return (
          <GridColumn
            key={fieldName}
            name={fieldName}
            label={field?.label || fieldName}
          />
        );
      })}
      <GridColumn
        name="visitors"
        label={formatMessage(labels.visitors)}
        render={(row: any) => row?.visitors?.toLocaleString() || 0}
      />
      <GridColumn
        name="visits"
        label={formatMessage(labels.visits)}
        render={(row: any) => row?.visits?.toLocaleString() || 0}
      />
      <GridColumn
        name="views"
        label={formatMessage(labels.views)}
        render={(row: any) => row?.views?.toLocaleString() || 0}
      />
      <GridColumn
        name="bounceRate"
        label={formatMessage(labels.bounceRate)}
        render={(row: any) => {
          if (!row?.visits) return '0%';
          const rate = (Math.min(row.visits, row.bounces || 0) / row.visits) * 100;
          return `${Math.round(rate)}%`;
        }}
      />
      <GridColumn
        name="visitDuration"
        label={formatMessage(labels.visitDuration)}
        render={(row: any) => {
          if (!row?.visits || !row?.totaltime) return '0s';
          const duration = row.totaltime / row.visits;
          return `${duration < 0 ? '-' : ''}${formatShortTime(Math.abs(Math.floor(duration)), ['m', 's'], ' ')}`;
        }}
      />
    </GridTable>
  );
}

