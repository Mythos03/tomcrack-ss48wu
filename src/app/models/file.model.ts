import { User } from './user.model';
import { Category } from './category.model';
import { Comment } from './comment.model';

export interface File {
  id: string;
  name: string;
  size: number;
  path: string;
  category?: Category | null;
  uploadDate: Date;
  createdAt: Date;
  description?: string;
  uploader?: User;
  comments?: Comment[];
}

export function createFile(
  name: string,
  size: number,
  path: string,
  category: Category | null,
  description: string,
  uploader?: User
): Omit<File, 'id'> {
  return {
    name,
    size,
    path,
    category,
    uploadDate: new Date(),
    createdAt: new Date(),
    description,
    uploader
  };
}
