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

  // Transform data to include computed columns
  const transformedData = data.map((row: any) => ({
    ...row,
    visitors: row?.visitors?.toLocaleString() || '0',
    visits: row?.visits?.toLocaleString() || '0',
    views: row?.views?.toLocaleString() || '0',
    bounceRate: row?.visits
      ? `${Math.round((Math.min(row.visits, row.bounces || 0) / row.visits) * 100)}%`
      : '0%',
    visitDuration:
      row?.visits && row?.totaltime
        ? `${row.totaltime / row.visits < 0 ? '-' : ''}${formatShortTime(
            Math.abs(Math.floor(row.totaltime / row.visits)),
            ['m', 's'],
            ' ',
          )}`
        : '0s',
  }));

  return (
    <GridTable data={transformedData}>
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
      <GridColumn name="visitors" label={formatMessage(labels.visitors)} />
      <GridColumn name="visits" label={formatMessage(labels.visits)} />
      <GridColumn name="views" label={formatMessage(labels.views)} />
      <GridColumn name="bounceRate" label={formatMessage(labels.bounceRate)} />
      <GridColumn name="visitDuration" label={formatMessage(labels.visitDuration)} />
    </GridTable>
  );
}

