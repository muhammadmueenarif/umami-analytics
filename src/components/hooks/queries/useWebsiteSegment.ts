import { useApi } from '../useApi';
import { useModified } from '../useModified';

export function useWebsiteSegment(
  websiteId: string,
  segmentId: string,
  options?: any,
) {
  const { get, useQuery } = useApi();
  const { modified } = useModified(`segments`);

  return useQuery({
    queryKey: ['websites:segment', { websiteId, segmentId, modified }],
    queryFn: () => get(`/websites/${websiteId}/segments/${segmentId}`),
    enabled: !!(websiteId && segmentId),
    ...options,
  });
}

