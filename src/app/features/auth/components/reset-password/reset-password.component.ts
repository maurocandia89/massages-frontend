import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  reset(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.message.set('Las contraseñas no coinciden.');
      return;
    }

    this.http.post('https://localhost:44308/api/Auth/reset-password', {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.message.set('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
         setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      },
      error: () => {
        this.message.set('Hubo un error al actualizar la contraseña.');
      }
    });
  }
}

