import { Component, OnInit, signal } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment, CreateAppointmentPayload, UpdateAppointmentPayload } from '../../types/appoinment.types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-appointments.component.html',
})
export class ClientAppointmentsComponent implements OnInit {

  public newAppointment = signal<CreateAppointmentPayload>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    clientId: '',
    clientName: '',

  });

  public appointments = signal<Appointment[]>([]);
  public showForm = signal(false);

  constructor(private appointmentsService: AppointmentsService, private router: Router) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.appointmentsService.getAppointments('', '', '', 'asc').subscribe({
      next: (appointments: Appointment[]) => {
        this.appointments.set(appointments);
      },
      error: (error) => {
        console.error('Error al obtener las citas', error);
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
      }
    });
  }

  updateAppointment(appointment: Appointment) {
    const payload: UpdateAppointmentPayload = {
      title: 'Título Actualizado',
      description: 'Descripción Actualizada',
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      clientId: appointment.clientId,
      clientName : appointment.clientId,
    };

    this.appointmentsService.updateAppointment(appointment.id, payload).subscribe({
      next: (response) => {
        console.log('Cita actualizada exitosamente', response);
        this.fetchAppointments();
      },
      error: (error) => {
        console.error('Error al actualizar la cita', error);
      }
    });
  }

  deleteAppointment(id: number) { // Corregido: id es tipo number
    this.appointmentsService.deleteAppointment(id).subscribe({
      next: (response) => {
        console.log('Cita eliminada exitosamente', response);
        this.fetchAppointments();
      },
      error: (error) => {
        console.error('Error al eliminar la cita', error);
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
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        clientId: '',
        clientName:'',
    });
  }
  
  // *** NUEVOS MÉTODOS PARA ACTUALIZAR CAMPOS INDIVIDUALMENTE ***
  updateNewAppointmentTitle(value: string) {
    this.newAppointment.update(app => ({ ...app, title: value }));
  }

  updateNewAppointmentDescription(value: string) {
    this.newAppointment.update(app => ({ ...app, description: value }));
  }

  updateNewAppointmentStartTime(value: string) {
    this.newAppointment.update(app => ({ ...app, startTime: value }));
  }

  updateNewAppointmentEndTime(value: string) {
    this.newAppointment.update(app => ({ ...app, endTime: value }));
  }
}
