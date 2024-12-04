import { NextResponse } from "next/server";
import { singlesRepository } from "@/lib/api/repository/singles";
import { z } from "zod";
import { saveImage } from "@/lib/utils/image-upload";
import { withAuth } from "@/lib/auth/withAuth";
import { UserRole } from "@prisma/client";
import { phoneNumberUtils } from '@/lib/utils/phone-number'
import { Prisma } from "@prisma/client";
import { errorFormatting } from '@/lib/utils/error-formatting'
import { createSingleSchema } from '@/lib/validation/singles';

type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
}

async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSingleSchema.parse(body);
    
    // Save image if provided
    let imageId: string | undefined;
    if (data.image) {
      imageId = await saveImage(data.image);
    }

    const single = await singlesRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      dateOfBirth: new Date(data.dateOfBirth),
      email: data.email,
      imageId,
      tags: data.tags,
    });

    return NextResponse.json(single);
  } catch (error) {
    console.error('Failed to create single:', error);

    const errorResponse: ApiError = {
      message: 'Failed to create single',
    };

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      errorResponse.message = 'Validation error';
      errorResponse.code = 'VALIDATION_ERROR';
      errorResponse.details = error.issues;
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle Prisma unique constraint violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const fields = error.meta?.target as string[] || ['field'];
        errorResponse.message = errorFormatting.formatUniqueConstraintMessage(fields);
        errorResponse.code = 'UNIQUE_CONSTRAINT_VIOLATION';
        errorResponse.details = { fields };
        return NextResponse.json(errorResponse, { status: 409 });
      }
    }

    // Handle other errors
    errorResponse.code = 'INTERNAL_SERVER_ERROR';
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function GET(req: Request) {
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
    return NextResponse.json({
      message: 'Failed to fetch singles',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

const POST_HANDLER = withAuth(POST, { requiredRoles: [UserRole.ADMIN, UserRole.USER] });
const GET_HANDLER = withAuth(GET, { requiredRoles: [UserRole.ADMIN] });

export { POST_HANDLER as POST, GET_HANDLER as GET }; 