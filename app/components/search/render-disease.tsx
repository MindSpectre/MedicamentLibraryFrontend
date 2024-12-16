'use client'
interface SearchResult {
    id: string
    name: string

    [key: string]: any
}

export const renderDiseaseDetails = (result: SearchResult) => {

    return (
        <>
            <p className="text-sm text-gray-600 mb-2">Type: {result.type}</p>
            <p className="text-sm mb-2">
                Infectious: <span className={`font-bold ${
                    result.is_infectious ? 'text-red-500' : 'text-green-500'
                }`}>
            {result.is_infectious ? 'Yes' : 'No'}
        </span>
                </p>


        </>
    )
}