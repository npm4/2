import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private users: User[] = [];
  private nextId = 1;

  constructor() { 
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    
    // Load users from localStorage if available
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.nextId = Math.max(...this.users.map(u => u.id || 0), 0) + 1;
    }
  }

  register(user: User): Observable<User> {
    // Check if email already exists
    if (this.users.find(u => u.email === user.email)) {
      return throwError(() => new Error('Email already exists'));
    }
    
    const newUser: User = {
      ...user,
      id: this.nextId++
    };
    
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    
    // Return a new user object without the password
    const { password, ...userWithoutPassword } = newUser;
    return of(userWithoutPassword as User);
  }

  login(email: string, password: string): Observable<User> {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
    
    // Create a copy without the password to store in localStorage
    const { password: _, ...userWithoutPassword } = user;
    
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword as User);
    
    return of(userWithoutPassword as User);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
