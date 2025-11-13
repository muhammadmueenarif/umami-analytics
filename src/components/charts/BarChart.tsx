import BarChartTooltip from '@/components/charts/BarChartTooltip';
import { ChartProps } from '@/components/charts/Chart';
import { useTheme } from '@/components/hooks';
import { renderNumberLabels } from '@/lib/charts';
import { useMemo, useState } from 'react';
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
  const [tooltip, setTooltip] = useState(null);
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

  const handleTooltip = (props: any) => {
    if (props && props.active && props.payload && props.payload.length > 0) {
      const payload = props.payload[0];
      const tooltipData = {
        tooltip: {
          opacity: 1,
          labelColors: [{ backgroundColor: payload.color || CHART_COLORS[0] }],
          dataPoints: [{
            raw: {
              x: payload.payload.name,
              y: payload.value,
              d: payload.payload.name,
            },
            dataset: {
              label: payload.dataKey,
            },
            label: payload.dataKey,
          }],
        },
      };
      setTooltip(
        <BarChartTooltip tooltip={tooltipData.tooltip} unit={unit} currency={currency} />
      );
    } else {
      setTooltip(null);
    }
  };

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

  // Get all unique data keys (series names)
  const dataKeys = useMemo(() => {
    if (!data?.datasets) return [];
    return data.datasets.map((dataset: any) => dataset.label || 'value');
  }, [data]);

  // Check if we have line charts mixed in
  const hasLineCharts = data?.datasets?.some((d: any) => d.type === 'line');

  const ChartComponent = hasLineCharts ? ComposedChart : RechartsBarChart;

  return (
    <>
      <div className={classNames(styles.chart, className)}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={rechartsData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.chart.line}
              opacity={0.2}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke={colors.chart.text}
              tick={{ fill: colors.chart.text, fontSize: 11 }}
              axisLine={{ stroke: colors.chart.line }}
              tickLine={{ stroke: colors.chart.line }}
              tickFormatter={renderXLabel ? (value: any) => renderXLabel(value, 0, []) : undefined}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke={colors.chart.text}
              tick={{ fill: colors.chart.text, fontSize: 11 }}
              axisLine={{ stroke: colors.chart.line }}
              tickLine={{ stroke: colors.chart.line }}
              tickFormatter={renderYLabel ? (value: any) => renderYLabel(value, 0, []) : renderNumberLabels}
              domain={[0, 'auto']}
            />
            <Tooltip
              content={(props: any) => {
                handleTooltip(props);
                return null;
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            {data?.datasets?.map((dataset: any, index: number) => {
              const color = dataset.backgroundColor || 
                           dataset.borderColor || 
                           CHART_COLORS[index % CHART_COLORS.length];
              
              if (dataset.type === 'line') {
                return (
                  <Line
                    key={dataset.label || `line-${index}`}
                    type="monotone"
                    dataKey={dataset.label || 'value'}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ fill: color, r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={500}
                  />
                );
              }

              return (
                <Bar
                  key={dataset.label || `bar-${index}`}
                  dataKey={dataset.label || 'value'}
                  stackId={stacked ? 'stack' : undefined}
                  fill={color}
                  radius={[6, 6, 0, 0]}
                  animationDuration={500}
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
      {tooltip && (
        <div style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }}>
          {tooltip}
        </div>
      )}
    </>
  );
}

export default BarChart;
