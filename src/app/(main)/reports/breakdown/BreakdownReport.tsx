import Report from '../[reportId]/Report';
import ReportHeader from '../[reportId]/ReportHeader';
import ReportMenu from '../[reportId]/ReportMenu';
import ReportBody from '../[reportId]/ReportBody';
import BreakdownParameters from './BreakdownParameters';
import BreakdownTable from './BreakdownTable';
import { LayoutGrid } from 'lucide-react';
import { REPORT_TYPES } from '@/lib/constants';

const defaultParameters = {
  type: REPORT_TYPES.breakdown,
  parameters: { fields: ['path'] },
};

export default function BreakdownReport({ reportId }: { reportId?: string }) {
  return (
    <Report reportId={reportId} defaultParameters={defaultParameters}>
      <ReportHeader icon={<LayoutGrid size={24} />} />
      <ReportMenu>
        <BreakdownParameters />
      </ReportMenu>
      <ReportBody>
        <BreakdownTable />
      </ReportBody>
    </Report>
  );
}

