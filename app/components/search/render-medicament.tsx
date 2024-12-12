import {Badge} from "@/components/ui/badge";

interface SearchResult {
    id: string
    name: string

    [key: string]: any
}

export const renderMedicamentDetails = (result: SearchResult) => {

    return (
        <>
            <p className="text-sm text-gray-600 mb-2">Type: {result.type}</p>
            <p className="text-sm text-gray-600 mb-2">
            <span> Approval status: </span>
            <span className={`font-bold ${
                result.approval_status === 'accepted' ? 'text-green-500' :
                    result.approval_status === 'rejected' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                { result.approval_status}
            </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
                <span> Prescription: </span>
                <span className={`font-bold ${
                    result.prescription ? 'text-red-500' : 'text-green-500'
                }`}>
                {result.prescription ? 'required' : 'not required'}
                </span>
            </p>


        </>
    )
}