import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass, AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TreatmentsService } from '../../services/treatments.service';
import { Treatment, CreateTreatmentPayload } from '../../types/appoinment.types';
import { AuthService } from '../../../auth/services/auth.service';

declare const Swal: any;

@Component({
  selector: 'app-admin-treatments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './admin-treatments.component.html',
})
export class AdminTreatmentsComponent implements OnInit {
  private treatmentsService = inject(TreatmentsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  showForm = signal(false);
  newTreatment = signal<CreateTreatmentPayload | Treatment>({
    title: '',
    description: '',
    isEnabled: true
  });
  editingTreatmentId = signal<string | null>(null);
  treatments = signal<Treatment[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  userRole = signal<string | null>(null);

  ngOnInit(): void {
    this.userRole.set(this.authService.getUserRole());
    if (this.userRole() === 'Admin') {
      this.fetchTreatments();
    } else {
      this.errorMessage.set('No tienes permisos para ver esta página.');
      this.loading.set(false);
    }
  }

  fetchTreatments(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.treatmentsService.getTreatments().subscribe({
      next: (data) => {
        this.treatments.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener los tratamientos:', err);
        this.errorMessage.set('Hubo un error al cargar los tratamientos.');
        this.loading.set(false);
      }
    });
  }

  // saveTreatment(): void {
  //   const currentTreatment = this.newTreatment();
  //   if (!currentTreatment.title || !currentTreatment.description) {
  //     this.errorMessage.set('El título y la descripción son obligatorios.');
  //     return;
  //   }

  //   if (this.editingTreatmentId()) {
  //     this.treatmentsService.updateTreatment(this.editingTreatmentId()!, currentTreatment).subscribe({
  //       next: () => {
  //         Swal.fire({
  //           title: '¡Actualizado!',
  //           text: 'El tratamiento ha sido actualizado con éxito.',
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         });
  //         this.resetFormAndState();
  //         this.fetchTreatments();
  //       },
  //       error: (err) => {
  //         console.error('Error al actualizar el tratamiento:', err);
  //         Swal.fire({
  //           title: 'Error',
  //           text: 'Hubo un problema al actualizar el tratamiento. Por favor, inténtalo de nuevo.',
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         });
  //       }
  //     });
  //   } else {
  //     this.treatmentsService.createTreatment(currentTreatment as CreateTreatmentPayload).subscribe({
  //       next: () => {
  //         Swal.fire({
  //           title: '¡Guardado!',
  //           text: 'El tratamiento ha sido creado con éxito.',
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         });
  //         this.resetFormAndState();
  //         this.fetchTreatments();
  //       },
  //       error: (err) => {
  //         console.error('Error al crear el tratamiento:', err);
  //         Swal.fire({
  //           title: 'Error',
  //           text: 'Hubo un problema al crear el tratamiento. Por favor, inténtalo de nuevo.',
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         });
  //       }
  //     });
  //   }
  // }

  saveTreatment(): void {
    const currentTreatment = this.newTreatment();
    if (!currentTreatment.title || !currentTreatment.description) {
      this.errorMessage.set('El título y la descripción son obligatorios.');
      return;
    }

    if (this.editingTreatmentId()) {
      // Modo edición...
      // (ya lo tenés bien)
    } else {
      // Modo creación
      this.treatmentsService.createTreatment(currentTreatment as CreateTreatmentPayload).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Guardado!',
            text: 'El tratamiento ha sido creado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.resetFormAndState();
            this.fetchTreatments();
            this.router.navigate(['/admin/treatments']); // ← redirección aquí
          });
        },
        error: (err) => {
          console.error('Error al crear el tratamiento:', err);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al crear el tratamiento. Por favor, inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  editTreatment(treatment: Treatment): void {
    this.editingTreatmentId.set(treatment.id);
    this.newTreatment.set({ ...treatment });
    this.showForm.set(true);
    this.errorMessage.set(null);
  }

  deleteTreatment(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡bórralo!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El tratamiento ha sido eliminado.', 'success');
            this.fetchTreatments();
          },
          error: (err) => {
            console.error('Error al eliminar el tratamiento:', err);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el tratamiento.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  updateNewTreatment(field: keyof (CreateTreatmentPayload | Treatment), value: string | boolean): void {
    this.newTreatment.update(treatment => ({ ...treatment, [field]: value }));
  }

  resetFormAndState(): void {
    this.newTreatment.set({ title: '', description: '', isEnabled: true });
    this.editingTreatmentId.set(null);
    this.errorMessage.set(null);
  }


  toggleForm(): void {
    const isOpening = !this.showForm();
    this.showForm.set(isOpening);

    if (isOpening) {
      this.resetFormAndState();
    }
  }


  trackTreatmentId = (index: number, treatment: Treatment): string => treatment.id;
}
