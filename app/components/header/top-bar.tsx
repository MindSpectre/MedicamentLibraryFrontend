'use client';

import Link from 'next/link';
import { Shuffle, LogIn } from 'lucide-react';
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
    const handleAuthPage = () => {

        const authPage = "/auth";
        router.push(authPage);
    };
    return (
        <div className="top-bar">
            <div className="container flex max-w-full">
                <Link href="/public" className="logo">
                    MedicamentLibrary
                </Link>
                <div className="actions">
                    <BrowseButton/>
                    <Button variant="outline" onClick={handleRandomPage} className="max-h-full m-0 flex hover:text-[var(--accent)]">
                        <Shuffle className="mr-2 h-4 w-4 " />
                        Random Page
                    </Button>
                    <Button variant="outline" onClick={handleAuthPage} className="max-h-full m-0 flex hover:text-[var(--accent)]">
                        <LogIn className="mr-2 h-4 w-4 " />
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}
