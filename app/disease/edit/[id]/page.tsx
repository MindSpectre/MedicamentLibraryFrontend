'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DiseaseForm } from '@/app/components/forms/diseases/disease-form';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"
import { Disease } from '@/types/disease' // Uses the Disease interface from your types directory
export default function DiseaseManagementPage() {
    const { id } = useParams();
    const [disease, setDisease] = useState<Disease | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchDisease(id).catch(console.error); // Ensure the promise is handled
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchDisease = async (diseaseId: string | string[]) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const fullUrl = `${apiUrl}/wiki/disease/${diseaseId}`;
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch disease data');
            }
            const data: Disease = await response.json();
            setDisease(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedDisease: Disease) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const url = `/wiki/disease/${id}`;
            const fullUrl = `${apiUrl}${url}`;
            const response = await fetch(fullUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDisease),
            });
            if (!response.ok) {
                throw new Error('Failed to save disease data');
            }
            toast.info("Disease is saved successfully.", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo clicked"),
                },
            });

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error("Cant save a disease", {
                    description: `${err.message}`,
                    action: {
                        label: "Retry",
                        onClick: () => console.log("Retry clicked"),
                    },
                });
            } else {
                setError('');
                toast.error("Cant save a disease", {
                    description: `An unknown error occurred`,
                    action: {
                        label: "Retry",
                        onClick: () => console.log("Retry clicked"),
                    },
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Disease' : 'Create New Disease'}</h1>
            <DiseaseForm initialData={disease} onSave={handleSave} />
        </div>
    );
}
