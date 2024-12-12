'use client'

import React, { useState, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from 'lucide-react'
import { Disease, DiseaseFormProps, DiseaseProperties, Symptom } from '@/types/disease'
import SaveButton from "@/components/ui/save-button";

const DISEASE_TYPES = ['viral', 'bacterial', 'fungal', 'parasitic', 'genetic'] as const;
const PROPERTIES_FIELDS: (keyof DiseaseProperties)[] = [
    'affected_age_groups',
    'complications',
    'curative_drugs',
    'risk_factors'
];

export const transformDiseaseData = (data: Disease): Disease => ({
    ...data,
    properties: {
        ...data.properties,
        curative_drugs: data.properties.curative_drugs.map((drug) => {
            const parsed = parseInt(drug.toString(), 10);
            return isNaN(parsed) ? drug : parsed;
        }),
    },
});

function formatPropertyLabel(property: keyof DiseaseProperties): string {
    return property
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DiseaseForm({ initialData, onSave }: DiseaseFormProps) {
    const [formData, setFormData] = useState<Disease>(initialData || {
        name: '',
        is_infectious: false,
        type: '',
        properties: {
            affected_age_groups: [],
            complications: [],
            curative_drugs: [],
            risk_factors: [],
            symptoms: []
        }
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handlePropertyChange = useCallback((property: keyof DiseaseProperties, value: (string | number)[]) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                [property]: value
            }
        }));
    }, []);

    const handleAddPropertyItem = useCallback((property: keyof DiseaseProperties, newValue: string) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                [property]: [...prev.properties[property], newValue]
            }
        }));
    }, []);

    const handleRemovePropertyItem = useCallback((property: keyof DiseaseProperties, index: number) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                [property]: prev.properties[property].filter((_, i) => i !== index)
            }
        }));
    }, []);

    const handleSymptomChange = useCallback((index: number, field: keyof Symptom, value: string) => {
        setFormData((prev) => {
            const newSymptoms = [...prev.properties.symptoms];
            newSymptoms[index] = { ...newSymptoms[index], [field]: value };
            return {
                ...prev,
                properties: {
                    ...prev.properties,
                    symptoms: newSymptoms
                }
            };
        });
    }, []);

    const addSymptom = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                symptoms: [
                    ...prev.properties.symptoms,
                    { name: '', description: '', duration: '', severity: '', type: '' }
                ]
            }
        }));
    }, []);

    const removeSymptom = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                symptoms: prev.properties.symptoms.filter((_, i) => i !== index)
            }
        }));
    }, []);

    const handleSave = async () => {
        // Simulate async save operation
        return onSave(transformDiseaseData(formData));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); // Optional: Prevent default form action
        }} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {initialData?.id && (
                        <div>
                            <Label htmlFor="id">ID</Label>
                            <Input id="id" name="id" value={formData.id} disabled />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_infectious"
                            name="is_infectious"
                            checked={formData.is_infectious}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({ ...prev, is_infectious: checked }))
                            }
                        />
                        <Label htmlFor="is_infectious">Is Infectious</Label>
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            name="type"
                            value={formData.type}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select disease type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-200 cursor-pointer">
                                {DISEASE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type} className="cursor-pointer">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Properties */}
            <Card>
                <CardHeader>
                    <CardTitle>Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {PROPERTIES_FIELDS.map((property) => (
                        <div key={property}>
                            <Label htmlFor={property}>{formatPropertyLabel(property)}</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.properties[property].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1"
                                    >
                                        <span>{item}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 p-0"
                                            onClick={() => handleRemovePropertyItem(property, index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Input
                                    type="text"
                                    placeholder={`Add ${property.replace(/_/g, ' ')}`}
                                    className="w-40"
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const target = e.target as HTMLInputElement;
                                            const newValue = target.value.trim();
                                            if (newValue) {
                                                handleAddPropertyItem(property, newValue);
                                                target.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
                <CardHeader>
                    <CardTitle>Symptoms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.properties.symptoms.map((symptom, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Symptom {index + 1}</CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSymptom(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {(['name', 'description', 'duration', 'severity', 'type'] as (keyof Symptom)[]).map((field) => (
                                    <div key={field}>
                                        <Label htmlFor={`symptom-${index}-${field}`}>
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </Label>
                                        <Input
                                            id={`symptom-${index}-${field}`}
                                            value={symptom[field]}
                                            onChange={(e) => handleSymptomChange(index, field, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="button" onClick={addSymptom} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Symptom
                    </Button>
                </CardContent>
            </Card>
            <SaveButton onSave={handleSave}>Save Changes</SaveButton>
        </form>
    );
}
