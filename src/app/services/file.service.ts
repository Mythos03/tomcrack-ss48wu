import {Injectable, NgZone} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {from, map, Observable} from 'rxjs';
import {File} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly collectionName = 'files';
  private readonly filesCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private ngZone: NgZone) {
    this.filesCollection = collection(this.firestore, this.collectionName);
  }

  private toFirestore(file: Partial<File>): DocumentData {
    return {
      name: file.name || '',
      size: file.size || 0,
      path: file.path || '',
      category: file.category || null,
      description: file.description || '',
      uploader: file.uploader || null,
      uploadDate: file.uploadDate || new Date(),
      createdAt: file.createdAt || new Date()
    };
  }

  private fromFirestore(data: DocumentData): File {
    return {
      id: data['id'],
      name: data['name'] || '',
      size: data['size'] || 0,
      path: data['path'] || '',
      category: data['category'] || null,
      description: data['description'] || '',
      uploader: data['uploader'],
      uploadDate: data['uploadDate'] instanceof Timestamp
        ? data['uploadDate'].toDate()
        : new Date(data['uploadDate']),
      createdAt: data['createdAt'] instanceof Timestamp
        ? data['createdAt'].toDate()
        : new Date(data['createdAt'])
    };
  }

  addFile(file: Omit<File, 'id'>): Observable<DocumentReference> {
    const fileData = this.toFirestore(file);
    return from(addDoc(this.filesCollection, fileData));
  }

  getFiles(): Observable<File[]> {
    return new Observable(observer => {
      this.ngZone.run(() => {
        collectionData(this.filesCollection, { idField: 'id' })
          .pipe(map(files => files.map(file => this.fromFirestore(file))))
          .subscribe(observer);
      });
    });
  }

  getFileById(id: string): Observable<File | undefined> {
    const fileRef = doc(this.firestore, this.collectionName, id);
    return new Observable(observer => {
      this.ngZone.run(() => {
        docData(fileRef, { idField: 'id' })
          .pipe(map(file => file ? this.fromFirestore(file) : undefined))
          .subscribe(observer);
      });
    });
  }

  updateFile(id: string, file: Partial<File>): Observable<void> {
    const fileRef = doc(this.firestore, this.collectionName, id);
    const updateData = this.toFirestore(file);
    return from(updateDoc(fileRef, updateData));
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
    return new Observable(observer => {
      this.ngZone.run(() => {
        collectionData(q, { idField: 'id' })
          .pipe(map(files => files.map(file => this.fromFirestore(file))))
          .subscribe(observer);
      });
    });
  }
}
