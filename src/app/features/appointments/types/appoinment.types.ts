// Define la estructura de datos para un tratamiento
export type Treatment = {
    id: string; // La API de backend usa GUIDs, que se mapean a strings en TypeScript
    title: string;
    description: string;
    createdAt: string;
    modifiedAt: string | null;
    isEnabled: boolean;
};

// Define la estructura de datos para una cita, basada en la entidad de la API
export type Appointment = {
    id: string; // Corregido el tipo a string para que coincida con GUID
    clientId: string;
    clientName: string;
    appointmentDate: string; // Corregido a AppointmentDate
    treatmentId: string; // Nuevo campo para la llave foránea
    treatmentTitle: string; // Campo para mostrar en el frontend, se debería obtener del backend o del servicio
    createdAt: string;
    modifiedAt: string | null;
    isEnabled: boolean;
};

// La carga útil para crear una cita
export type CreateAppointmentPayload = {
    clientId: string;
    clientName: string;
    appointmentDate: string;
    treatmentId: string;
};

// La carga útil para actualizar una cita es la misma que la de creación
export type UpdateAppointmentPayload = CreateAppointmentPayload;

// Carga útil para crear un tratamiento
export type CreateTreatmentPayload = {
    title: string;
    description: string;
    isEnabled: boolean;
};

// Carga útil para actualizar un tratamiento
export type UpdateTreatmentPayload = CreateTreatmentPayload;
