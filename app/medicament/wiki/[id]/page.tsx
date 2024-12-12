'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {Loader2, Share} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Medicament } from '@/types/medicament'
import IngredientsList from '@/app/components/forms/medicaments/ingredients-list'   // Ensure correct import paths
import PropertyList from '@/app/components/property-list'
import DescriptionCard from '@/app/components/description-card'
import {Button} from "@/components/ui/button";
import {EditButton} from "@/components/ui/edit-button";
import {DeleteButton} from "@/components/ui/delete-button";

export default function MedicamentViewPage() {
    const { id } = useParams()

    const [medicament, setMedicament] = useState<Medicament | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            fetchMedicament(id).then(id => id)
        } else {
            setLoading(false)
        }
    }, [id])
    const handleEditPage = () => {

    }

    const handleSharePage = () => {
        // Implement sharing logic here if needed
    }

    const handleRemovePage = () => {
        // Implement remove logic here if needed
    }
    const fetchMedicament = useCallback(async (medicamentId: string | string[]) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const fullUrl = `${apiUrl}/wiki/medicaments/${medicamentId}`
        try {
            const response = await fetch(fullUrl)
            if (!response.ok) {
                throw new Error('Failed to fetch medicament data')
            }
            const data = await response.json()
            setMedicament(data)
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

    if (error || !medicament) {
        return (
            <motion.div
                className="flex justify-center items-center h-screen"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
            >
                <div className="bg-red-100 p-4 rounded-lg text-red-700">
                    {error || 'Medicament not found'}
                </div>
            </motion.div>
        )
    }

    // Convert prescription string ("False", "True") to a boolean for display
    const isPrescription = medicament.prescription;

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            {/* Basic Info */}
            <Card className="flex-row flex">
                <div className="flex-col w-3/4 flex">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">{medicament.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-semibold">Type:</span> {medicament.type}
                    </div>
                    <div>
                        <span className="font-semibold">ATC Code:</span> {medicament.atc_code}
                    </div>
                    <div>
                        <span className="font-semibold">Approval Number:</span> {medicament.approval_number}
                    </div>
                    <div>
                        <span className="font-semibold">Approval Status:</span>{' '}
                        <Badge variant={medicament.approval_status === 'approved' ? 'destructive' : 'secondary'}>
                            {medicament.approval_status}
                        </Badge>
                    </div>
                    <div>
                        <span className="font-semibold">Prescription Required:</span>{' '}
                        <Badge variant={isPrescription ? 'destructive' : 'secondary'}>
                            {isPrescription ? 'Yes' : 'No'}
                        </Badge>
                    </div>

                </CardContent>
                </div>
                <div className="flex items-end gap-2 flex-col w-1/4 p-2">
                    <Button variant="outline" size="icon" className="border hover:bg-amber-100"
                            onClick={handleSharePage}>
                        <Share/>
                    </Button>
                    <EditButton onConfirm={handleEditPage}/>
                    <DeleteButton onConfirm={handleRemovePage}/>
                </div>
            </Card>

            {/* Active Ingredients */}
            <IngredientsList title="Active Ingredients" ingredients={medicament.properties.active_ingredients || []}/>

            {/* Inactive Ingredients */}
            <IngredientsList title="Inactive Ingredients"
                             ingredients={medicament.properties.inactive_ingredients || []}/>

            {/* Side Effects */}
            <PropertyList title="Side Effects" items={medicament.properties.side_effects || []} />

            {/* Dosage Form */}
            <DescriptionCard title="Dosage Form" description={medicament.properties.dosage_form?.description || ''} />

            {/* Strength */}
            <DescriptionCard title="Strength" description={medicament.properties.strength?.description || ''} />

            {/* Prescription Info */}
            <DescriptionCard title="Prescription Details" description={medicament.properties.prescription?.description || ''} />
        </motion.div>
    )
}
