import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  query,
  where,
  orderBy,
  limit,
  CollectionReference,
  DocumentData,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { from, Observable, map } from 'rxjs';
import { File } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly collectionName = 'files';
  private readonly filesCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.filesCollection = collection(this.firestore, this.collectionName);
  }

  private toFirestore(file: Partial<File>): DocumentData {
    const data: DocumentData = { ...file };

    if (file.uploadDate) {
      data['uploadDate'] = file.uploadDate.toISOString();
    }

    // For new documents, set server timestamp
    if (!('createdAt' in file)) {
      data['createdAt'] = serverTimestamp();
    }
    // For updates, if createdAt exists, convert to ISO string
    else if (file.createdAt) {
      data['createdAt'] = file.createdAt.toISOString();
    }

    return data;
  }

  private fromFirestore(data: DocumentData): File {
    return {
      ...data,
      id: data['id'],
      uploadDate: new Date(data['uploadDate'] as string),
      createdAt: data['createdAt'] instanceof Timestamp
        ? (data['createdAt'] as Timestamp).toDate()
        : new Date(data['createdAt'] as string),
      category: data['category'],
      uploader: data['uploader']
    } as File;
  }

  addFile(file: Omit<File, 'id' | 'createdAt'>): Observable<DocumentReference> {
    return from(addDoc(this.filesCollection, this.toFirestore(file)));
  }

  getFiles(): Observable<File[]> {
    return collectionData(this.filesCollection, { idField: 'id' }).pipe(
      map(files => files.map(file => this.fromFirestore(file)))
    );
  }

  getFileById(id: string): Observable<File | undefined> {
    const fileRef = doc(this.firestore, this.collectionName, id);
    return docData(fileRef, { idField: 'id' }).pipe(
      map(file => file ? this.fromFirestore(file) : undefined)
    );
  }

  updateFile(id: string, file: Partial<File>): Observable<void> {
    const fileRef = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(fileRef, this.toFirestore(file)));
  }

  deleteFile(id: string): Observable<void> {
    const fileRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(fileRef));
  }

  getFilesByCategory(categoryId: string): Observable<File[]> {
    const q = query(
      this.filesCollection,
      where('category.id', '==', categoryId),
      orderBy('uploadDate', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(files => files.map(file => this.fromFirestore(file)))
    );
  }

  getFilesByUploader(uploaderId: string): Observable<File[]> {
    const q = query(
      this.filesCollection,
      where('uploader.id', '==', uploaderId),
      orderBy('uploadDate', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(files => files.map(file => this.fromFirestore(file)))
    );
  }

  getRecentFiles(limitCount: number): Observable<File[]> {
    const q = query(
      this.filesCollection,
      orderBy('uploadDate', 'desc'),
      limit(limitCount)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(files => files.map(file => this.fromFirestore(file)))
    );
  }

  searchFilesByName(searchTerm: string): Observable<File[]> {
    const q = query(
      this.filesCollection,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      orderBy('name'),
      limit(10)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(files => files.map(file => this.fromFirestore(file)))
    );
  }
}
