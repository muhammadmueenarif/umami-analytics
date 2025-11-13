import { ChartProps } from '@/components/charts/Chart';
import { useMemo } from 'react';
import { StatusLight } from 'react-basics';
import { formatLongNumber } from '@/lib/format';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CHART_COLORS } from '@/lib/constants';
import { useTheme } from '@/components/hooks';
import classNames from 'classnames';
import styles from './Chart.module.css';

export interface BubbleChartProps extends ChartProps {
  type?: 'bubble';
}

// Convert Chart.js bubble data to Recharts format
function convertBubbleData(data: any) {
  if (!data?.datasets) return [];

  const result: any[] = [];
  data.datasets.forEach((dataset: any, datasetIndex: number) => {
    if (dataset.data && Array.isArray(dataset.data)) {
      dataset.data.forEach((point: any) => {
        result.push({
          x: point.x || 0,
          y: point.y || 0,
          z: point.z || point.r || 10,
          name: dataset.label || `Series ${datasetIndex}`,
          color: dataset.backgroundColor || CHART_COLORS[datasetIndex % CHART_COLORS.length],
        });
      });
    }
  });

  return result;
}

export default function BubbleChart(props: BubbleChartProps) {
  const { colors } = useTheme();
  const { data, className, isLoading } = props;

  const rechartsData = useMemo(() => convertBubbleData(data), [data]);

  if (isLoading || !rechartsData || rechartsData.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.chart, className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <defs>
            {rechartsData.map((entry: any, index: number) => {
              const color = entry.color || CHART_COLORS[index % CHART_COLORS.length];
              return (
                <radialGradient key={`bubbleGradient${index}`} id={`bubbleGradient${index}`}>
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </radialGradient>
              );
            })}
          </defs>
          <CartesianGrid 
            strokeDasharray="5 5" 
            stroke={colors.chart.line}
            opacity={0.15}
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="x"
            stroke="transparent"
            tick={{ fill: colors.chart.text, fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            stroke="transparent"
            tick={{ fill: colors.chart.text, fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
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
                      <span style={{ fontWeight: 600 }}>{formatLongNumber(payload.payload.y)}</span> {payload.payload.name}
                    </StatusLight>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ strokeDasharray: '5 5' }}
          />
          <Scatter
            data={rechartsData}
            fill="#8884d8"
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            {rechartsData.map((entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#bubbleGradient${index})`}
                stroke={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                strokeOpacity={0.7}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
