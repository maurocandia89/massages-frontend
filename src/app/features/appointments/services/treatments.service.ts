// src/app/features/appointments/services/treatments.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treatment, CreateTreatmentPayload } from '../types/appoinment.types';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Treatments`;

  /**
   * Obtiene todos los tratamientos disponibles desde el backend.
   * @returns Un Observable que emite un array de objetos Treatment.
   */
  getTreatments(): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(this.apiUrl);
  }

  /**
   * Obtiene un tratamiento específico por su ID.
   * @param id El ID único del tratamiento.
   * @returns Un Observable que emite un objeto Treatment.
   */
  getTreatmentById(id: string): Observable<Treatment> {
    return this.http.get<Treatment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo tratamiento en el backend.
   * @param payload Los datos del nuevo tratamiento (título, descripción, etc.).
   * @returns Un Observable que emite el tratamiento creado.
   */
  createTreatment(payload: CreateTreatmentPayload): Observable<Treatment> {
    return this.http.post<Treatment>(this.apiUrl, payload);
  }

  /**
   * Actualiza un tratamiento existente en el backend.
   * @param id El ID del tratamiento a actualizar.
   * @param payload Los nuevos datos del tratamiento.
   * @returns Un Observable que emite una respuesta vacía al completar.
   */
  updateTreatment(id: string, payload: Partial<Treatment>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Elimina un tratamiento del backend.
   * @param id El ID del tratamiento a eliminar.
   * @returns Un Observable que emite una respuesta vacía al completar.
   */
  deleteTreatment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
