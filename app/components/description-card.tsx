'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DescriptionCardProps {
    title: string
    description: string
}

export default function DescriptionCard({ title, description }: DescriptionCardProps) {
    if (!description) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {description}
                </CardContent>
            </Card>
        </motion.div>
    )
}
