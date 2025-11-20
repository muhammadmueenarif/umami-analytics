import { Metadata } from 'next';
import BreakdownReportPage from './BreakdownReportPage';

export default function () {
  return <BreakdownReportPage />;
}

export const metadata: Metadata = {
  title: 'Breakdown Report',
};

