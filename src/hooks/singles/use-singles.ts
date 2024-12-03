import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Single, Tag } from '@prisma/client';

export type SingleWithTags = Single & {
  tags: Tag[];
};

async function fetchSingles() {
  const response = await fetch('/api/singles');
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

export function useSingles() {
  return useQuery({
    queryKey: ['singles'],
    queryFn: fetchSingles,
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