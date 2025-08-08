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

  updateUser(field: keyof LoginUser, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.update(current => ({ ...current, [field]: value }));
  }

  login(): void {
    this.authService.login(this.user()).subscribe({
      next: (response) => {
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.errorMessage.set('Credenciales incorrectas. Intenta de nuevo.');
        console.error('Error en el login:', err);
      }
    });
  }
}
