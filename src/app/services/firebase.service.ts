import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private analytics: Analytics = getAnalytics(this.app);
  private firestore: Firestore = getFirestore(this.app);
  private auth: Auth = getAuth(this.app);

  getFirestore(): Firestore {
    return this.firestore;
  }

  getAuth(): Auth {
    return this.auth;
  }

  getAnalytics(): Analytics {
    return this.analytics;
  }
}
