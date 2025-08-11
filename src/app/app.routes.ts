// Importa los componentes necesarios para las rutas
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ClientAppointmentsComponent } from './features/appointments/components/client-appointments/client-appointments.component';
import { AdminAppointmentsComponent } from './features/appointments/components/admin-appointments/admin-appointments.component';
import { AdminTreatmentsComponent } from './features/appointments/components/admin-treatments/admin-treatments.component';

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
  { path: 'admin/treatments', component: AdminTreatmentsComponent },

  // Ruta comodín para manejar cualquier otra URL
  { path: '**', redirectTo: 'login' },
];

// Nota: Con Angular Standalone, no necesitas un @NgModule para las rutas.
// Las rutas se exportan directamente como una constante.
