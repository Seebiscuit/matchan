import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/withAuth';
import { UserRole } from '@prisma/client';
import { singlesRepository } from '@/lib/api/repository/singles';

async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const imageId = params.imageId;
    const single = await singlesRepository.findByImageId(imageId);
    
    if (!single?.imageUrl) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const imageUrl = single.imageUrl;
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error('Failed to serve image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const GET_HANDLER = withAuth(GET, { requiredRoles: [UserRole.ADMIN] });

export { GET_HANDLER as GET }; 