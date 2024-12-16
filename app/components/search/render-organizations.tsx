'use client'
interface SearchResult {
    id: string
    name: string

    [key: string]: any
}

export const renderOrganizationDetails = (result: SearchResult) => {

    return (
        <>
            <p className="text-sm text-gray-600 mb-2">Type: {result.type}</p>
            <p className="text-sm text-gray-600 mb-2">Country: {result.country}</p>
            <p className="text-sm text-gray-600 mb-2">Contact: {result.contact_details}</p>
        </>
    )
}