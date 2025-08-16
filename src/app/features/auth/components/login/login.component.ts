import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { LoginUser } from '../../types/auth.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user = signal<LoginUser>({
    email: '',
    password: ''
  });
  errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) { }

  updateUser(field: keyof LoginUser, value: string): void {
    this.user.update(current => ({ ...current, [field]: value }));
  }

  login(): void {
    this.authService.login(this.user()).subscribe({
      next: (response) => {
  localStorage.setItem('token', response.token); // ✅ Guardar token

  const userRole = this.authService.getUserRole();

  if (userRole === 'Admin') {
    this.router.navigate(['/admin/appointments']);
  } else if (userRole === 'Cliente') {
    this.router.navigate(['/client/appointments']);
  } else {
    this.router.navigate(['/login']);
  }
},

      // next: () => {

      //   const userRole = this.authService.getUserRole();

      //   if (userRole === 'Admin') {
      //     this.router.navigate(['/admin/appointments']);
      //   } else if (userRole === 'Cliente') {
      //     this.router.navigate(['/client/appointments']);
      //   } else {

      //     this.router.navigate(['/login']);
      //   }
      // },
      error: (err) => {
        this.errorMessage.set('Credenciales incorrectas. Intenta de nuevo.');
      }
    });
  }
}
