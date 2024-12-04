import { NextResponse } from "next/server";
import { singlesRepository } from "@/lib/api/repository/singles";
import { withAuth } from "@/lib/auth/withAuth";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { phoneNumberUtils } from "@/lib/utils/phoneNumberUtils";

const updateSingleSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .refine(phoneNumberUtils.validate, 'Invalid phone number')
    .transform(phoneNumberUtils.normalize),
  email: z.string().email().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dateOfBirth: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

async function GET(
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

async function PATCH(
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

async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await singlesRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete single:', error);
    return NextResponse.json(
      { error: 'Failed to delete single' },
      { status: 500 }
    );
  }
}

const GET_HANDLER = withAuth(GET, { requiredRoles: [UserRole.ADMIN] });
const PATCH_HANDLER = withAuth(PATCH, { requiredRoles: [UserRole.ADMIN] });
const DELETE_HANDLER = withAuth(DELETE, { requiredRoles: [UserRole.ADMIN] });

export { GET_HANDLER as GET, PATCH_HANDLER as PATCH, DELETE_HANDLER as DELETE }; 