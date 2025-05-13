// src/app/data/mock-users.ts
import {User} from '../models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'Admin',
    email: 'admin@example.com',
    password: 'hashed_password',
    role: 'admin'
  },
  {
    id: '2',
    username: 'User123',
    email: 'user123@example.com',
    password: 'hashed_password',
    role: 'user'
  }
];
