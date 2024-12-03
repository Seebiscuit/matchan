import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export type CreateSingleInput = {
  firstName: string;
  lastName: string;
  email?: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: Date;
  image?: Buffer;
  tags?: string[];
};

export type UpdateSingleInput = Partial<CreateSingleInput>;

export const singlesRepository = {
  create: async (data: CreateSingleInput) => {
    const { tags: tagNames, ...singleData } = data;
    
    return prisma.single.create({
      data: {
        ...singleData,
        tags: tagNames?.length ? {
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name },
          })),
        } : undefined,
      },
      include: {
        tags: true,
      },
    });
  },

  update: async (id: string, data: UpdateSingleInput) => {
    const { tags: tagNames, ...singleData } = data;
    
    return prisma.single.update({
      where: { id },
      data: {
        ...singleData,
        tags: tagNames?.length ? {
          set: [],
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name },
          })),
        } : undefined,
      },
      include: {
        tags: true,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.single.delete({
      where: { id },
    });
  },

  findById: async (id: string) => {
    return prisma.single.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });
  },

  findMany: async (params?: {
    search?: string;
    tags?: string[];
    take?: number;
    skip?: number;
  }) => {
    const where: Prisma.SingleWhereInput = {};
    
    if (params?.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.tags?.length) {
      where.tags = {
        some: {
          id: { in: params.tags },
        },
      };
    }

    return prisma.single.findMany({
      where,
      take: params?.take,
      skip: params?.skip,
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
}; 