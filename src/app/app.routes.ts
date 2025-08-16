// import { Routes } from '@angular/router';
// import { LoginComponent } from './features/auth/components/login/login.component';
// import { RegisterComponent } from './features/auth/components/register/register.component';
// import { ClientAppointmentsComponent } from './features/appointments/components/client-appointments/client-appointments.component';
// import { AdminAppointmentsComponent } from './features/appointments/components/admin-appointments/admin-appointments.component';
// import { AdminTreatmentsComponent } from './features/appointments/components/admin-treatments/admin-treatments.component';


// export const routes: Routes = [

//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'admin/appointments', component: AdminAppointmentsComponent },
//   { path: 'client/appointments', component: ClientAppointmentsComponent },
//   { path: 'admin/treatments', component: AdminTreatmentsComponent },
//   { path: '**', redirectTo: 'login' },
// ];

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ClientAppointmentsComponent } from './features/appointments/components/client-appointments/client-appointments.component';
import { AdminAppointmentsComponent } from './features/appointments/components/admin-appointments/admin-appointments.component';
import { AdminTreatmentsComponent } from './features/appointments/components/admin-treatments/admin-treatments.component';
import { AuthGuard } from '../app/app.guard'; // Importa tu guardia de ruta

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rutas protegidas por el guardia de autenticación
  { path: 'admin/appointments', component: AdminAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'client/appointments', component: ClientAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'admin/treatments', component: AdminTreatmentsComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: 'login' },
];
