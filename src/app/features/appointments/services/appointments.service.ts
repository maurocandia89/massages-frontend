import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentPayload, UpdateAppointmentPayload } from '../types/appoinment.types';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Appointments`;

    getAppointments(date: string, clientName: string, sortBy: string | null, sortDirection: 'asc' | 'desc'): Observable<Appointment[]> {
        let params = new HttpParams();
        if (date) params = params.append('date', date);
        if (clientName) params = params.append('clientName', clientName);
        if (sortBy) params = params.append('sortBy', sortBy);
        if (sortDirection) params = params.append('sortDirection', sortDirection);

        return this.http.get<Appointment[]>(this.apiUrl, { params: params });
    }

    getMyAppointments(sortBy: string, sortDirection: 'asc' | 'desc'): Observable<Appointment[]> {
        let params = new HttpParams()
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection);

        return this.http.get<Appointment[]>(`${this.apiUrl}/my-appointments`, { params });
    }

    getAppointmentById(id: string): Observable<Appointment> {
        return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
    }

    createAppointment(payload: CreateAppointmentPayload): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, payload);
    }

    updateAppointment(id: string, payload: UpdateAppointmentPayload): Observable<Appointment> { // Corregido el tipo de id
        return this.http.put<Appointment>(`${this.apiUrl}/${id}`, payload);
    }

    deleteAppointment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    approveAppointment(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/admin/approve/${id}`, {});
    }

  cancelAppointment(id: string, motivo: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/admin/cancel/${id}`, { motivo }, {
    headers: { 'Content-Type': 'application/json' }
  });
}
}
