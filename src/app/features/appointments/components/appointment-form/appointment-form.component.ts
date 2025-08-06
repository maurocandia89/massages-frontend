import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { CreateAppointmentPayload } from '../../types/appoinment.types';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent {
  private appointmentsService = inject(AppointmentsService);

  // El signal para los datos del formulario
  public appointment = signal<CreateAppointmentPayload>({
    clientName: '',
    appointmentDate: '',
    startTime: '',
    description: null,
    id: 0
  });

  // Eventos para comunicarnos con el componente padre
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCanceled = new EventEmitter<void>();

  onSubmit(): void {
    this.appointmentsService.createAppointment(this.appointment())
      .subscribe({
        next: () => {
          this.formSubmitted.emit(); // Emite un evento de éxito
        },
        error: (err) => {
          console.error('Error al crear el turno:', err);
        }
      });
  }

  onCancel(): void {
    this.formCanceled.emit(); // Emite un evento de cancelación
  }
}