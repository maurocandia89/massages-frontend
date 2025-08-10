import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../types/appoinment.types';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-appointments.component.html',
})
export class AdminAppointmentsComponent implements OnInit {
  private appointmentsService = inject(AppointmentsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  dateFilter: string | null = null;
  clientNameFilter: string = '';

  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  sortBy = signal<string | null>('appointmentDate');
  sortDirection = signal<'asc' | 'desc'>('asc');
  userRole = signal<string | null>(null);
  ngOnInit(): void {
    this.userRole.set(this.authService.getUserRole());
    if (this.userRole() === 'Admin') {
      this.fetchAppointments();
    } else {
      this.errorMessage.set('No tienes permisos para ver esta página.');
      this.loading.set(false);
    }
  }

  fetchAppointments(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService.getAppointments(
      this.dateFilter || '',
      this.clientNameFilter,
      this.sortBy(),
      this.sortDirection()
    ).subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.loading.set(false);
        if (data.length === 0) {
          this.errorMessage.set('No se encontraron turnos con los filtros aplicados.');
        }
      },
      error: (err) => {
        console.error('Error al obtener los turnos:', err);
        this.errorMessage.set('Hubo un error al cargar los turnos.');
        this.loading.set(false);
      }
    });
  }

  sort(column: string): void {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
    this.fetchAppointments();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
