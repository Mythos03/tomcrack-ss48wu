import {Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | null = null;
  private readonly userCollection = 'users';

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(this.firestore, this.userCollection, firebaseUser.uid));
        if (userDoc.exists()) {
          this.user = userDoc.data() as User;
        }
      } else {
        this.user = null;
      }
    });
  }

  get currentUser(): User | null {
    return this.user;
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => this.getUserData(credential.user.uid)),
      tap((user) => this.user = user),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(userData: Omit<User, 'id'>): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, userData.email, userData.password)).pipe(
      switchMap(async (credential) => {
        const user: User = {
          id: credential.user.uid,
          username: userData.username,
          email: userData.email,
          password: '', // Don't store the actual password
          role: 'user' // Default role for new users
        };

        await setDoc(doc(this.firestore, this.userCollection, user.id), user);
        await updateProfile(credential.user, { displayName: user.username });

        return user;
      }),
      tap((user) => this.user = user),
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => this.user = null),
      catchError((error) => {
        console.error('Logout error:', error);
        throw error;
      })
    );
  }

  private getUserData(uid: string): Observable<User> {
    const userDoc = doc(this.firestore, this.userCollection, uid);
    return from(getDoc(userDoc)).pipe(
      map(doc => {
        if (doc.exists()) {
          return doc.data() as User;
        }
        // Instead of returning null, throw a specific error
        throw new Error('User not found');
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        // Re-throw the error to be handled by the caller
        throw error;
      })
    );
  }
}
