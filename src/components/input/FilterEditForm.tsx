import { useState } from 'react';
import { Button, Tabs, Item } from 'react-basics';
import { useFilters, useMessages, useNavigation } from '@/components/hooks';
import { FieldFilters } from '@/components/input/FieldFilters';
import { SegmentFilters } from '@/components/input/SegmentFilters';
import { filtersArrayToObject } from '@/lib/params';
import styles from './FilterEditForm.module.css';

export interface FilterEditFormProps {
  websiteId?: string;
  onClose?: () => void;
}

export function FilterEditForm({ websiteId, onClose }: FilterEditFormProps) {
  const {
    query: { segment, cohort },
    renderUrl,
    router,
  } = useNavigation();
  const { filters } = useFilters();
  const { formatMessage, labels } = useMessages();
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [currentSegment, setCurrentSegment] = useState(segment);
  const [currentCohort, setCurrentCohort] = useState(cohort);
  const [selectedTab, setSelectedTab] = useState('fields');

  const handleReset = () => {
    setCurrentFilters([]);
    setCurrentSegment(undefined);
    setCurrentCohort(undefined);
  };

  const handleSave = () => {
    // Filter out empty values and convert to object format
    const validFilters = currentFilters.filter(f => f?.name && f?.operator && f?.value);
    const params = filtersArrayToObject(validFilters);

    // Add segment or cohort
    if (currentSegment) {
      params.segment = currentSegment;
    }
    if (currentCohort) {
      params.cohort = currentCohort;
    }

    // Navigate with new params
    router.push(renderUrl(params));
    onClose?.();
  };

  const handleSegmentChange = (id: string, type: string) => {
    if (type === 'segment') {
      setCurrentSegment(id);
      setCurrentCohort(undefined);
    } else {
      setCurrentCohort(id);
      setCurrentSegment(undefined);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.tabs}>
          <Tabs selectedKey={selectedTab} onSelect={(value: any) => setSelectedTab(value)}>
            <Item key="fields">{formatMessage(labels.fields)}</Item>
            <Item key="segments">{formatMessage(labels.segments)}</Item>
            <Item key="cohorts">{formatMessage(labels.cohorts)}</Item>
          </Tabs>
          <div className={styles.tabContent}>
            {selectedTab === 'fields' && (
              <FieldFilters
                websiteId={websiteId}
                value={currentFilters}
                onChange={setCurrentFilters}
              />
            )}
            {selectedTab === 'segments' && (
              <SegmentFilters
                websiteId={websiteId}
                segmentId={currentSegment}
                type="segment"
                onChange={handleSegmentChange}
              />
            )}
            {selectedTab === 'cohorts' && (
              <SegmentFilters
                websiteId={websiteId}
                segmentId={currentCohort}
                type="cohort"
                onChange={handleSegmentChange}
              />
            )}
          </div>
        </div>
        <div className={styles.buttons}>
          <Button onClick={handleReset}>{formatMessage(labels.reset)}</Button>
          <div className={styles.actions}>
            <Button onClick={onClose}>{formatMessage(labels.cancel)}</Button>
            <Button variant="primary" onClick={handleSave}>
              {formatMessage(labels.apply)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

