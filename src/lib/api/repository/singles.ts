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
        { phoneNumber: { contains: params.search } },
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

  async findByImageId(imageId: string) {
    return prisma.single.findFirst({
      where: { imageId },
      select: {
        id: true,
        imageId: true,
        imageUrl: true,
      }
    });
  },
}; 