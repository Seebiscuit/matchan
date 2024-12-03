import { NextResponse } from "next/server";
import { singlesRepository } from "@/lib/api/repository/singles";
import { z } from "zod";

const updateSingleSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dateOfBirth: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const single = await singlesRepository.findById(params.id);
    if (!single) {
      return NextResponse.json(
        { error: 'Single not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(single);
  } catch (error) {
    console.error('Failed to fetch single:', error);
    return NextResponse.json(
      { error: 'Failed to fetch single' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = updateSingleSchema.parse(body);
    
    const single = await singlesRepository.update(params.id, {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    });

    return NextResponse.json(single);
  } catch (error) {
    console.error('Failed to update single:', error);
    return NextResponse.json(
      { error: 'Failed to update single' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await singlesRepository.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete single:', error);
    return NextResponse.json(
      { error: 'Failed to delete single' },
      { status: 500 }
    );
  }
} 