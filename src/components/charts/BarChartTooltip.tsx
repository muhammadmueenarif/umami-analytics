import { useLocale } from '@/components/hooks';
import { formatDate } from '@/lib/date';
import { formatLongCurrency, formatLongNumber } from '@/lib/format';
import { Flexbox, StatusLight } from 'react-basics';
import { CHART_COLORS } from '@/lib/constants';

const formats = {
  millisecond: 'T',
  second: 'pp',
  minute: 'p',
  hour: 'p - PP',
  day: 'PPPP',
  week: 'PPPP',
  month: 'LLLL yyyy',
  quarter: 'qqq',
  year: 'yyyy',
};

export default function BarChartTooltip({ tooltip, unit, currency, active, payload, label }: any) {
  const { locale } = useLocale();
  
  // Handle Recharts format
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    if (!data || data.value === undefined) return null;
    
    const value = data.value;
    const color = data.color || CHART_COLORS[0];
    const datasetLabel = data.dataKey || data.name || '';
    const dateValue = data.payload?.name || label;

    return (
      <div style={{ 
        background: 'var(--base50)', 
        padding: '14px 18px', 
        border: '1px solid var(--base300)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        minWidth: '180px'
      }}>
        <Flexbox direction="column" gap={12}>
          {unit && dateValue && (
            <div style={{ 
              fontSize: '11px', 
              opacity: 0.7,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {formatDate(new Date(dateValue), formats[unit] || 'PP', locale)}
            </div>
          )}
          <div>
            <StatusLight color={color}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                {currency
                  ? formatLongCurrency(value, currency)
                  : formatLongNumber(value)}
              </span>
              <span style={{ marginLeft: '6px', opacity: 0.8, fontSize: '13px' }}>
                {datasetLabel}
              </span>
            </StatusLight>
          </div>
        </Flexbox>
      </div>
    );
  }

  // Handle legacy format (if tooltip prop is provided)
  if (tooltip && tooltip.dataPoints && tooltip.dataPoints.length > 0) {
    const { labelColors, dataPoints } = tooltip;
    return (
      <div style={{ 
        background: 'var(--base50)', 
        padding: '14px 18px', 
        border: '1px solid var(--base300)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        minWidth: '180px'
      }}>
        <Flexbox direction="column" gap={12}>
          <div style={{ 
            fontSize: '11px', 
            opacity: 0.7,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {formatDate(new Date(dataPoints[0].raw.d || dataPoints[0].raw.x), formats[unit], locale)}
          </div>
          <div>
            <StatusLight color={labelColors?.[0]?.backgroundColor}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                {currency
                  ? formatLongCurrency(dataPoints[0].raw.y, currency)
                  : formatLongNumber(dataPoints[0].raw.y)}
              </span>
              <span style={{ marginLeft: '6px', opacity: 0.8, fontSize: '13px' }}>
                {dataPoints[0].dataset.label}
              </span>
            </StatusLight>
          </div>
        </Flexbox>
      </div>
    );
  }

  return null;
}
