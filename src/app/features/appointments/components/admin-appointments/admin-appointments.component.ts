import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment, Treatment } from '../../types/appoinment.types';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { TreatmentsService } from '../../services/treatments.service';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-admin-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './admin-appointments.component.html',
})
export class AdminAppointmentsComponent implements OnInit {
    private appointmentsService = inject(AppointmentsService);
    private treatmentsService = inject(TreatmentsService);
    private router = inject(Router);
    private authService = inject(AuthService);

    dateFilter: string | null = null;
    clientNameFilter: string = '';

    appointments = signal<Appointment[]>([]);
    treatments = signal<Treatment[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);
    sortBy = signal<string | null>('appointmentDate');
    sortDirection = signal<'asc' | 'desc'>('asc');
    userRole = signal<string | null>(null);

    ngOnInit(): void {
        this.userRole.set(this.authService.getUserRole());
        if (this.userRole() === 'Admin') {
            this.fetchData();
        } else {
            this.errorMessage.set('No tienes permisos para ver esta página.');
            this.loading.set(false);
        }
    }

    fetchData(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        combineLatest([
            this.appointmentsService.getAppointments(this.dateFilter || '', this.clientNameFilter, this.sortBy(), this.sortDirection()),
            this.treatmentsService.getTreatments()
        ]).subscribe({
            next: ([appointments, treatments]) => {
                const treatmentsMap = new Map(treatments.map(t => [t.id, t.title]));
                const appointmentsWithTitles = appointments.map(app => ({
                    ...app,
                    treatmentTitle: treatmentsMap.get(app.treatmentId) || 'Desconocido'
                }));
                this.appointments.set(appointmentsWithTitles);
                this.treatments.set(treatments);
                this.loading.set(false);
                if (appointments.length === 0) {
                    this.errorMessage.set('No se encontraron turnos con los filtros aplicados.');
                }
            },
            error: (err) => {
                console.error('Error al obtener los datos:', err);
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
        this.fetchData();
    }

    // Nuevo método para navegar al componente de gestión de tratamientos
    navigateToTreatments(): void {
        this.router.navigate(['/admin/treatments']);
    }

    onLogout(): void {
        this.authService.logout();
    }
}