import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentPayload, UpdateAppointmentPayload } from '../types/appoinment.types';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7223/api/Appointments';

  getAppointments(date: string, clientName: string): Observable<Appointment[]> {
    const params = {
      date: date,
      clientName: clientName,
    };
    return this.http.get<Appointment[]>(this.apiUrl, { params: params });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(payload: CreateAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, payload);
  }

  updateAppointment(id: number, payload: UpdateAppointmentPayload): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}