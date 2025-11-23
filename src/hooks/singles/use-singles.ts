import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Single, Tag } from '@prisma/client';

export type SingleWithTags = Single & {
  tags: Tag[];
};

export interface SinglesFilters {
  createdAfter?: string;
  createdBefore?: string;
  minAge?: number;
  maxAge?: number;
}

async function fetchSingles(filters?: SinglesFilters) {
  const params = new URLSearchParams();
  
  if (filters?.createdAfter) {
    params.append('createdAfter', filters.createdAfter);
  }
  if (filters?.createdBefore) {
    params.append('createdBefore', filters.createdBefore);
  }
  if (filters?.minAge !== undefined) {
    params.append('minAge', filters.minAge.toString());
  }
  if (filters?.maxAge !== undefined) {
    params.append('maxAge', filters.maxAge.toString());
  }

  const url = `/api/singles${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch singles');
  }
  return response.json() as Promise<SingleWithTags[]>;
}

async function deleteSingle(id: string) {
  const response = await fetch(`/api/singles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete single');
  }
}

export function useSingles(filters?: SinglesFilters) {
  return useQuery({
    queryKey: ['singles', filters],
    queryFn: () => fetchSingles(filters),
  });
}

export function useDeleteSingle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSingle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['singles'] });
    },
  });
} 