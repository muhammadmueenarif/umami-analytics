import classNames from 'classnames';
import { useSpring, animated } from '@react-spring/web';
import { formatNumber } from '@/lib/format';
import ChangeLabel from '@/components/metrics/ChangeLabel';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  value: number;
  previousValue?: number;
  change?: number;
  label?: string;
  reverseColors?: boolean;
  formatValue?: (n: any) => string;
  showLabel?: boolean;
  showChange?: boolean;
  showPrevious?: boolean;
  className?: string;
  icon?: React.ReactNode;
  trendData?: number[];
}

export const MetricCard = ({
  value = 0,
  change = 0,
  label,
  reverseColors = false,
  formatValue = formatNumber,
  showLabel = true,
  showChange = false,
  showPrevious = false,
  className,
  icon,
  trendData = [],
}: MetricCardProps) => {
  const diff = value - change;
  const pct = ((value - diff) / diff) * 100;
  const props = useSpring({ x: Number(value) || 0, from: { x: 0 } });
  const changeProps = useSpring({ x: Number(pct) || 0, from: { x: 0 } });
  const prevProps = useSpring({ x: Number(diff) || 0, from: { x: 0 } });

  // Generate sparkline path
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length === 0) return '';
    
    const width = 90;
    const height = 35;
    const padding = 4;
    
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    
    const points = data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + (height - padding * 2) - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={classNames(styles.card, className, showPrevious && styles.compare)}>
      <div className={styles.cardContent}>
        <div className={styles.cardLeft}>
          <div className={styles.cardHeader}>
            {/* {icon && <div className={styles.icon}>{icon}</div>} */}
            {showLabel && <div className={styles.label}>{label}</div>}
          </div>
          <div className={styles.cardBody}>
            <animated.div className={styles.value} title={value?.toString()}>
              {props?.x?.to(x => formatValue(x))}
            </animated.div>
            {showChange && (
              <ChangeLabel
                className={styles.change}
                value={change}
                title={formatValue(change)}
                reverseColors={reverseColors}
              >
                <animated.span>{changeProps?.x?.to(x => `${Math.abs(~~x)}%`)}</animated.span>
              </ChangeLabel>
            )}
        
               {trendData && trendData.length > 0 && (
          <div className={styles.sparkline}>
            <svg width="90" height="35" viewBox="0 0 90 35" preserveAspectRatio="none">
              <path
                d={generateSparklinePath(trendData)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
            {showPrevious && (
              <animated.div className={classNames(styles.value, styles.prev)} title={diff.toString()}>
                {prevProps?.x?.to(x => formatValue(x))}
              </animated.div>
            )}
          </div>
        </div>
     
      </div>
    </div>
  );
};

export default MetricCard;
