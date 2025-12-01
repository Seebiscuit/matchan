import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/withAuth';
import { UserRole } from '@prisma/client';
import { singlesRepository } from '@/lib/api/repository/singles';

async function GET(
  request: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const single = await singlesRepository.findByImageId(imageId);
    
    if (!single?.imageUrl) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.redirect(single.imageUrl);
  } catch (error) {
    console.error('Failed to serve image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const GET_HANDLER = withAuth(GET, { requiredRoles: [UserRole.ADMIN] });

export { GET_HANDLER as GET }; 