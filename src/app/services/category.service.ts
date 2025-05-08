import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  CollectionReference,
  DocumentData,
  DocumentReference,
  addDoc,
  collectionData,
  docData,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from '@angular/fire/firestore';
import { Category } from '../models/category.model';
import {from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly collectionName = 'categories';
  private readonly categoriesCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.categoriesCollection = collection(this.firestore, this.collectionName);
  }

  addCategory(category: Category): Observable<DocumentReference<Category>> {
    return from(addDoc(this.categoriesCollection, category)) as Observable<DocumentReference<Category>>;
  }

  getAllCategories(): Observable<Category[]> {
    return collectionData(this.categoriesCollection, { idField: 'id' }) as Observable<Category[]>;
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    const categoryRef = doc(this.firestore, this.collectionName, id);
    return docData(categoryRef, { idField: 'id' }) as Observable<Category>;
  }

  updateCategory(id: string, category: Partial<Category>): Observable<void> {
    const categoryRef = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(categoryRef, category));
  }

  deleteCategory(id: string): Observable<void> {
    const categoryRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(categoryRef));
  }

  searchCategoriesByName(name: string): Observable<Category[]> {
    const q = query(
      this.categoriesCollection,
      orderBy('name'),
      where('name', '>=', name),
      where('name', '<=', name + '\uf8ff')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }
}
