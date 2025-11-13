import { formatDate } from '@/lib/date';
import { formatLongNumber } from '@/lib/format';

export function renderNumberLabels(label: string) {
  return +label > 1000 ? formatLongNumber(+label) : label;
}

export function renderDateLabels(unit: string, locale: string) {
  return (label: string, index: number, values: any[]) => {
    // Handle different data formats - Recharts passes the label directly, Chart.js passes values array
    let dateValue: string | number | Date;
    
    if (values && values[index] && values[index].value !== undefined) {
      dateValue = values[index].value;
    } else if (values && values[index] && values[index].name) {
      dateValue = values[index].name;
    } else {
      dateValue = label;
    }
    
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) {
      return label; // Return original label if date is invalid
    }

    switch (unit) {
      case 'minute':
        return formatDate(d, 'h:mm', locale);
      case 'hour':
        return formatDate(d, 'p', locale);
      case 'day':
        return formatDate(d, 'PP', locale).replace(/\W*20\d{2}\W*/, ''); // Remove year
      case 'month':
        return formatDate(d, 'MMM', locale);
      case 'year':
        return formatDate(d, 'yyyy', locale);
      default:
        return label;
    }
  };
}
