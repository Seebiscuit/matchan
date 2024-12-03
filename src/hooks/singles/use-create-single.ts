import { useMutation } from '@tanstack/react-query';
import { CreateSingleDto } from '@/types/singles';

async function createSingle(data: CreateSingleDto) {
  const response = await fetch('/api/singles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? error.error ?? 'Failed to create single');
  }

  return response.json();
}

export function useCreateSingle() {
  return useMutation({
    mutationFn: createSingle,
  });
} 