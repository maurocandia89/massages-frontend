import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importación corregida: ahora apunta al servicio
import { AuthService } from '../../services/auth.service';
import { RegisterUser } from '../../types/auth.types';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  // Las propiedades del signal ahora usan camelCase para coincidir con el HTML
  user = signal<RegisterUser>({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });
  // Usamos un array para almacenar múltiples mensajes de error
  errorMessages = signal<string[]>([]);

  constructor(private authService: AuthService, private router: Router) { }

  updateUser(field: keyof RegisterUser, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.update(current => ({ ...current, [field]: value }));
  }

  register(): void {
    // Limpiamos los mensajes de error antes de cada intento
    this.errorMessages.set([]);

    this.authService.register(this.user()).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // La API devuelve un array de errores si el registro falla
        if (err.error && Array.isArray(err.error)) {
          // Extraemos las descripciones de los errores y las mostramos
          const messages = err.error.map((e: any) => e.description);
          this.errorMessages.set(messages);
        } else {
          this.errorMessages.set(['Error en el registro. Intenta de nuevo.']);
        }
        console.error('Error en el registro:', err);
      }
    });
  }
}
