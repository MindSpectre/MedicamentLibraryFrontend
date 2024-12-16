'use client'

import {Badge} from "@/components/ui/badge";

interface SearchResult {
    id: string
    name: string

    [key: string]: any
}

export const renderPatientsDetails = (result: SearchResult) => {

    return (
        <>
            <p className="text-sm text-gray-600 mb-2">Gender: {result.gender}</p>
            <p className="text-sm text-gray-600 mb-2">Birth
                Date: {`${result.birth_date.year}-${result.birth_date.month}-${result.birth_date.day}`}</p>
            {result.properties && (
                <div className="mt-2">
                    <h4 className="text-sm font-semibold">Allergies:</h4>
                    {result.properties.allergies.map((allergy: string, index: number) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                            {allergy}
                        </Badge>
                    ))}
                </div>
            )}
        </>
    )
}