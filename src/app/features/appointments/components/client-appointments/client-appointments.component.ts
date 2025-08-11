import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../services/appointments.service';
import { TreatmentsService } from '../../services/treatments.service';
import { Appointment, CreateAppointmentPayload, Treatment } from '../../types/appoinment.types';

declare const Swal: any;

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
    appointmentDate: '',
    treatmentId: '',
  });

  public appointments = signal<Appointment[]>([]);
  public treatments = signal<Treatment[]>([]);
  public showForm = signal(false);
  public loading = signal(true);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);
  public editingAppointmentId = signal<string | null>(null);
  public canEditAppointments = signal<boolean>(true);
  public sortBy = signal<string>('appointmentDate');
  public sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.fetchAppointments();
    this.fetchTreatments();
  }

  sort(column: string) {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
    this.fetchAppointments();
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
    this.appointmentsService.getMyAppointments(
      this.sortBy(),
      this.sortDirection()
    ).subscribe({
      next: (appointments: Appointment[]) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.errorMessage.set('No tienes permisos para ver tus citas. Iniciá sesión nuevamente.');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage.set('No se pudieron cargar tus citas.');
        }
        this.loading.set(false);
      }
    });
  }


  private showSuccess(message: string) {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  addAppointment() {
    const payload = this.newAppointment();
    if (!payload.appointmentDate || !payload.treatmentId) {
      this.errorMessage.set('Todos los campos son obligatorios.');
      return;
    }

    const now = new Date().toISOString();
    if (payload.appointmentDate < now) {
      this.errorMessage.set('La fecha debe ser futura.');
      return;
    }

    if (this.editingAppointmentId()) {
      this.appointmentsService.updateAppointment(this.editingAppointmentId()!, payload).subscribe({
        next: () => {
          this.showSuccess('Turno actualizado exitosamente');
          this.cancelForm();
          this.fetchAppointments();
        },
        error: (error) => {
          console.error('Error al actualizar el turno', error);
          this.errorMessage.set('Error al actualizar el turno. Intenta de nuevo.');
        }
      });
    } else {
      this.appointmentsService.createAppointment(payload).subscribe({
        next: () => {
          this.showSuccess('Turno creado exitosamente');
          this.cancelForm();
          this.fetchAppointments();
        },
        error: (error) => {
          console.error('Error al crear el turno', error);
          this.errorMessage.set('Error al crear el turno. Intenta de nuevo.');
        }
      });
    }
  }

  updateAppointment(appointment: Appointment) {
    this.editingAppointmentId.set(appointment.id);
    this.newAppointment.set({
      appointmentDate: appointment.appointmentDate,
      treatmentId: appointment.treatmentId
    });
    this.showForm.set(true);
  }

  deleteAppointment(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el turno de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.appointmentsService.deleteAppointment(id).subscribe({
          next: () => {
            this.showSuccess('Turno eliminado exitosamente');
            this.fetchAppointments();
          },
          error: (error) => {
            console.error('Error al eliminar el turno', error);
            this.errorMessage.set('Error al eliminar el turno.');
          }
        });
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
      appointmentDate: '',
      treatmentId: ''
    });
    this.editingAppointmentId.set(null)
    this.errorMessage.set('');
  }

  updateNewAppointment(field: keyof CreateAppointmentPayload, value: string) {
    this.newAppointment.update(app => ({ ...app, [field]: value }));
  }

  getTreatmentTitle(treatmentId: string): string {
    const treatment = this.treatments().find(t => t.id === treatmentId);
    return treatment ? treatment.title : 'Desconocido';
  }
}