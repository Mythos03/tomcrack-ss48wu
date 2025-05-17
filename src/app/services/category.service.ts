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
  getDoc,
  orderBy,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {Category} from '../models/category.model';
import {from, map, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

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
    return from(getDoc(categoryRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return doc.data() as Category;
        } else {
          console.warn('Category not found.');
          return undefined;
        }
      }),
      catchError(error => {
        console.error('Error fetching category:', error);
        return of(undefined);
      })
    );
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
