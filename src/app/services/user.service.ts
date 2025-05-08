import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  CollectionReference,
  DocumentData,
  addDoc,
  DocumentReference,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import {from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly collectionName = 'users';
  private readonly usersCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, this.collectionName);
  }

  /**
   * Creates a new user document in Firestore.
   * WARNING: Ensure the password is properly hashed before calling this method.
   */
  addUser(user: User): Observable<DocumentReference<User>> {
    const userData = {
      ...user,
      role: user.role || 'user' // Default to 'user' role if not specified
    };

    return from(addDoc(this.usersCollection, userData)) as Observable<DocumentReference<User>>;
  }

  getAllUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(id: string): Observable<User | undefined> {
    const userRef = doc(this.firestore, this.collectionName, id);
    return docData(userRef, { idField: 'id' }) as Observable<User>;
  }

  updateUser(id: string, user: Partial<User>): Observable<void> {
    const userRef = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(userRef, user));
  }

  deleteUser(id: string): Observable<void> {
    const userRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(userRef));
  }

  getUserByEmail(email: string): Observable<User[]> {
    const q = query(
      this.usersCollection,
      where('email', '==', email),
      limit(1)
    );
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }

  getUsersByRole(role: 'admin' | 'moderator' | 'user'): Observable<User[]> {
    const q = query(
      this.usersCollection,
      where('role', '==', role)
    );
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }
}
