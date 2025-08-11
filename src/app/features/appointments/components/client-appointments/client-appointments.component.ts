import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../services/appointments.service';
import { TreatmentsService } from '../../services/treatments.service';
import { Appointment, CreateAppointmentPayload, Treatment } from '../../types/appoinment.types';

@Component({
  selector: 'app-client-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './client-appointments.component.html',
})
export class ClientAppointmentsComponent implements OnInit {

  private appointmentsService = inject(AppointmentsService);
  private treatmentsService = inject(TreatmentsService);
  private router = inject(Router);

  public newAppointment = signal<CreateAppointmentPayload>({
    clientId: '',
    clientName: 'Invitado',
    appointmentDate: '',
    treatmentId: '',
  });

  public appointments = signal<Appointment[]>([]);
  public treatments = signal<Treatment[]>([]);
  public showForm = signal(false);
  public loading = signal(true);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchAppointments();
    this.fetchTreatments();
  }

  fetchTreatments() {
    this.treatmentsService.getTreatments().subscribe({
      next: (treatments: Treatment[]) => {
        this.treatments.set(treatments);
      },
      error: (error) => {
        console.error('Error al obtener los tratamientos:', error);
        this.errorMessage.set('Error al cargar los tratamientos.');
      }
    });
  }

  fetchAppointments() {
    this.loading.set(true);
    this.appointmentsService.getAppointments('', '', '', 'asc').subscribe({
      next: (appointments: Appointment[]) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener las citas:', error);
        this.errorMessage.set('Error al cargar las citas.');
        this.loading.set(false);
      }
    });
  }

  addAppointment() {
    const payload: CreateAppointmentPayload = this.newAppointment();
    this.appointmentsService.createAppointment(payload).subscribe({
      next: (response) => {
        console.log('Cita creada exitosamente', response);
        this.cancelForm();
        this.fetchAppointments();
      },
      error: (error) => {
        console.error('Error al crear la cita', error);
        this.errorMessage.set('Error al crear la cita. Intenta de nuevo.');
      }
    });
  }

  // Se modifican los métodos de actualización y eliminación para que el id sea de tipo string
  updateAppointment(appointment: Appointment) {
    // Implementar la lógica de actualización aquí
    console.log('Actualizar cita:', appointment.id);
  }

  deleteAppointment(id: string) {
    this.appointmentsService.deleteAppointment(id).subscribe({
      next: (response) => {
        console.log('Cita eliminada exitosamente', response);
        this.fetchAppointments();
      },
      error: (error) => {
        console.error('Error al eliminar la cita', error);
        this.errorMessage.set('Error al eliminar la cita.');
      }
    });
  }

  onLogout() {
    console.log('Sesión cerrada');
    this.router.navigate(['/login']);
  }

  openForm() {
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.newAppointment.set({
        clientId: '',
        clientName: '',
        appointmentDate: '',
        treatmentId: ''
    });
  }

  // Nuevo método para actualizar los campos
  updateNewAppointment(field: keyof CreateAppointmentPayload, value: string) {
    this.newAppointment.update(app => ({ ...app, [field]: value }));
  }

   getTreatmentTitle(treatmentId: string): string {
    const treatment = this.treatments().find(t => t.id === treatmentId);
    return treatment ? treatment.title : 'Desconocido';
  }
}