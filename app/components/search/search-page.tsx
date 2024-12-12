'use client'

import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {renderDiseaseDetails} from "@/app/components/search/render-disease";
import {renderMedicamentDetails} from "@/app/components/search/render-medicament";
import { CopyIcon } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link";
import {renderOrganizationDetails} from "@/app/components/search/render-organizations";
import {renderPatientsDetails} from "@/app/components/search/render-patients";

interface SearchResult {
    id: string
    name: string

    [key: string]: any
}

interface SearchPageProps {
    entityName: string
    searchEndpoint: string
}

export default function SearchPage({entityName, searchEndpoint}: SearchPageProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const resultsPerPage = 10;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fullUrl = `${apiUrl}${searchEndpoint}`;
    const handleSearch = async () => {
        try {
            // Update the URL in the browser
            const newUrl = `?query=${searchTerm}&page=${currentPage}`;
            router.push(newUrl); // Use Next.js router to update the URL

            // Make the API call
            const response = await fetch(`${fullUrl}?query=${searchTerm}&page=${currentPage}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (typeof data !== 'object' || data === null) {
                throw new Error('Response data is not a valid JSON object');
            }
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching or processing JSON data:', error);
            setSearchResults([]);
        }
    };
    const renderSkeletons = () => {
        return [...Array(resultsPerPage)].map((_, index) => (
            <div key={index} className="animate-pulse border-2 p-4 rounded-lg bg-gray-200">
                <div className="h-4 bg-gray-300 mb-4 rounded w-2/3"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
            </div>
        ));
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Allow animation to kick in
        }, 300); // 300ms delay before starting the animation

        return () => clearTimeout(timer); // Cleanup
    }, []);
    useEffect(() => {
        const query = searchParams.get('query') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);

        if (query) {
            setSearchTerm(query);
            setCurrentPage(page);
            handleSearch();
        }
    }, [searchParams]);



    const totalPages = Math.ceil(searchResults.length / resultsPerPage)

    const renderEntityDetails = (result: SearchResult) => {
        switch (entityName) {
            case 'Disease':
                return renderDiseaseDetails(result);
            case 'Organization':
                return renderOrganizationDetails(result);
            case 'Medicament':
                return renderMedicamentDetails(result);
            case 'Patient':
                return renderPatientsDetails(result);
            default:
                return null
        }
    }
    const buttonLinkStyle = "hover:text-[var(--accent)] border-2 border-[var(--background)] select-none";
    const renderPaginationItems = () => {
        const paginationItems = []

        // Define pagination range
        const startPage = Math.max(1, currentPage - 2)
        const endPage = Math.min(totalPages, currentPage + 2)

        if (startPage > 1) {
            paginationItems.push(
                <PaginationItem key="start" className="cursor-pointer select-none">
                    <PaginationLink
                        className={buttonLinkStyle}
                        onClick={() => setCurrentPage(1)}>
                        <span>1</span>

                    </PaginationLink>
                </PaginationItem>
            )
            if (startPage > 2) {
                paginationItems.push(<PaginationEllipsis key="start-ellipsis select-none" />)
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            paginationItems.push(
                <PaginationItem key={page} className = "cursor-pointer select-none" >
                    <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? `${buttonLinkStyle} font-bold text-blue-600` : `${buttonLinkStyle}`}
                    >
                        <span>{page}</span>
                    </PaginationLink>
                </PaginationItem>
            )
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(<PaginationEllipsis key="end-ellipsis" />)
            }
            paginationItems.push(
                <PaginationItem key="end" className = "cursor-pointer select-none">
                    <PaginationLink onClick={() => setCurrentPage(totalPages)} className={buttonLinkStyle}>
                        <span>{totalPages}</span>
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return paginationItems
    }

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <h2 className="text-3xl font-bold mb-6">{entityName} Search</h2>
            <div className="flex mb-6">
                <Input
                    type="text"
                    placeholder={`Search ${entityName.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault(); // Prevent default form submission (if applicable)
                            handleSearch();
                        }
                    }}
                    className="mr-2 flex-grow border-2 border-[var(--background)] "
                />
                <Button className={buttonLinkStyle} onClick={handleSearch}>
                    Search
                </Button>
            </div>

            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: isLoading ? 0 : 1}} // Fade in once data is loaded
                transition={{duration: 1}} // You can adjust the timing
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
            >
                {isLoading
                    ? renderSkeletons() // Display skeleton loaders while data is loading
                    : searchResults
                        .slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
                        .map((result, index) => (
                            <motion.div
                                key={result.id}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1, // Staggered effect for each card
                                }}
                                className="card hover:shadow-lg transition-shadow duration-400 border-2 rounded-2xl"
                            >
                                <CardHeader>
                                    <Link href={`/${entityName.toLowerCase()}/wiki/${result.id}`}>
                                        <CardTitle className="hover:text-[var(--accent)]">{result.name}</CardTitle>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-gray-600">ID: {result.id}</p>
                                        <Button
                                            variant="unhover"
                                            onClick={(e) => {
                                                navigator.clipboard.writeText(result.id);
                                                const button = e.currentTarget;
                                                button.classList.add('bg-[var(--muted-foreground)]');
                                                setTimeout(() => {
                                                    button.classList.remove('bg-[var(--muted-foreground)]');
                                                }, 220);
                                            }}
                                        >
                                            <CopyIcon className="w-4 h-4"/>
                                        </Button>
                                    </div>

                                    <div className="border-t border-gray-300 my-2"></div>

                                    {renderEntityDetails(result)}
                                </CardContent>
                            </motion.div>
                        ))}
            </motion.div>

            <motion.div className="flex justify-center space-x-2" initial={{opacity: 0}}
                        animate={{opacity: isLoading ? 0 : 1}} // Fade in once data is loaded
                        transition={{duration: 1}}>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem className="cursor-pointer select-none">
                            <PaginationPrevious
                                className={buttonLinkStyle}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem className="cursor-pointer select-none">
                            <PaginationNext
                                className={buttonLinkStyle}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </motion.div>
        </motion.div>

    )
}

