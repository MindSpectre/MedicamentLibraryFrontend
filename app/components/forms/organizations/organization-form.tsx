// @/app/components/organizations/OrganizationForm.tsx

'use client'

import React, { useState, useCallback, ChangeEvent } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from 'lucide-react'
import SaveButton from "@/components/ui/save-button"
import { Organization, OrganizationFormProps, License } from '@/types/organization'

// @ts-ignore
export function OrganizationForm({ initialData, onSave }: OrganizationFormProps) {
    const [formData, setFormData] = useState<Organization>(initialData || {
        contact_details: '',
        country: '',
        id: '',
        name: '',
        properties: {
            license: {
                license_key: '',
                license_name: ''
            }
        },
        type: ''
    })

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }, [])

    const handleLicenseChange = useCallback((field: keyof License, value: string) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                license: {
                    ...prev.properties.license,
                    [field]: value
                }
            }
        }))
    }, [])

    const handleSave = async () => {
        onSave(formData)
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSave()
            }}
            className="space-y-6"
        >
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
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact_details">Contact Details</Label>
                        <Input
                            id="contact_details"
                            name="contact_details"
                            value={formData.contact_details}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            {/* License Information */}
            <Card>
                <CardHeader>
                    <CardTitle>License Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="license_name">License Name</Label>
                        <Input
                            id="license_name"
                            name="license_name"
                            value={formData.properties.license.license_name}
                            onChange={(e) => handleLicenseChange('license_name', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="license_key">License Key</Label>
                        <Input
                            id="license_key"
                            name="license_key"
                            value={formData.properties.license.license_key}
                            onChange={(e) => handleLicenseChange('license_key', e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            <SaveButton onSave={handleSave}>Save Changes</SaveButton>
        </form>
    )
}
