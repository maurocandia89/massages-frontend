import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../types/appoinment.types';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component'; // ¡Importar el nuevo componente!

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AppointmentFormComponent], // ¡Añadirlo a los imports!
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  private appointmentsService = inject(AppointmentsService);

  public appointments = signal<Appointment[]>([]);
  public loading = signal<boolean>(false);
  public clientNameFilter = signal<string>('');
  public dateFilter = signal<string>('');
  public showPopup = signal<boolean>(false); // Signal para controlar la visibilidad

  ngOnInit(): void {
    // La grilla se mostrará sin datos al inicio
  }

  onSearch(): void {
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

  openFormPopup(): void {
    this.showPopup.set(true);
  }

  onAppointmentSubmitted(): void {
    this.showPopup.set(false); // Cierra el pop-up
    this.onSearch(); // Refresca la grilla
  }

  onAppointmentCanceled(): void {
    this.showPopup.set(false); // Cierra el pop-up
  }
}