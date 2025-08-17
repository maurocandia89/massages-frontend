import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RegisterUser } from '../../types/auth.types';

declare const Swal: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user = signal<RegisterUser>({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });
  errorMessages = signal<string[]>([]);

  constructor(private authService: AuthService, private router: Router) { }

  updateUser(field: keyof RegisterUser, value: string): void {
    this.user.update(current => ({ ...current, [field]: value }));
  }

  isFormValid = computed(() => {
  const u = this.user();
  return (
    u.name.trim() !== '' &&
    u.lastName.trim() !== '' &&
    u.email.trim() !== '' &&
    u.password.trim() !== '' &&
    this.isEmailValid(u.email)
  );
});


  register(): void {
    if (!this.isFormValid()) {
      this.errorMessages.set(['Por favor, completa todos los campos.']);
      return;
    }

    this.errorMessages.set([]);

    this.authService.register(this.user()).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          icon: 'success',
          confirmButtonText: 'Continuar'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        if (err.error && Array.isArray(err.error)) {
          const messages = err.error.map((e: any) => e.description);
          this.errorMessages.set(messages);
        } else {
          this.errorMessages.set(['Error en el registro. Intenta de nuevo.']);
        }
        console.error('Error en el registro:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }

  isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

}
