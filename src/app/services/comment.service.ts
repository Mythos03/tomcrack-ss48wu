import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {from, map, Observable} from 'rxjs';
import {Comment} from '../models/comment.model';
import {File} from '../models/file.model';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly collectionName = 'comments';
  private readonly commentsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.commentsCollection = collection(this.firestore, this.collectionName);
  }

  private toFirestore(comment: Partial<Comment>): DocumentData {
    const data: DocumentData = { ...comment };
    if (!('createdAt' in comment)) {
      data['createdAt'] = serverTimestamp();
    } else if (comment.createdAt) {
      data['createdAt'] = comment.createdAt.toISOString();
    }
    return data;
  }

  private fromFirestore(data: DocumentData): Comment {
    return {
      ...data,
      id: data['id'],
      createdAt: data['createdAt']
        ? (data['createdAt'] instanceof Timestamp
            ? (data['createdAt'] as Timestamp).toDate()
            : new Date(data['createdAt'] as string))
        : new Date()
    } as Comment;
  }

  getCommentsForFile(fileId: string): Observable<Comment[]> {
    const q = query(
      this.commentsCollection,
      where('file.id', '==', fileId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(comments => comments.map(comment => this.fromFirestore(comment)))
    );
  }

  addComment(comment: Comment): Observable<DocumentReference<Comment>> {
    const commentData = {
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      author: { ...comment.author },
      file: { ...comment.file }
    };

    return from(addDoc(this.commentsCollection, commentData)) as Observable<DocumentReference<Comment>>;
  }

  deleteComment(commentId: string): Observable<void> {
    const commentRef = doc(this.firestore, this.collectionName, commentId);
    return from(deleteDoc(commentRef));
  }

  updateComment(id: string, updated: Partial<Comment>): Observable<void> {
    const commentRef = doc(this.firestore, this.collectionName, id);
    const updateData: DocumentData = {};

    if (updated.content) {
      updateData['content'] = updated.content;
    }

    if (updated.createdAt) {
      updateData['createdAt'] = updated.createdAt.toISOString();
    }

    if (updated.author) {
      updateData['author'] = { ...updated.author };
    }

    if (updated.file) {
      updateData['file'] = { ...updated.file };
    }

    return from(updateDoc(commentRef, updateData));
  }

  getCommentsByFileId(fileId: string): Observable<Comment[]> {
    const q = query(
      this.commentsCollection,
      where('file.id', '==', fileId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(comments => comments.map(data => ({
        ...data,
        createdAt: data['createdAt'] instanceof Timestamp
          ? (data['createdAt'] as Timestamp).toDate()
          : (data['createdAt'] ? new Date(data['createdAt'] as string) : new Date()),
        author: data['author'] as User,
        file: data['file'] as File
      } as Comment)))
    );
  }

  getCommentsByUserId(userId: string): Observable<Comment[]> {
    const q = query(
      this.commentsCollection,
      where('author.id', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(comments => comments.map(data => ({
        ...data,
        createdAt: data['createdAt'] instanceof Timestamp
          ? (data['createdAt'] as Timestamp).toDate()
          : (data['createdAt'] ? new Date(data['createdAt'] as string) : new Date()),
        author: data['author'] as User,
        file: data['file'] as File
      } as Comment)))
    );
  }
}
