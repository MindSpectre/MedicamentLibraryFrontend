export interface BirthDate {
    day: number;
    month: number;
    year: number;
}

export interface MedicalHistoryEntry {
    disease_id: string;
    start_date: string;
    end_date: string;
}

export interface PatientProperties {
    allergies: string[];
    blood_type: {
        blood_type: string;
    };
    current_diseases: string[];
    current_medicaments: string[];
    insurance: {
        insurance: string;
    };
    medical_history: MedicalHistoryEntry[];
    vaccines: string[];
}

export interface Patient {
    birth_date: BirthDate;
    gender: string;
    id: string;
    name: string;
    properties: PatientProperties;
}
