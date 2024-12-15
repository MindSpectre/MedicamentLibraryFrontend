export interface Symptom {
    name: string;
    description: string;
    duration: string;
    severity: string;
    type: string;
}

export interface DiseaseProperties {
    affected_age_groups: string[];
    complications: string[];
    curative_drugs: (string | number)[];
    risk_factors: string[];
    symptoms: Symptom[];
}

export interface Disease {
    id: string;
    name: string;
    is_infectious: boolean;
    type: string;
    properties: DiseaseProperties;
}

export type DiseaseFormProps = {
    initialData?: Disease;
    onSave: (data: Disease) => void;
};
