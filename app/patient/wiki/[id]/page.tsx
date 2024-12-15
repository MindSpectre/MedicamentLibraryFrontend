'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {Loader2, Share} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PropertyList from '@/app/components/property-list'
import { Patient } from '@/types/patient'
import {Button} from "@/components/ui/button";
import {EditButton} from "@/components/ui/edit-button";
import {DeleteButton} from "@/components/ui/delete-button";
import {ModernButton} from "@/components/ui/modern-button";
import {useRouter} from "next/navigation";
import {handleRemovePage, handleSharePage} from "@/app/components/description-card";

function formatDate(day: number, month: number, year: number): string {
    // Simple date formatting for the given birth date
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}

export default function PatientViewPage() {
    const { id } = useParams()
    const router = useRouter()
    const [patient, setPatient] = useState<Patient | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            fetchPatient(id)
        } else {
            setLoading(false)
        }
    }, [id])
    const handleEditPage = () => {
        router.push(`/patient/edit/${id}`)
    }

    const fetchPatient = useCallback(async (patientId: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const fullUrl = `${apiUrl}/wiki/patient/${patientId}`
        try {
            const response = await fetch(fullUrl)
            if (!response.ok) {
                throw new Error('Failed to fetch patient data')
            }
            const data = await response.json()
            setPatient(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !patient) {
        return (
            <motion.div
                className="flex justify-center items-center h-screen"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
            >
                <div className="bg-red-100 p-4 rounded-lg text-red-700">
                    {error || 'Patient not found'}
                </div>
            </motion.div>
        )
    }

    const birthDateStr = formatDate(patient.birth_date.day, patient.birth_date.month, patient.birth_date.year)

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <Card className="flex-row flex">
                <div className="flex-col w-3/4 flex">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">{patient.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xl">
                        <div>
                            <span className="font-semibold">ID:</span> {patient.id}
                        </div>
                        <div>
                            <span className="font-semibold">Gender:</span> {patient.gender}
                        </div>
                        <div>
                            <span className="font-semibold">Birth Date:</span> {birthDateStr}
                        </div>
                        <div>
                            <span
                                className="font-semibold">Blood Type:</span> {patient.properties.blood_type?.blood_type}
                        </div>
                        <div>
                            <span className="font-semibold">Insurance:</span> {patient.properties.insurance?.insurance}
                        </div>
                    </CardContent>
                </div>
                <div className="flex items-end gap-2 flex-col w-1/4 p-2">
                    <Button variant="outline" size="icon" className="border hover:bg-amber-100"
                            onClick={handleSharePage}>
                        <Share/>
                    </Button>
                    <EditButton onConfirm={handleEditPage}/>
                    <DeleteButton onConfirm={() => handleRemovePage("patient", patient.id)} />
                    <ModernButton className="text-xs mt-10 min-w-min" onConfirm={handleSharePage} text={"Treat manager"}/>
                </div>
            </Card>

            <PropertyList title="Allergies" items={patient.properties.allergies || []}/>
            <PropertyList title="Vaccines" items={patient.properties.vaccines || []}/>

            {/* Current Diseases & Current Medicaments as lists */}
            <PropertyList title="Current Diseases" items={patient.properties.current_diseases?.map(String) || []}/>
            <PropertyList title="Current Medicaments" items={patient.properties.current_medicaments?.map(String) || []} />

            {/* Medical History */}
            {patient.properties.medical_history && patient.properties.medical_history.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Medical History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.properties.medical_history.map((entry, index) => (
                            <div key={index} className="border-b last:border-b-0 py-2 text-xl">
                                <div><span className="font-semibold">Disease ID:</span> {entry.disease_id}</div>
                                <div><span className="font-semibold">Start Date:</span> {entry.start_date}</div>
                                <div><span className="font-semibold">End Date:</span> {entry.end_date}</div>
                            </div>
                        ))}
                    </CardContent>


                </Card>
            )}
        </motion.div>
    )
}
