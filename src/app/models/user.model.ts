export interface User {
  id: string;        // UUID azonosító
  username: string;  // Felhasználónév
  email: string;     // Email cím
  password: string;  // Jelszó (titkosítva kellene tárolni)
  role: "admin" | "moderator" | "user";  // Jogosultság szintje
}
