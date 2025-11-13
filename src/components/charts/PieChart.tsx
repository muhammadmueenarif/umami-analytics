import { ChartProps } from '@/components/charts/Chart';
import { useState } from 'react';
import { StatusLight } from 'react-basics';
import { formatLongNumber } from '@/lib/format';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/lib/constants';
import { useTheme } from '@/components/hooks';
import classNames from 'classnames';
import styles from './Chart.module.css';

export interface PieChartProps extends ChartProps {
  type?: 'doughnut' | 'pie';
}

// Convert Chart.js pie data to Recharts format
function convertPieData(data: any) {
  if (!data?.labels || !data?.datasets?.[0]) return [];

  const labels = data.labels;
  const values = data.datasets[0].data;
  const colors = data.datasets[0].backgroundColor || CHART_COLORS;

  return labels.map((label: string, index: number) => ({
    name: label,
    value: values[index] || 0,
    color: Array.isArray(colors) ? colors[index % colors.length] : colors,
  }));
}

export default function PieChart(props: PieChartProps) {
  const [tooltip, setTooltip] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { type = 'pie' } = props;
  const { colors } = useTheme();

  const rechartsData = convertPieData(props.data);

  const handleTooltip = (props: any) => {
    if (props && props.active && props.payload && props.payload.length > 0) {
      const payload = props.payload[0];
      setTooltip(
        <StatusLight color={payload.payload.color || CHART_COLORS[0]}>
          {formatLongNumber(payload.value)} {payload.name}
        </StatusLight>
      );
    } else {
      setTooltip(null);
    }
  };

  if (!rechartsData || rechartsData.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.chart, props.className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={rechartsData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            outerRadius={type === 'doughnut' ? '75%' : '85%'}
            innerRadius={type === 'doughnut' ? '45%' : 0}
            fill="#8884d8"
            dataKey="value"
            animationDuration={500}
            activeIndex={activeIndex}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {rechartsData.map((entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                stroke={colors.theme.gray50}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={handleTooltip} />
        </RechartsPieChart>
      </ResponsiveContainer>
      {tooltip && (
        <div style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}
