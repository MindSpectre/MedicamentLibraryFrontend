export interface Ingredient {
    name: string;
    risk_level: number;
}

export interface SingleDescription {
    description: string;
}

export interface MedicamentProperties {
    active_ingredients: Ingredient[];
    dosage_form: SingleDescription;
    inactive_ingredients: Ingredient[];
    prescription: SingleDescription;
    side_effects: string[];
    strength: SingleDescription;
}

export interface Medicament {
    id: string;
    approval_number: string;
    approval_status: string;
    atc_code: string;
    name: string;
    prescription: boolean; // "False" or "True"
    properties: MedicamentProperties;
    type: string;
}
export interface MedicamentFormProps {
    initialData?: Medicament;
    onSave: (data: Medicament) => void | Promise<void>;
}