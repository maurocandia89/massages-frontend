import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service'; // Asegúrate de la ruta correcta a TU servicio

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Si hay un token, clona la solicitud y agrega el encabezado de autorización
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Si no hay token, continúa con la solicitud original sin cambios
  return next(req);
};
