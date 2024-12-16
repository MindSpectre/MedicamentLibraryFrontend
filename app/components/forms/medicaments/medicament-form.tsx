'use client'

import React, { useState, useCallback, ChangeEvent } from 'react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from 'lucide-react'
import SaveButton from "@/components/ui/save-button"
import { Medicament, MedicamentFormProps, MedicamentProperties, Ingredient } from '@/types/medicament'

const APPROVAL_STATUSES = ['approved', 'pending', 'rejected'] as const;

// @ts-ignore
export function MedicamentForm({ initialData, onSave }: MedicamentFormProps) {
    const [formData, setFormData] = useState<Medicament>(initialData || {
        id: '',
        approval_number: '',
        approval_status: 'pending',
        atc_code: '',
        name: '',
        prescription: false,
        properties: {
            active_ingredients: [],
            dosage_form: { description: '' },
            inactive_ingredients: [],
            prescription: { description: '' },
            side_effects: [],
            strength: { description: '' }
        },
        type: ''
    })

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'True' : 'False') : value
        }))
    }, [])

    const handleApprovalStatusChange = useCallback((value: string) => {
        setFormData((prev) => ({
            ...prev,
            approval_status: value
        }))
    }, [])

    const handleAddSideEffect = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const target = e.target as HTMLInputElement
            const newValue = target.value.trim()
            if (newValue) {
                setFormData((prev) => ({
                    ...prev,
                    properties: {
                        ...prev.properties,
                        side_effects: [...prev.properties.side_effects, newValue]
                    }
                }))
                target.value = ''
            }
        }
    }, [])

    const removeSideEffect = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                side_effects: prev.properties.side_effects.filter((_, i) => i !== index)
            }
        }))
    }, [])

    const handleDescriptionChange = useCallback((field: keyof MedicamentProperties, value: string) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                [field]: { description: value }
            }
        }))
    }, [])

    const handleAddIngredient = useCallback((field: 'active_ingredients' | 'inactive_ingredients') => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                [field]: [...prev.properties[field], { name: '', risk_level: 1 }]
            }
        }))
    }, [])

    const handleIngredientChange = useCallback((field: 'active_ingredients' | 'inactive_ingredients', index: number, ingredient: Partial<Ingredient>) => {
        setFormData((prev) => {
            const newIngredients = [...prev.properties[field]]
            newIngredients[index] = { ...newIngredients[index], ...ingredient }
            return {
                ...prev,
                properties: {
                    ...prev.properties,
                    [field]: newIngredients
                }
            }
        })
    }, [])

    const removeIngredient = useCallback((field: 'active_ingredients' | 'inactive_ingredients', index: number) => {
        setFormData((prev) => ({
            ...prev,
            properties: {
                ...prev.properties,
                [field]: prev.properties[field].filter((_, i) => i !== index)
            }
        }))
    }, [])

    const handleSave = async () => {
        // Optional: transform data before saving if needed
        onSave(formData)
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
            }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {initialData?.approval_number && (
                        <div>
                            <Label htmlFor="approval_number">Approval Number</Label>
                            <Input id="approval_number" name="approval_number" value={formData.approval_number} disabled />
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
                        <Label htmlFor="atc_code">ATC Code</Label>
                        <Input
                            id="atc_code"
                            name="atc_code"
                            value={formData.atc_code}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="approval_status">Approval Status</Label>
                        <Select value={formData.approval_status} onValueChange={handleApprovalStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select approval status" />
                            </SelectTrigger>
                            <SelectContent>
                                {APPROVAL_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="prescription"
                            name="prescription"
                            checked={formData.prescription}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({ ...prev, prescription: !!checked }))
                            }
                        />
                        <Label htmlFor="prescription">Prescription Required</Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active Ingredients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.properties.active_ingredients.map((ingredient, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingredient {index + 1}</CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeIngredient('active_ingredients', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <Label htmlFor={`active_name_${index}`}>Name</Label>
                                    <Input
                                        id={`active_name_${index}`}
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange('active_ingredients', index, { name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`active_risk_${index}`}>Risk Level</Label>
                                    <Input
                                        type="number"
                                        id={`active_risk_${index}`}
                                        value={ingredient.risk_level}
                                        onChange={(e) => handleIngredientChange('active_ingredients', index, { risk_level: Number(e.target.value) })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="button" onClick={() => handleAddIngredient('active_ingredients')} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Active Ingredient
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Inactive Ingredients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.properties.inactive_ingredients.map((ingredient, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingredient {index + 1}</CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeIngredient('inactive_ingredients', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <Label htmlFor={`inactive_name_${index}`}>Name</Label>
                                    <Input
                                        id={`inactive_name_${index}`}
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange('inactive_ingredients', index, { name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`inactive_risk_${index}`}>Risk Level</Label>
                                    <Input
                                        type="number"
                                        id={`inactive_risk_${index}`}
                                        value={ingredient.risk_level}
                                        onChange={(e) => handleIngredientChange('inactive_ingredients', index, { risk_level: Number(e.target.value) })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="button" onClick={() => handleAddIngredient('inactive_ingredients')} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Inactive Ingredient
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Side Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {formData.properties.side_effects.map((effect, index) => (
                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1">
                                <span>{effect}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 p-0"
                                    onClick={() => removeSideEffect(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Input
                            type="text"
                            placeholder="Add side effect"
                            className="w-40"
                            onKeyDown={handleAddSideEffect}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dosage Form</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Input
                        placeholder="Dosage Form Description"
                        value={formData.properties.dosage_form.description}
                        onChange={(e) => handleDescriptionChange('dosage_form', e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Strength</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Input
                        placeholder="Strength Description"
                        value={formData.properties.strength.description}
                        onChange={(e) => handleDescriptionChange('strength', e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Prescription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Input
                        placeholder="Prescription Details"
                        value={formData.properties.prescription.description}
                        onChange={(e) => handleDescriptionChange('prescription', e.target.value)}
                    />
                </CardContent>
            </Card>

            <SaveButton onSave={handleSave}>Save Changes</SaveButton>
        </form>
    )
}
