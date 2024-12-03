import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const SINGLES_IMAGES_DIR = path.join(process.cwd(), 'assets', 'singles-images');

// Ensure singles images directory exists
if (!fs.existsSync(SINGLES_IMAGES_DIR)) {
  fs.mkdirSync(SINGLES_IMAGES_DIR, { recursive: true });
}

export async function saveImage(base64Image: string): Promise<string> {
  // Extract the base64 data
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Generate unique ID for the image
  const imageId = uuidv4();
  const filepath = path.join(SINGLES_IMAGES_DIR, `${imageId}.jpg`);
  
  // Save the file
  await fs.promises.writeFile(filepath, buffer);
  
  // Return just the image ID
  return imageId;
}

export async function deleteImage(imageId: string | null) {
  if (!imageId) return;
  
  try {
    const filepath = path.join(SINGLES_IMAGES_DIR, `${imageId}.jpg`);
    await fs.promises.unlink(filepath);
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}

export function getImagePath(imageId: string): string {
  return path.join(SINGLES_IMAGES_DIR, `${imageId}.jpg`);
} 