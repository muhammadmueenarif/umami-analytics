import Report from '../[reportId]/Report';
import ReportHeader from '../[reportId]/ReportHeader';
import ReportMenu from '../[reportId]/ReportMenu';
import ReportBody from '../[reportId]/ReportBody';
import BreakdownParameters from './BreakdownParameters';
import BreakdownTable from './BreakdownTable';

const defaultConfig = {
  type: 'breakdown',
  name: '',
  description: '',
  parameters: {
    websiteId: '',
    dateRange: {},
    fields: ['path'],
  },
};

export default function BreakdownReport() {
  return (
    <Report defaultConfig={defaultConfig}>
      <ReportHeader />
      <ReportMenu>
        <BreakdownParameters />
      </ReportMenu>
      <ReportBody>
        <BreakdownTable />
      </ReportBody>
    </Report>
  );
}

