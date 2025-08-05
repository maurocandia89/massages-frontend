import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../types/appoinment.types';

@Component({
  selector: 'app-appointments-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  private appointmentsService = inject(AppointmentsService);

  // Signals para manejar el estado
  public appointments = signal<Appointment[]>([]);
  public loading = signal<boolean>(false);
  public clientNameFilter = signal<string>('');
  public dateFilter = signal<string>('');

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.loading.set(true);
    this.appointmentsService
      .getAppointments(this.dateFilter(), this.clientNameFilter())
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
}