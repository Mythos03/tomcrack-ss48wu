import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: '1', username: 'Admin', email: 'admin@example.com', password: 'hashed_password', role: 'admin' },
    { id: '2', username: 'User123', email: 'user123@example.com', password: 'hashed_password', role: 'user' }
  ];

  constructor() {}

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}
