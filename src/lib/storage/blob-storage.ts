import { put, del } from '@vercel/blob';

export interface StorageService {
  uploadFile: (buffer: Buffer, options: UploadOptions) => Promise<StorageResult>;
  deleteFile: (path: string) => Promise<void>;
}

export interface StorageResult {
  url: string;
  pathname: string;
}

export interface UploadOptions {
  filename: string;
  contentType: string;
}

export class BlobStorageService implements StorageService {
  async uploadFile(buffer: Buffer, { filename, contentType }: UploadOptions): Promise<StorageResult> {
    const blob = await put(filename, buffer, {
      contentType,
      access: 'public',
    });
    
    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  }

  async deleteFile(path: string): Promise<void> {
    await del(path);
  }
}

export const storage = new BlobStorageService(); 