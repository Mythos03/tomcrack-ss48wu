import {createFile, File} from "../models/file.model";
import {Category} from "../models/category.model";
import {User} from "../models/user.model";

const softwareCategory: Category = { id: '1', name: 'Szoftver' };
const musicCategory: Category = { id: '2', name: 'Zene' };

const adminUser: User = { id: '1', username: 'Admin', email: 'admin@example.com', password: 'hashed_password', role: 'admin' };
const user123: User = { id: '2', username: 'User123', email: 'user123@example.com', password: 'hashed_password', role: 'user' };

export const MOCK_FILES: File[] = [
  createFile("Windows ISO", 5000000000, "https://example.com/windows.iso", softwareCategory, "Egy teljesen legális operációs rendszer ISO fájl.", adminUser),
  createFile("Cyberpunk OST", 120000000, "https://example.com/cyberpunk-ost.zip", musicCategory, "Cyberpunk 2077 hivatalos zenéi.", user123)
];
