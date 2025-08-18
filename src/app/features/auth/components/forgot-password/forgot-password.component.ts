import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email = signal('');
  message = signal<string | null>(null);

  constructor(private authService: AuthService) { }

  loading = signal(false);

  sendRecovery(): void {
    if (!this.email().trim()) {
      this.message.set('Por favor, ingresa tu email.');
      return;
    }

    this.loading.set(true);
    this.authService.forgotPassword(this.email()).subscribe({
      next: () => {
        this.message.set('Se envió un correo con instrucciones para recuperar tu contraseña.');
      },
      error: () => {
        this.message.set('No se pudo enviar el correo. Verifica tu email o intenta más tarde.');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
