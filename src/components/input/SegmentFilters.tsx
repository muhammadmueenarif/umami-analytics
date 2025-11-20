import { Icon, Loading } from 'react-basics';
import Icons from '@/components/icons';
import { useWebsiteSegments } from '@/components/hooks';
import Empty from '@/components/common/Empty';
import styles from './SegmentFilters.module.css';

export interface SegmentFiltersProps {
  websiteId: string;
  segmentId?: string;
  type?: string;
  onChange?: (id: string, type: string) => void;
}

export function SegmentFilters({
  websiteId,
  segmentId,
  type = 'segment',
  onChange,
}: SegmentFiltersProps) {
  const { data, isLoading } = useWebsiteSegments(websiteId, { type });

  const handleChange = (id: string) => {
    onChange?.(id, type);
  };

  if (isLoading) {
    return <Loading icon="spinner" />;
  }

  const segments = Array.isArray(data) ? data : (data as any)?.data || [];

  if (!Array.isArray(segments) || segments.length === 0) {
    return <Empty />;
  }

  return (
    <div className={styles.list}>
      {segments.map((item: any) => {
        const isSelected = item.id === segmentId;
        const IconComponent = type === 'segment' ? Icons.BarChart : Icons.Users;
        return (
          <div
            key={item.id}
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={() => handleChange(item.id)}
          >
            <Icon>
              <IconComponent />
            </Icon>
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

