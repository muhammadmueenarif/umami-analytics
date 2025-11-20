import { useApi } from '../useApi';
import { useModified } from '../useModified';

export function useWebsiteSegments(
  websiteId: string,
  params?: { type?: string },
  options?: any,
) {
  const { get, useQuery } = useApi();
  const { modified } = useModified(`segments`);

  return useQuery({
    queryKey: ['websites:segments', { websiteId, modified, ...params }],
    queryFn: () => get(`/websites/${websiteId}/segments`, params),
    enabled: !!websiteId,
    ...options,
  });
}

