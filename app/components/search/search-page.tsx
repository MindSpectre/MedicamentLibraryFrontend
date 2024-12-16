'use client';

import React, { useState, useEffect, useCallback , useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon, Loader } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { renderDiseaseDetails } from "@/app/components/search/render-disease";
import { renderMedicamentDetails } from "@/app/components/search/render-medicament";
import { renderOrganizationDetails } from "@/app/components/search/render-organizations";
import { renderPatientsDetails } from "@/app/components/search/render-patients";

interface SearchResult {
    id: string;
    name: string;
    [key: string]: any;
}

interface SearchPageProps {
    entityName: string;
    searchEndpoint: string;
}

// Separate component for the search logic and rendering.
// This component uses useSearchParams() and must be inside a Suspense boundary.
function SearchContent({ entityName, searchEndpoint }: SearchPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const resultsPerPage = 10;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fullUrl = `${apiUrl}${searchEndpoint}`;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const lastSearchRef = useRef<{ query: string; page: number }>({ query: '', page: 1 });

    const search = useCallback(async (query: string, page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${fullUrl}?query=${encodeURIComponent(query)}&page=${page}`);
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
        } finally {
            setIsLoading(false);
        }
    }, [fullUrl]);

    const handleSearch = useCallback(() => {
        const encodedQuery = encodeURIComponent(searchTerm);
        router.push(`?query=${encodedQuery}&page=1`);
    }, [router, searchTerm]);

    const handlePageChange = useCallback((page: number) => {
        const encodedQuery = encodeURIComponent(searchTerm);
        router.push(`?query=${encodedQuery}&page=${page}`);
    }, [router, searchTerm]);

    useEffect(() => {
        if (query) {
            if (lastSearchRef.current.query !== query || lastSearchRef.current.page !== page) {
                setSearchTerm(query);
                setCurrentPage(page);
                search(query, page);
                lastSearchRef.current = { query, page };
            }
        } else {
            setSearchTerm('');
            setCurrentPage(1);
            setSearchResults([]);
            setIsLoading(false);
        }
    }, [query, page, search]);

    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

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
                return null;
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

    const buttonLinkStyle = "hover:text-[var(--accent)] border-2 border-[var(--background)] select-none";

    const renderPaginationItems = () => {
        const paginationItems = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationItems.push(
                <PaginationItem key="start" className="cursor-pointer select-none">
                    <PaginationLink
                        className={buttonLinkStyle}
                        onClick={() => handlePageChange(1)}
                    >
                        <span>1</span>
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
            }
        }

        for (let p = startPage; p <= endPage; p++) {
            paginationItems.push(
                <PaginationItem key={p} className="cursor-pointer select-none">
                    <PaginationLink
                        onClick={() => handlePageChange(p)}
                        className={currentPage === p ? `${buttonLinkStyle} font-bold text-white bg-green-950` : `${buttonLinkStyle}`}
                    >
                        <span>{p}</span>
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
            }
            paginationItems.push(
                <PaginationItem key="end" className="cursor-pointer select-none">
                    <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className={buttonLinkStyle}
                    >
                        <span>{totalPages}</span>
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return paginationItems;
    };

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-6xl font-bold mb-6">{entityName} Search</h2>
            <div className="flex mb-6">
                <Input
                    type="text"
                    placeholder={`Search ${entityName.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleSearch();
                        }
                    }}
                    className="mr-2 flex-grow border-2 border-[var(--background)]"
                />
                <Button
                    className="hover:bg-[var(--accent)] hover:text-[var(--foreground)] border-2 border-[var(--background)] select-none"
                    onClick={handleSearch}>
                    Search
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
            >
                {isLoading
                    ? renderSkeletons()
                    : searchResults
                        .slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
                        .map((result, index) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
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
                                            onClick={() => {
                                                navigator.clipboard.writeText(result.id);
                                            }}
                                        >
                                            <CopyIcon className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="border-t border-gray-300 my-2"></div>

                                    {renderEntityDetails(result)}
                                </CardContent>
                            </motion.div>
                        ))}
            </motion.div>

            {totalPages > 1 && (
                <motion.div
                    className="flex justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoading ? 0 : 1 }}
                    transition={{ duration: 1 }}
                >
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem className="cursor-pointer select-none">
                                <PaginationPrevious
                                    className={buttonLinkStyle}
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem className="cursor-pointer select-none">
                                <PaginationNext
                                    className={buttonLinkStyle}
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </motion.div>
            )}
        </motion.div>
    );
}

export default function SearchPage(props: SearchPageProps) {
    return (
        <Suspense fallback={<Loader />}>
            <SearchContent {...props} />
        </Suspense>
    );
}
