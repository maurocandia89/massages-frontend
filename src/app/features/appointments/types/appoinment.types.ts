export type Appointment = {
    id: number;
    clientName: string;
    appointmentDate: string;
    startTime: string;
    description: string | null;
    createdAt: string;
    modifiedAt: string | null;
    isEnabled: boolean;
};


export type CreateAppointmentPayload = Omit<Appointment, 'id' | 'createdAt' | 'modifiedAt' | 'isEnabled'>;
export type UpdateAppointmentPayload = Omit<Appointment, 'createdAt' | 'modifiedAt' | 'isEnabled'>;

export type AppointmentFilters = {
    clientName: string;
    appointmentDate: string;
};