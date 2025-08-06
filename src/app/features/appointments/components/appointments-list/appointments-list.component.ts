import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../types/appoinment.types';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AppointmentFormComponent],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  private appointmentsService = inject(AppointmentsService);

  public appointments = signal<Appointment[]>([]);
  public loading = signal<boolean>(false);
  public clientNameFilter = signal<string>('');
  public dateFilter = signal<string>('');
  public showPopup = signal<boolean>(false);
  public selectedAppointment = signal<Appointment | null>(null);
  public sortField = signal<string | null>(null);
  public sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.onSearch();
  }

onSearch(): void {
    this.loading.set(true);
    this.appointmentsService
      .getAppointments(this.dateFilter(), this.clientNameFilter(), this.sortField(), this.sortDirection())
      .subscribe({
        next: (data) => {
          this.appointments.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al obtener los turnos:', err);
          this.loading.set(false);
        },
      });
  }

  onSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.onSearch();
  }

  openFormPopup(appointment: Appointment | null): void {
    this.selectedAppointment.set(appointment);
    this.showPopup.set(true);
  }

  onAppointmentSubmitted(): void {
    this.showPopup.set(false);
    this.onSearch();
  }

  onAppointmentCanceled(): void {
    this.showPopup.set(false);
    this.selectedAppointment.set(null);
  }

  onDeleteAppointment(id: number): void {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      this.appointmentsService.deleteAppointment(id).subscribe({
        next: () => {
          console.log('Turno eliminado con éxito');
          this.onSearch();
        },
        error: (err) => {
          console.error('Error al eliminar el turno:', err);
        },
      });
    }
  }
}