import { prisma } from '@/lib/db/prisma';
import { Tag } from '@prisma/client';

export class TagRepository {
  static async updateSingleTags(singleId: string, tagNames: string[]): Promise<Tag[]> {
    // Get existing single with tags
    const single = await prisma.single.findUnique({
      where: { id: singleId },
      include: { tags: true }
    });

    if (!single) {
      throw new Error('Single not found');
    }

    // Delete existing tags
    await prisma.single.update({
      where: { id: singleId },
      data: {
        tags: {
          disconnect: single.tags.map(tag => ({ id: tag.id }))
        }
      }
    });

    // Create new tags and connect them
    const updatedSingle = await prisma.single.update({
      where: { id: singleId },
      data: {
        tags: {
          connectOrCreate: tagNames.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },
      include: {
        tags: true
      }
    });

    return updatedSingle.tags;
  }
} 