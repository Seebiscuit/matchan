import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'
import { authOptions } from '@/lib/auth/config'

type AuthOptions = {
  requiredRoles?: UserRole[]
}

export function withAuth(handler: Function, options: AuthOptions = {}) {
  return async (req: NextRequest, context: any) => {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthenticated - Please log in' },
        { status: 401 }
      )
    }
    
    if (options.requiredRoles?.length && !options.requiredRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Insufficient permissions' },
        { status: 403 }
      )
    }
    
    return handler(req, context)
  }
} 