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
      next: () => {
        // Obtenemos el rol del usuario después del login exitoso
        const userRole = this.authService.getUserRole();
        
        // --- AQUÍ ESTÁ EL LOG PARA DEPURAR ---
        console.log('Rol de usuario decodificado:', userRole);
        // --- FIN DEL LOG ---

        if (userRole === 'Admin') {
          this.router.navigate(['/admin/appointments']);
        } else if (userRole === 'Cliente') {
          this.router.navigate(['/client/appointments']);
        } else {
          // Si el rol no se reconoce, redirigir a una página por defecto o a login
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.errorMessage.set('Credenciales incorrectas. Intenta de nuevo.');
        console.error('Error en el login:', err);
      }
    });
  }
}
