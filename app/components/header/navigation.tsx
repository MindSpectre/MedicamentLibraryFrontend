'use client';

import Link from 'next/link';
import {pages} from './pages'


export default function Navigation() {
    return (
        <nav className="navigation">
            <div className="container">
                <ul className="nav-links">
                    {pages.map((page) => (
                        <li key={page.href} className="nav-item">
                            <Link href={page.href} className="nav-link">
                                {page.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
