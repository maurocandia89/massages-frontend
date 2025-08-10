// Define la estructura de datos para una cita, basada en la entidad de la API
export type Appointment = {
    id: number;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    clientId: string;
    clientName: string;
    createdAt: string;
    modifiedAt: string | null;
    isEnabled: boolean;
};

// La carga útil para crear una cita omite estas propiedades, ya que se generan en el backend
export type CreateAppointmentPayload = Omit<Appointment, 'id' | 'createdAt' | 'modifiedAt' | 'isEnabled'>;

// La carga útil para actualizar una cita es la misma que la de creación
export type UpdateAppointmentPayload = CreateAppointmentPayload;
