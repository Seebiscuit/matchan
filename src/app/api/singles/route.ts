import { NextResponse } from "next/server";
import { singlesRepository } from "@/lib/api/repository/singles";
import { z } from "zod";
import { saveImage } from "@/lib/utils/image-upload";
import { withAuth } from "@/lib/auth/withAuth";
import { UserRole } from "@prisma/client";
import { phoneNumberUtils } from '@/lib/utils/phone-number'

const createSingleSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .refine(phoneNumberUtils.validate, 'Invalid phone number')
    .transform(phoneNumberUtils.normalize),
  email: z.string().email().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().datetime(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
})
.transform(data => {
  // Ensure tags is an array, but don't modify other fields
  return {
    ...data,
    tags: data.tags || [],
  }
});

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
    return NextResponse.json(
      { error: 'Failed to create single' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: 'Failed to fetch singles' },
      { status: 500 }
    );
  }
}

const POST_HANDLER = withAuth(POST, { requiredRoles: [UserRole.ADMIN, UserRole.USER] });
const GET_HANDLER = withAuth(GET, { requiredRoles: [UserRole.ADMIN] });

export { POST_HANDLER as POST, GET_HANDLER as GET }; 