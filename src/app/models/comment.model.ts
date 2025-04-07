import { User } from './user.model';
import { File } from './file.model';
import { v4 as uuidv4 } from 'uuid';

export interface Comment {
  id: string;
  content: string;
  author: User;
  file: File;
  createdAt: Date;
}

export function createComment(content: string, author: User, file: File): Comment {
  return {
    id: uuidv4(),
    content,
    author,
    file,
    createdAt: new Date()
  };
}
