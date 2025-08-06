export type Appointment = {
    id: number;
    clientName: string;
    appointmentDate: string;
    startTime: string;
    description: string | null;
};

export type CreateAppointmentPayload = Omit<Appointment, 'Id'>;
export type UpdateAppointmentPayload = Omit<Appointment, 'Id'>;
export type AppointmentFilters = {
    clientName: string;
    appointmentDate: string;
};