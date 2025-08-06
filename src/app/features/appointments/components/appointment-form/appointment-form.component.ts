import { Component, EventEmitter, Input, Output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment, CreateAppointmentPayload, UpdateAppointmentPayload } from '../../types/appoinment.types';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit {
appointment() {
throw new Error('Method not implemented.');
}
  private appointmentsService = inject(AppointmentsService);

  @Input() selectedAppointment: Appointment | null = null;
  
  // El signal para los datos del formulario, ahora inicializado en OnInit
  public formState = signal<UpdateAppointmentPayload | CreateAppointmentPayload>({
    clientName: '',
    appointmentDate: '',
    startTime: '',
    description: null,
    id : 0
  });

  public isEditMode = signal<boolean>(false);

  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCanceled = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.selectedAppointment) {
      this.isEditMode.set(true);
      // Asignamos el valor del formulario con el Id incluido para el PUT
      this.formState.set({
        id: this.selectedAppointment.id,
        clientName: this.selectedAppointment.clientName,
        appointmentDate: this.selectedAppointment.appointmentDate,
        startTime: this.selectedAppointment.startTime,
        description: this.selectedAppointment.description,
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode()) {
      const appointmentId = (this.formState() as UpdateAppointmentPayload).id;
      this.appointmentsService.updateAppointment(appointmentId, this.formState() as UpdateAppointmentPayload)
        .subscribe({
          next: () => this.formSubmitted.emit(),
          error: (err) => console.error('Error al actualizar el turno:', err)
        });
    } else {
      this.appointmentsService.createAppointment(this.formState() as CreateAppointmentPayload)
        .subscribe({
          next: () => this.formSubmitted.emit(),
          error: (err) => console.error('Error al crear el turno:', err)
        });
    }
  }

  onCancel(): void {
    this.formCanceled.emit();
  }
}