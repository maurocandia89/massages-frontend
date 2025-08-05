export type Appointment = {
    id: number;
    clientName: string;
    appointmentDate: string;
    startTime: string;
    description: string | null;
}

export type CreateAppointmentPayload = Omit<Appointment, 'id'>;
export type UpdateAppointmentPayload = Omit<Appointment, 'id'>;
export type AppointmentFilters = {
    clientName: string;
    appointmentDate: string;
};