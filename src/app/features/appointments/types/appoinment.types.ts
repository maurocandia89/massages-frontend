export type Treatment = {
    id: string; 
    title: string;
    description: string;
    createdAt: string;
    modifiedAt: string | null;
    isEnabled: boolean;
};

export type Appointment = {
    id: string;
    clientId: string;
    clientName: string;
    appointmentDate: string;
    treatmentId: string;
    treatmentTitle: string;
    createdAt: string;
    modifiedAt: string | null;
    isEnabled: boolean;
};

export type CreateAppointmentPayload = {

  appointmentDate: string;
  treatmentId: string;
};

export type UpdateAppointmentPayload = CreateAppointmentPayload;

export type CreateTreatmentPayload = {
    title: string;
    description: string;
    isEnabled: boolean;
};

export type UpdateTreatmentPayload = CreateTreatmentPayload;
