import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/lib/storage/blob-storage';

export async function saveImage(base64Image: string): Promise<{ imageId: string, imageUrl: string }> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  const imageId = uuidv4();
  const filename = `singles-images/${imageId}.jpg`;

  const result = await storage.uploadFile(buffer, {
    filename,
    contentType: 'image/jpeg',
  });

  return {
    imageId,
    imageUrl: result.url,
  };
}

export async function deleteImage(imageUrl: string | null) {
  if (!imageUrl) return;
  
  try {
    await storage.deleteFile(imageUrl);
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}