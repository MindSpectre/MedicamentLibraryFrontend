'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Pencil, Share } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "@/components/ui/delete-button"
import { Disease } from '@/types/disease' // Uses the Disease interface from your types directory
import SymptomsList from '@/app/components/forms/diseases/symptoms-list'
import PropertyList from '@/app/components/property-list'
import {EditButton} from "@/components/ui/edit-button";

export default function DiseaseViewPage() {
    const { id } = useParams()
    const router = useRouter()

    const [disease, setDisease] = useState<Disease | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            fetchDisease(id)
        } else {
            setLoading(false)
        }
    }, [id])

    const fetchDisease = useCallback(async (diseaseId: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const fullUrl = `${apiUrl}/wiki/diseases/${diseaseId}`
        try {
            const response = await fetch(fullUrl)
            if (!response.ok) {
                throw new Error('Failed to fetch disease data')
            }
            const data = await response.json()
            setDisease(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleEditPage = () => {
        router.push(`/disease/edit/${id}`)
    }

    const handleSharePage = () => {
        // Implement sharing logic here if needed
    }

    const handleRemovePage = () => {
        // Implement remove logic here if needed
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !disease) {
        return (
            <motion.div
                className="flex justify-center items-center h-screen"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
            >
                <div className="bg-red-100 p-4 rounded-lg text-red-700">
                    {error || 'Disease not found'}
                </div>
            </motion.div>
        )
    }

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
                        <CardTitle className="container flex max-w-full justify-between">
                            <div className="text-center pt-1">{disease.name}</div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-semibold">Type:</span> {disease.type}
                        </div>
                        <div>
                            <span className="font-semibold">Infectious:</span>{' '}
                            <Badge variant={disease.is_infectious ? 'destructive' : 'secondary'}>
                                {disease.is_infectious ? 'Yes' : 'No'}
                            </Badge>
                        </div>
                    </CardContent>
                </div>
                <div className="flex items-end gap-2 flex-col w-1/4 p-2">
                    <Button variant="outline" size="icon" className="border hover:bg-amber-100" onClick={handleSharePage}>
                        <Share />
                    </Button>
                    <EditButton onConfirm={handleEditPage}/>
                    <DeleteButton onConfirm={handleRemovePage}/>
                </div>
            </Card>

            <SymptomsList symptoms={disease.properties.symptoms || []} />
            <PropertyList title="Risk Factors" items={disease.properties.risk_factors || []} />
            <PropertyList title="Complications" items={disease.properties.complications || []} />
            <PropertyList title="Curative Drugs" items={disease.properties.curative_drugs?.map(String) || []} />
            <PropertyList title="Affected Age Groups" items={disease.properties.affected_age_groups || []} />
        </motion.div>
    )
}
