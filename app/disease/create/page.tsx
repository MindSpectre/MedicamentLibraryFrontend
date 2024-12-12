'use client'

import { DiseaseForm, transformDiseaseData} from '@/app/components/forms/diseases/disease-form'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {useState} from "react";
export default function AddDiseasePage() {
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const handleSave = async (updatedDisease) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const url = '/api/wiki/diseases/'
            const fullUrl = `${apiUrl}${url}`;
            const method = 'POST'
            const transformedData = transformDiseaseData(updatedDisease)

            const response = await fetch(fullUrl, {
                method,
                // mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedData),
            })
            if (!response.ok) {
                throw new Error('Failed to save disease data')
            }
            setSuccessMessage( 'New disease created successfully!')
            // If it's a new disease, update the URL with the new ID
            const newDisease = await response.json()
            window.history.pushState({}, '', `/disease-management/${newDisease.id}`)

        } catch (err) {
            setError(err.message)
        }
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{'Create New Disease'}</h1>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {successMessage && (
                <Alert className="mb-4">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}
            <DiseaseForm initialData={null} onSave={handleSave}/>
        </div>
    )
}
