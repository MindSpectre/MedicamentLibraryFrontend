'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Symptom } from '@/types/disease'

interface SymptomsListProps {
    symptoms: Symptom[]
}

export default function SymptomsList({ symptoms }: SymptomsListProps) {
    if (!symptoms || symptoms.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {symptoms.map((symptom, index) => {
                        // Determine severity display:
                        // If severity is 'r', treat it as 'High' severity; otherwise, 'Normal'.
                        const isHighSeverity = symptom.severity === 'r' || symptom.severity === 'High'
                        const severityLabel = isHighSeverity ? 'High' : 'Normal'
                        const severityVariant = isHighSeverity ? 'destructive' : 'secondary'

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{symptom.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p>
                                            <span className="font-semibold">Type:</span> {symptom.type}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Duration:</span> {symptom.duration}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Severity:</span>{' '}
                                            <Badge variant={severityVariant}>{severityLabel}</Badge>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Description:</span> {symptom.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
