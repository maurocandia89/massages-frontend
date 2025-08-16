import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../app/features/auth/services/auth.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      // Tap es útil para realizar efectos secundarios, como la redirección
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          // Si el usuario no está logueado, lo redirigimos a la página de login
          console.log('Acceso denegado. Redirigiendo a login.');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
