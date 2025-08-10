import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from '../app/shared/interceptor/auth.interceptor'; // ✨ IMPORTACIÓN CORREGIDA

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ✨ CONFIGURACIÓN CLAVE: Registramos el interceptor aquí
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
