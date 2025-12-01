import { prisma } from "@/lib/db/prisma";
import { Prisma, Gender } from "@prisma/client";
import { deleteImage } from "@/lib/utils/image-upload";

export interface SingleInput {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: Date;
  imageId?: string;
  imageUrl?: string;
  tags?: string[];
}

export type CreateSingleInput = SingleInput
export type UpdateSingleInput = Partial<SingleInput>

export const singlesRepository = {
  create: async (input: CreateSingleInput, userEmail: string) => {
    const { tags: tagNames, ...singleData } = input;
    
    return prisma.single.create({
      data: {
        ...singleData,
        createdBy: { connect: { email: userEmail } },
        updatedBy: { connect: { email: userEmail } },
        tags: tagNames?.length ? {
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name },
          })),
        } : undefined,
      },
      include: {
        tags: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  },

  update: async (id: string, input: UpdateSingleInput, userEmail: string) => {
    const { tags: tagNames, ...singleData } = input;
    
    return prisma.single.update({
      where: { id },
      data: {
        ...singleData,
        updatedBy: { connect: { email: userEmail } },
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
        createdBy: true,
        updatedBy: true,
      },
    });
  },

  delete: async (id: string) => {
    // Get the single to delete its image
    const single = await prisma.single.findUnique({
      where: { id },
      select: { imageId: true },
    });

    // Delete the image file if it exists
    if (single?.imageId) {
      await deleteImage(single.imageId);
    }

    // Delete the single from database
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
    name?: string;
    tags?: string[];
    take?: number;
    skip?: number;
    createdAfter?: string;
    createdBefore?: string;
    minAge?: number;
    maxAge?: number;
  }) => {
    const where: Prisma.SingleWhereInput = {};
    
    // Name search (firstName and lastName only)
    if (params?.name) {
      where.OR = [
        { firstName: { contains: params.name, mode: 'insensitive' as const } },
        { lastName: { contains: params.name, mode: 'insensitive' as const } },
      ];
    }

    if (params?.tags?.length) {
      where.tags = {
        some: {
          id: { in: params.tags },
        },
      };
    }

    // Date range filtering
    if (params?.createdAfter || params?.createdBefore) {
      where.createdAt = {};
      if (params.createdAfter) {
        where.createdAt.gte = new Date(params.createdAfter);
      }
      if (params.createdBefore) {
        where.createdAt.lte = new Date(params.createdBefore);
      }
    }

    // Age range filtering (convert age to date of birth range)
    if (params?.minAge !== undefined || params?.maxAge !== undefined) {
      where.dateOfBirth = {};
      if (params.maxAge !== undefined) {
        // Max age means oldest birth date (furthest in the past)
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(maxAgeDate.getFullYear() - params.maxAge - 1);
        where.dateOfBirth.gte = maxAgeDate;
      }
      if (params.minAge !== undefined) {
        // Min age means youngest birth date (most recent)
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - params.minAge);
        where.dateOfBirth.lte = minAgeDate;
      }
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

  async findByImageId(imageId: string) {
    return prisma.single.findUnique({
      where: { imageId },
      select: {
        id: true,
        imageId: true,
        imageUrl: true,
      }
    });
  },
}; 