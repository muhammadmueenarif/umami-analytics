import { useState, useMemo, ReactNode } from 'react';
import { Loading } from 'react-basics';
import classNames from 'classnames';
import {
  BarChart as RechartsBarChart,
  LineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import HoverTooltip from '@/components/common/HoverTooltip';
import Legend from '@/components/metrics/Legend';
import { DEFAULT_ANIMATION_DURATION } from '@/lib/constants';
import { CHART_COLORS } from '@/lib/constants';
import { useTheme } from '@/components/hooks';
import styles from './Chart.module.css';

export interface ChartProps {
  type?: 'bar' | 'bubble' | 'doughnut' | 'pie' | 'line' | 'polarArea' | 'radar' | 'scatter';
  data?: any;
  isLoading?: boolean;
  animationDuration?: number;
  updateMode?: string;
  onCreate?: (chart: any) => void;
  onUpdate?: (chart: any) => void;
  onTooltip?: (model: any) => void;
  className?: string;
  chartOptions?: any;
  tooltip?: ReactNode;
}

// Convert Chart.js data format to Recharts format
function convertChartData(data: any, type: string) {
  if (!data) return null;

  if (type === 'pie' || type === 'doughnut') {
    // Pie chart data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] }
    if (data.labels && data.datasets?.[0]) {
      const labels = data.labels;
      const values = data.datasets[0].data;
      const colors = data.datasets[0].backgroundColor || CHART_COLORS;
      
      return labels.map((label: string, index: number) => ({
        name: label,
        value: values[index] || 0,
        color: Array.isArray(colors) ? colors[index % colors.length] : colors,
      }));
    }
    return [];
  }

  // Bar/Line chart data: { datasets: [{ label: string, data: [{x, y}] }] }
  if (data.datasets && Array.isArray(data.datasets)) {
    const datasets = data.datasets;
    const allDataPoints = new Map<string, any>();

    // Collect all unique x values
    datasets.forEach((dataset: any) => {
      if (dataset.data && Array.isArray(dataset.data)) {
        dataset.data.forEach((point: any) => {
          const xKey = point.x || point.d || point.t || String(point);
          if (!allDataPoints.has(xKey)) {
            allDataPoints.set(xKey, {});
          }
          const entry = allDataPoints.get(xKey);
          entry[dataset.label || 'value'] = point.y || point;
        });
      }
    });

    return Array.from(allDataPoints.values());
  }

  return [];
}

export function Chart({
  type = 'bar',
  data,
  isLoading = false,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  tooltip,
  updateMode,
  onCreate,
  onUpdate,
  className,
  chartOptions,
  onTooltip,
}: ChartProps) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rechartsData = useMemo(() => {
    return convertChartData(data, type);
  }, [data, type]);

  const chartConfig = useMemo(() => {
    if (!data?.datasets) return {};
    
    return data.datasets.reduce((acc: any, dataset: any, index: number) => {
      const color = dataset.backgroundColor || 
                   dataset.borderColor || 
                   CHART_COLORS[index % CHART_COLORS.length];
      acc[dataset.label || `series${index}`] = color;
      return acc;
    }, {});
  }, [data]);

  const renderChart = () => {
    if (!rechartsData || rechartsData.length === 0) {
      return null;
    }

    const commonProps = {
      data: rechartsData,
      margin: { top: 5, right: 5, left: -20, bottom: 5 },
    };

    switch (type) {
      case 'pie':
      case 'doughnut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <defs>
                {rechartsData?.map((entry: any, index: number) => {
                  const color = entry.color || CHART_COLORS[index % CHART_COLORS.length];
                  return (
                    <radialGradient key={`pieGradient${index}`} id={`pieGradient${index}`}>
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
                animationDuration={animationDuration}
                animationEasing="ease-in-out"
                activeIndex={activeIndex}
                activeShape={{
                  outerRadius: type === 'doughnut' ? '80%' : '90%',
                }}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                paddingAngle={2}
              >
                {rechartsData?.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient${index})`}
                    stroke="var(--base50)"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip content={() => tooltip || null} />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart {...commonProps}>
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
                strokeDasharray="5 5" 
                stroke={colors.chart.line}
                opacity={0.15}
                vertical={false}
              />
              <XAxis 
                dataKey="name"
                stroke="transparent"
                tick={{ fill: colors.chart.text, fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="transparent"
                tick={{ fill: colors.chart.text, fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={() => tooltip || null}
                cursor={{ fill: 'rgba(var(--primary400-rgb, 38, 128, 235), 0.08)', radius: 8 }}
              />
              {data?.datasets?.map((dataset: any, index: number) => {
                return (
                  <Bar
                    key={dataset.label || `bar-${index}`}
                    dataKey={dataset.label || `series${index}`}
                    fill={`url(#barGradient${index})`}
                    radius={[8, 8, 0, 0]}
                    animationDuration={animationDuration}
                    maxBarSize={24}
                    barSize={24}
                  />
                );
              })}
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <defs>
                {data?.datasets?.map((dataset: any, index: number) => {
                  const color = dataset.borderColor || dataset.backgroundColor || CHART_COLORS[index % CHART_COLORS.length];
                  return (
                    <linearGradient key={`lineGradient${index}`} id={`lineGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.05} />
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
              />
              <YAxis 
                stroke="transparent"
                tick={{ fill: colors.chart.text, fontSize: 11, fontWeight: 400, opacity: 0.7 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip 
                content={() => tooltip || null}
                cursor={{ stroke: colors.chart.line, strokeWidth: 2, strokeDasharray: '3 3' }}
              />
              {data?.datasets?.map((dataset: any, index: number) => {
                const color = dataset.borderColor || 
                             dataset.backgroundColor || 
                             CHART_COLORS[index % CHART_COLORS.length];
                return (
                  <Line
                    key={dataset.label || `line-${index}`}
                    type="monotoneX"
                    dataKey={dataset.label || `series${index}`}
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
                    animationDuration={animationDuration}
                    animationEasing="ease-in-out"
                    fill={`url(#lineGradient${index})`}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  // Create legend items for compatibility
  const legendItems = useMemo(() => {
    if (!data?.datasets) return [];
    return data.datasets.map((dataset: any, index: number) => ({
      text: dataset.label || `Series ${index + 1}`,
      fillStyle: dataset.backgroundColor || dataset.borderColor || CHART_COLORS[index % CHART_COLORS.length],
      hidden: false,
      datasetIndex: index,
    }));
  }, [data]);

  const handleLegendClick = (item: any) => {
    // Toggle visibility - this would need more complex state management
    // For now, we'll just trigger the callback
    onUpdate?.(item);
  };

  return (
    <>
      <div className={classNames(styles.chart, className)}>
        {isLoading && <Loading position="page" icon="dots" />}
        {!isLoading && renderChart()}
      </div>
      {legendItems.length > 0 && (
        <Legend items={legendItems} onClick={handleLegendClick} />
      )}
      {tooltip && (
        <HoverTooltip>
          <div className={styles.tooltip}>{tooltip}</div>
        </HoverTooltip>
      )}
    </>
  );
}

export default Chart;
