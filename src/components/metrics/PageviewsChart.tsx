import { useMemo } from 'react';
import { useLocale, useTheme, useMessages } from '@/components/hooks';
import { renderDateLabels, renderNumberLabels } from '@/lib/charts';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import BarChartTooltip from '@/components/charts/BarChartTooltip';
import { Loading } from 'react-basics';
import classNames from 'classnames';
import styles from '@/components/charts/Chart.module.css';

export interface PageviewsChartProps {
  data: {
    pageviews: any[];
    sessions: any[];
    compare?: {
      pageviews: any[];
      sessions: any[];
    };
  };
  unit: string;
  isLoading?: boolean;
  isAllTime?: boolean;
  minDate?: string;
  maxDate?: string;
  animationDuration?: number;
  className?: string;
}

export function PageviewsChart({
  data,
  unit,
  isLoading,
  isAllTime,
  className,
  animationDuration = 1000,
}: PageviewsChartProps) {
  const { colors } = useTheme();
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();

  const rechartsData = useMemo(() => {
    if (!data || !data.pageviews || !data.sessions || data.pageviews.length === 0) {
      return [];
    }

    const dataMap = new Map<string, any>();

    // Add sessions data
    data.sessions.forEach((point: any) => {
      const xValue = point.x || point.t || String(point);
      if (!dataMap.has(xValue)) {
        dataMap.set(xValue, { name: xValue });
      }
      dataMap.get(xValue)[formatMessage(labels.visitors)] = point.y || 0;
    });

    // Add pageviews data
    data.pageviews.forEach((point: any) => {
      const xValue = point.x || point.t || String(point);
      if (!dataMap.has(xValue)) {
        dataMap.set(xValue, { name: xValue });
      }
      dataMap.get(xValue)[formatMessage(labels.views)] = point.y || 0;
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      const dateA = new Date(a.name).getTime();
      const dateB = new Date(b.name).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateA - dateB;
      }
      return 0;
    });
  }, [data, formatMessage, labels]);

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

  // Use the solid color from chart config (which uses appearance settings)
  // Extract base color from backgroundColor (remove alpha) or use theme primary
  const visitorsColor = (colors.chart.visitors as any).color || colors.theme.primary;
  const viewsColor = (colors.chart.views as any).color || colors.theme.primary;

  return (
    <div className={classNames(styles.chart, className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={rechartsData}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={visitorsColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={visitorsColor} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={viewsColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={viewsColor} stopOpacity={0.05} />
            </linearGradient>
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
            tickFormatter={(value: any, index: number) => renderDateLabels(unit, locale)(value, index, rechartsData)}
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
            tickFormatter={renderNumberLabels}
            domain={[0, 'auto']}
            width={35}
          />
          <Tooltip
            content={(props) => <BarChartTooltip {...props} unit={unit} />}
            cursor={{ stroke: colors.chart.line, strokeWidth: 2, strokeDasharray: '3 3' }}
          />
          <Area
            type="monotoneX"
            dataKey={formatMessage(labels.visitors)}
            stroke={visitorsColor}
            strokeWidth={2.5}
            fill="url(#visitorsGradient)"
            dot={{ 
              fill: '#fff', 
              r: 3, 
              strokeWidth: 2,
              stroke: visitorsColor
            }}
            activeDot={{ 
              r: 5,
              strokeWidth: 2,
              stroke: visitorsColor,
              fill: '#fff',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}
            animationDuration={animationDuration}
            animationEasing="ease-in-out"
          />
          <Area
            type="monotoneX"
            dataKey={formatMessage(labels.views)}
            stroke={viewsColor}
            strokeWidth={2.5}
            fill="url(#viewsGradient)"
            dot={{ 
              fill: '#fff', 
              r: 3, 
              strokeWidth: 2,
              stroke: viewsColor
            }}
            activeDot={{ 
              r: 5,
              strokeWidth: 2,
              stroke: viewsColor,
              fill: '#fff',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}
            animationDuration={animationDuration}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PageviewsChart;
