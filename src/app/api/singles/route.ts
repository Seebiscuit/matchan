import { NextResponse } from "next/server";
import { singlesRepository } from "@/lib/api/repository/singles";
import { z } from "zod";
import { Buffer } from 'buffer';
import { Prisma } from "@prisma/client";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const createSingleSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().datetime(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
}).required().transform(data => ({
  ...data,
  tags: data.tags || [], // Ensure tags is always an array
}));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSingleSchema.parse(body);
    
    const imageBuffer = data.image 
      ? Buffer.from(data.image.split(',')[1], 'base64')
      : undefined;

    const single = await singlesRepository.create({
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      image: imageBuffer,
    });

    return NextResponse.json(single);
  } catch (error) {
    console.error('Failed to create single:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A single with this email already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create single' },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const tags = searchParams.get('tags')?.split(',') || undefined;
  const take = Number(searchParams.get('take')) || undefined;
  const skip = Number(searchParams.get('skip')) || undefined;

  try {
    const singles = await singlesRepository.findMany({
      search,
      tags,
      take,
      skip,
    });

    return NextResponse.json(singles);
  } catch (error) {
    console.error('Failed to fetch singles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch singles' },
      { status: 500 }
    );
  }
} 