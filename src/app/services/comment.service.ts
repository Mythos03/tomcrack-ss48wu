// src/app/services/comment.service.ts
import { Injectable } from '@angular/core';
import { Comment, createComment } from '../models/comment.model';
import { User } from '../models/user.model';
import { File } from '../models/file.model';
import { MOCK_FILES } from '../data/mock-files';
import { MOCK_USERS } from '../data/mock-users';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = [
    createComment('This is a default comment', MOCK_USERS[0], MOCK_FILES[0]),
    createComment('Another default comment', MOCK_USERS[1], MOCK_FILES[1])
  ];

  getCommentsForFile(file: File): Comment[] {
    return this.comments.filter(comment => comment.file.id === file.id);
  }

  addComment(content: string, author: User, file: File): void {
    const newComment = createComment(content, author, file);
    this.comments.push(newComment);
  }

  deleteComment(commentId: string): void {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
  }
}
