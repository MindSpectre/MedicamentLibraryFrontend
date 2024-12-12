
// @/app/components/organizations/OrganizationViewPage.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Pencil, Share } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "@/components/ui/delete-button"
import PropertyList from '@/app/components/property-list'
import DescriptionCard from '@/app/components/description-card'
import { Organization } from '@/types/organization'
import {EditButton} from "@/components/ui/edit-button";

export default function OrganizationViewPage() {
    const { id } = useParams()
    const router = useRouter()

    const [organization, setOrganization] = useState<Organization | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            fetchOrganization(id as string)
        } else {
            setLoading(false)
        }
    }, [id])

    const fetchOrganization = useCallback(async (organizationId: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const fullUrl = `${apiUrl}/wiki/organizations/${organizationId}`
        try {
            const response = await fetch(fullUrl)
            if (!response.ok) {
                throw new Error('Failed to fetch organizations data')
            }
            const data = await response.json()
            setOrganization(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleEditPage = () => {
        router.push(`/organization/edit/${id}`)
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

    if (error || !organization) {
        return (
            <motion.div
                className="flex justify-center items-center h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="bg-red-100 p-4 rounded-lg text-red-700">
                    {error || 'Organization not found'}
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Basic Info */}
            <Card className="flex-row flex">
                <div className="flex-col w-3/4 flex">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">{organization.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-semibold">ID:</span> {organization.id}
                        </div>
                        <div>
                            <span className="font-semibold">Type:</span> {organization.type}
                        </div>
                        <div>
                            <span className="font-semibold">Country:</span> {organization.country}
                        </div>
                        <div>
                            <span className="font-semibold">Contact Details:</span> {organization.contact_details}
                        </div>
                    </CardContent>
                </div>
                <div className="flex items-end gap-2 flex-col w-1/4 p-2">
                    <div className="flex items-end gap-2 flex-col w-1/4 p-2">
                    <Button variant="outline" size="icon" className="border hover:bg-amber-100"
                            onClick={handleSharePage}>
                        <Share/>
                    </Button>
                    <EditButton onConfirm={handleEditPage}/>
                    <DeleteButton onConfirm={handleRemovePage}/>
                    </div>
                </div>
            </Card>

            {/* License Details */}
            <DescriptionCard
                title="License Details"
                description={`License Name: ${organization.properties.license.license_name}, License Key: ${organization.properties.license.license_key}`}
            />

            {/* Additional Properties can be added here */}
        </motion.div>
    )
}
