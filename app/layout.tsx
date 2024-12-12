import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/header/header'
import React from "react";
import {Toaster} from "sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MedicamentLibrary',
  description: 'A comprehensive library for medicaments, diseases, patient, and organizations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />

        <main className="container mx-auto px-4 py-8">
          {children}
        <Toaster />
        </main>
      </body>
    </html>
  )
}

