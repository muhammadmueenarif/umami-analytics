import { ChartProps } from '@/components/charts/Chart';
import { useState } from 'react';
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
  const [tooltip, setTooltip] = useState<any>(null);
  const { colors } = useTheme();
  const { type = 'bubble', data, className, isLoading } = props;

  const rechartsData = convertBubbleData(data);

  const handleTooltip = (props: any) => {
    if (props && props.active && props.payload && props.payload.length > 0) {
      const payload = props.payload[0];
      setTooltip(
        <StatusLight color={payload.payload.color || CHART_COLORS[0]}>
          {formatLongNumber(payload.payload.y)} {payload.payload.name}
        </StatusLight>
      );
    } else {
      setTooltip(null);
    }
  };

  if (isLoading || !rechartsData || rechartsData.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.chart, className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colors.chart.line}
            opacity={0.2}
          />
          <XAxis
            type="number"
            dataKey="x"
            stroke={colors.chart.text}
            tick={{ fill: colors.chart.text, fontSize: 11 }}
            axisLine={{ stroke: colors.chart.line }}
          />
          <YAxis
            type="number"
            dataKey="y"
            stroke={colors.chart.text}
            tick={{ fill: colors.chart.text, fontSize: 11 }}
            axisLine={{ stroke: colors.chart.line }}
          />
          <Tooltip content={handleTooltip} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            data={rechartsData}
            fill="#8884d8"
            animationDuration={500}
          >
            {rechartsData.map((entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {tooltip && (
        <div style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}
