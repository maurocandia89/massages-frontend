// Importa los componentes necesarios para las rutas
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AdminAppointmentsComponent } from './features/appointments/components/admin-appointments/admin-appointments.component';
import { ClientAppointmentsComponent } from './features/appointments/components/client-appointments/client-appointments.component';

// Define las rutas de la aplicación.
export const routes: Routes = [
  // Redirección por defecto a la página de inicio de sesión
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rutas de autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rutas protegidas que ahora usamos
  { path: 'admin/appointments', component: AdminAppointmentsComponent },
  { path: 'client/appointments', component: ClientAppointmentsComponent },
  
  // Ruta comodín para manejar cualquier otra URL
  { path: '**', redirectTo: 'login' },
];

// Nota: Con Angular Standalone, no necesitas un @NgModule para las rutas.
// Las rutas se exportan directamente como una constante.
