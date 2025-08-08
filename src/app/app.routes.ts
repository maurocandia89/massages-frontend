import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa los componentes de autenticación que hemos creado
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AppointmentsListComponent } from './features/appointments/components/appointments-list/appointments-list.component';

export const routes: Routes = [
  // Ruta principal que redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Rutas de autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Ruta de citas, que será protegida más adelante
  { path: 'appointments', component: AppointmentsListComponent },
  // Ruta comodín para manejar páginas no encontradas
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
