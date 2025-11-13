import { ChartProps } from '@/components/charts/Chart';
import { useState, useMemo } from 'react';
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { type = 'pie' } = props;
  const { colors } = useTheme();

  const rechartsData = useMemo(() => convertPieData(props.data), [props.data]);

  if (!rechartsData || rechartsData.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.chart, props.className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <defs>
            {rechartsData.map((entry: any, index: number) => {
              const color = entry.color || CHART_COLORS[index % CHART_COLORS.length];
              return (
                <radialGradient key={`gradient-${index}`} id={`pieGradient${index}`}>
                  <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                </radialGradient>
              );
            })}
          </defs>
          <Pie
            data={rechartsData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            outerRadius={type === 'doughnut' ? '75%' : '85%'}
            innerRadius={type === 'doughnut' ? '48%' : 0}
            fill="#8884d8"
            dataKey="value"
            animationDuration={800}
            animationEasing="ease-in-out"
            activeIndex={activeIndex}
            activeShape={{
              outerRadius: type === 'doughnut' ? '80%' : '90%',
            }}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            paddingAngle={2}
          >
            {rechartsData.map((entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#pieGradient${index})`}
                stroke="var(--base50)"
                strokeWidth={3}
              />
            ))}
          </Pie>
          <Tooltip 
            content={(props) => {
              if (props.active && props.payload && props.payload.length > 0) {
                const payload = props.payload[0];
                return (
                  <div style={{
                    background: 'var(--base50)',
                    padding: '12px 16px',
                    border: '1px solid var(--base300)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <StatusLight color={payload.payload.color || CHART_COLORS[0]}>
                      <span style={{ fontWeight: 600 }}>{formatLongNumber(payload.value)}</span> {payload.name}
                    </StatusLight>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
