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

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create single', { 
      cause: result 
    });
  }

  return result;
}

export function useCreateSingle() {
  return useMutation({
    mutationFn: createSingle,
  });
} 