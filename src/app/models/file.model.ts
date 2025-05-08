import { Category } from './category.model';
import { User } from './user.model';

export interface File {
  id?: string;
  name: string;
  size: number;
  downloadUrl: string;
  category: Category;
  uploadDate: Date;
  createdAt: Date;
  description: string;
  uploader: User;
}

// Helper function to create a new file (optional)
export function createFile(
  name: string,
  size: number,
  downloadUrl: string,
  category: Category,
  description: string,
  uploader: User
): Omit<File, 'id'> {
  return {
    name,
    size,
    downloadUrl,
    category,
    uploadDate: new Date(),
    createdAt: new Date(),
    description,
    uploader
  };
}
