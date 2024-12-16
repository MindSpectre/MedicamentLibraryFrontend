'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"
import { Organization } from '@/types/organization'
import {OrganizationForm} from "@/app/components/forms/organizations/organization-form"; // Uses the Organization interface from your types directory
export default function OrganizationManagementPage() {
    const { id } = useParams();
    const [organization, setOrganization] = useState<Organization>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchOrganization(id).catch(console.error); // Ensure the promise is handled
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchOrganization = async (organizationId: string | string[]) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const fullUrl = `${apiUrl}/wiki/organization/${organizationId}`;
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch organizations data');
            }
            const data: Organization = await response.json();
            setOrganization(data);
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

    const handleSave = async (updatedOrganization: Organization) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const url = `/wiki/organization/${id}`;
            const fullUrl = `${apiUrl}${url}`;
            const response = await fetch(fullUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrganization),
            });
            if (!response.ok) {
                throw new Error('Failed to save organizations data');
            }
            toast.info("Organization is saved successfully.", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo clicked"),
                },
            });

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error("Cant save a organizations", {
                    description: `${err.message}`,
                    action: {
                        label: "Retry",
                        onClick: () => console.log("Retry clicked"),
                    },
                });
            } else {
                setError('');
                toast.error("Cant save a organizations", {
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
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Organization' : 'Create New Organization'}</h1>
            <OrganizationForm initialData={organization} onSave={handleSave} />
        </div>
    );
}
