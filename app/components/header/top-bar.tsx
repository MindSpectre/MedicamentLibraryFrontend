'use client';

import Link from 'next/link';
import { Shuffle } from 'lucide-react';
import BrowseButton from './browse-button';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {pages} from './pages'
export default function TopBar() {
    const router = useRouter();

    const handleRandomPage = () => {

        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        router.push(randomPage.href);
    };

    return (
        <div className="top-bar">
            <div className="container flex max-w-full">
                <Link href="/public" className="logo">
                    MedicamentLibrary
                </Link>
                <div className="actions">
                    <BrowseButton />
                    <Button variant="outline" onClick={handleRandomPage} className="max-h-full m-0 flex">
                        <Shuffle className="mr-2 h-4 w-4 " />
                        Random Page
                    </Button>
                </div>
            </div>
        </div>
    );
}
