import BarChartTooltip from '@/components/charts/BarChartTooltip';
import { ChartProps } from '@/components/charts/Chart';
import { useTheme } from '@/components/hooks';
import { renderNumberLabels } from '@/lib/charts';
import { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { CHART_COLORS } from '@/lib/constants';
import { Loading } from 'react-basics';
import classNames from 'classnames';
import styles from './Chart.module.css';

export interface BarChartProps extends ChartProps {
  unit: string;
  stacked?: boolean;
  currency?: string;
  renderXLabel?: (label: string, index: number, values: any[]) => string;
  renderYLabel?: (label: string, index: number, values: any[]) => string;
  XAxisType?: string;
  YAxisType?: string;
  minDate?: number | string;
  maxDate?: number | string;
  isAllTime?: boolean;
}

// Convert Chart.js time-based data to Recharts format
function convertBarChartData(data: any) {
  if (!data?.datasets) return [];

  const datasets = data.datasets;
  const dataMap = new Map<string, any>();

  datasets.forEach((dataset: any) => {
    if (dataset.data && Array.isArray(dataset.data)) {
      dataset.data.forEach((point: any) => {
        // Handle different data point formats
        const xValue = point.x || point.d || point.t || String(point);
        const yValue = point.y !== undefined ? point.y : point;
        
        if (!dataMap.has(xValue)) {
          dataMap.set(xValue, { name: xValue });
        }
        
        const entry = dataMap.get(xValue);
        const label = dataset.label || 'value';
        entry[label] = yValue;
      });
    }
  });

  return Array.from(dataMap.values()).sort((a, b) => {
    // Sort by date if possible
    const dateA = new Date(a.name).getTime();
    const dateB = new Date(b.name).getTime();
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return dateA - dateB;
    }
    return 0;
  });
}

export function BarChart(props: BarChartProps) {
  const { colors } = useTheme();
  const {
    renderXLabel,
    renderYLabel,
    unit,
    XAxisType = 'time',
    YAxisType = 'linear',
    stacked = false,
    minDate,
    maxDate,
    currency,
    isAllTime,
    data,
    isLoading,
    className,
    ...restProps
  } = props;

  const rechartsData = useMemo(() => {
    return convertBarChartData(data);
  }, [data]);

  // Check if we have line charts mixed in - MUST be before early returns
  const hasLineCharts = useMemo(() => {
    return data?.datasets?.some((d: any) => d.type === 'line') || false;
  }, [data]);

  if (isLoading) {
    return (
      <div className={classNames(styles.chart, className)}>
        <Loading position="page" icon="dots" />
      </div>
    );
  }

  if (!rechartsData || rechartsData.length === 0) {
    return null;
  }

  const ChartComponent = hasLineCharts ? ComposedChart : RechartsBarChart;

  return (
    <>
      <div className={classNames(styles.chart, className)}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={rechartsData}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <defs>
              {data?.datasets?.map((dataset: any, index: number) => {
                const color = dataset.backgroundColor || dataset.borderColor || CHART_COLORS[index % CHART_COLORS.length];
                return (
                  <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.75} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.chart.line}
              opacity={0.08}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="transparent"
              tick={{ fill: colors.chart.text, fontSize: 11, fontWeight: 400, opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={renderXLabel ? (value: any, index: number) => renderXLabel(value, index, rechartsData) : undefined}
              angle={-45}
              textAnchor="end"
              height={50}
              minTickGap={5}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: colors.chart.text, fontSize: 11, fontWeight: 400, opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={renderYLabel ? (value: any) => renderYLabel(value, 0, []) : renderNumberLabels}
              domain={[0, 'auto']}
              width={35}
            />
            <Tooltip
              content={(props) => <BarChartTooltip {...props} unit={unit} currency={currency} />}
              cursor={{ fill: 'rgba(var(--primary400-rgb, 38, 128, 235), 0.08)', radius: 8 }}
            />
            {data?.datasets?.map((dataset: any, index: number) => {
              const color = dataset.backgroundColor || 
                           dataset.borderColor || 
                           CHART_COLORS[index % CHART_COLORS.length];
              
              if (dataset.type === 'line') {
                return (
                  <Line
                    key={dataset.label || `line-${index}`}
                    type="monotoneX"
                    dataKey={dataset.label || 'value'}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ 
                      fill: '#fff', 
                      r: 3, 
                      strokeWidth: 2,
                      stroke: color
                    }}
                    activeDot={{ 
                      r: 5,
                      strokeWidth: 2,
                      stroke: color,
                      fill: '#fff',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                );
              }

              return (
                <Bar
                  key={dataset.label || `bar-${index}`}
                  dataKey={dataset.label || 'value'}
                  stackId={stacked ? 'stack' : undefined}
                  fill={`url(#barGradient${index})`}
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                  maxBarSize={24}
                  barSize={24}
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default BarChart;
