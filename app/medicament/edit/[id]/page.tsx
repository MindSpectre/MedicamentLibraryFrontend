'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"
import { Medicament } from '@/types/medicament'
import {MedicamentForm} from "@/app/components/forms/medicaments/medicament-form"; // Uses the Medicament interface from your types directory
export default function MedicamentManagementPage() {
    const { id } = useParams();
    const [medicament, setMedicament] = useState<Medicament>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchMedicament(id).catch(console.error); // Ensure the promise is handled
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchMedicament = async (medicamentId: string | string[]) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const fullUrl = `${apiUrl}/wiki/medicament/${medicamentId}`;
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch medicament data');
            }
            const data: Medicament = await response.json();
            setMedicament(data);
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

    const handleSave = async (updatedMedicament: Medicament) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const url = `/wiki/medicament/${id}`;
            const fullUrl = `${apiUrl}${url}`;
            const response = await fetch(fullUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMedicament),
            });
            if (!response.ok) {
                throw new Error('Failed to save medicament data');
            }
            toast.info("Medicament is saved successfully.", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo clicked"),
                },
            });

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error("Cant save a medicament", {
                    description: `${err.message}`,
                    action: {
                        label: "Retry",
                        onClick: () => console.log("Retry clicked"),
                    },
                });
            } else {
                setError('');
                toast.error("Cant save a medicament", {
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
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Medicament' : 'Create New Medicament'}</h1>
            <MedicamentForm initialData={medicament} onSave={handleSave} />
        </div>
    );
}
