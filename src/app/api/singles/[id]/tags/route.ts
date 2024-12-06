import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/withAuth';
import { z } from 'zod';
import { TagRepository } from '@/repositories/tag-repository';

const updateTagsSchema = z.object({
  tags: z.array(z.string().min(1).max(50))
});

async function handler(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { tags } = updateTagsSchema.parse(body);

    const updatedTags = await TagRepository.updateSingleTags(params.id, tags);
    return NextResponse.json({ tags: updatedTags });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Invalid request data',
          details: error.issues
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Single not found') {
      return NextResponse.json(
        { message: 'Single not found' },
        { status: 404 }
      );
    }

    console.error('Failed to update tags:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(handler); 