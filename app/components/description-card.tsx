'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DescriptionCardProps {
    title: string
    description: string
}
export const handleSharePage = () => {
    navigator.clipboard.writeText(window.location.href);
}

export const handleRemovePage = async (type: string, id: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const fullUrl = `${apiUrl}/wiki/${type}/${id}`;

        const response = await fetch(fullUrl, {
            method: 'DELETE', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json', // Optional: Set headers as needed
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional: Include authorization if needed
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json(); // Parse the response if there's a body
        console.log('Delete successful:', data);
    } catch (error) {
        console.error('Failed to remove page:', error.message);
    }
};
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
