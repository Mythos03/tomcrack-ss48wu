// src/app/models/file.model.ts
import { Category } from './category.model';
import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';

export interface File {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
  category: Category;
  uploadDate: Date;
  description: string;
  uploader: User;
}

export function createFile(name: string, size: number, downloadUrl: string, category: Category, description: string, uploader: User): File {
  return {
    id: uuidv4(),
    name,
    size,
    downloadUrl,
    category,
    uploadDate: new Date(),
    description,
    uploader
  };
}

export type { Category };
