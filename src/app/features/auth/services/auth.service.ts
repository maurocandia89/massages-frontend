import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RegisterUser, LoginUser } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../src/environments/environment';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private token = signal<string | null>(localStorage.getItem('jwtToken'));
  private userRole = signal<string | null>(null); // Nuevo signal para el rol
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.token());

  constructor(private http: HttpClient, private router: Router) {
    if (this.token()) {
      this.decodeToken();
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUserRole(): string | null {
    return this.userRole();
  }

  private decodeToken(): void {
    if (this.token()) {
      try {
        const decodedToken: any = jwtDecode(this.token()!);
        this.userRole.set(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null);
      } catch (error) {
        console.error('Error decodificando el token:', error);
        this.logout();
      }
    }
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
        this.decodeToken();
      })
    );
  }

  getToken(): string | null {
  return localStorage.getItem('token');
}

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.token.set(null);
    this.userRole.set(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  confirmEmail(userId: string, token: string): Observable<any> {
  const url = `${this.apiUrl}/confirm-email?userId=${userId}&token=${token}`;
  return this.http.get(url);
}

forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, { email });
}

resetPassword(email: string, token: string, newPassword: string): Observable<any> {
  return this.http.post(`${environment.apiUrl}/reset-password`, {
  email: email,
  token: token,
  newPassword: newPassword
});
}

}
