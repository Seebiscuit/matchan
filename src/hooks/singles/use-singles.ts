import { useQuery } from '@tanstack/react-query';
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

export function useSingles() {
  return useQuery({
    queryKey: ['singles'],
    queryFn: fetchSingles,
  });
} 