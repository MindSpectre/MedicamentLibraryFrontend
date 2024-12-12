'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ingredient } from '@/types/medicament'

interface IngredientsListProps {
    title: string
    ingredients: Ingredient[]
}

export default function IngredientsList({ title, ingredients }: IngredientsListProps) {
    if (!ingredients || ingredients.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {ingredients.map((ingredient, index) => {
                        // Determine a variant or style for risk_level if desired:
                        const variant = ingredient.risk_level <= 2 ? 'secondary' : 'destructive'
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <span className="font-semibold">Risk Level:</span>{' '}
                                            <Badge variant={variant}>{ingredient.risk_level}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </CardContent>
        </Card>
    )
}
