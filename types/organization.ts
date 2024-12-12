// @/types/organizations.ts

export interface License {
    license_key: string;
    license_name: string;
}

export interface OrganizationProperties {
    license: License;
}

export interface Organization {
    contact_details: string;
    country: string;
    id: string;
    name: string;
    properties: OrganizationProperties;
    type: string;
}

export interface OrganizationFormProps {
    initialData?: Organization;
    onSave: (data: Organization) => void | Promise<void>;
}
