import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RegisterUser, LoginUser } from '../types/auth.types';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7037/api/Auth';
  private token = signal<string | null>(localStorage.getItem('jwtToken'));
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.token());

  constructor(private http: HttpClient, private router: Router) { }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  register(user: RegisterUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: LoginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        localStorage.setItem('jwtToken', response.token);
        this.token.set(response.token);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  getToken(): string | null {
    return this.token();
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.token.set(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
}
