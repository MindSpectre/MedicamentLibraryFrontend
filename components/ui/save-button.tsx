"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SaveButtonProps {
    onSave: () => Promise<void>
    children?: React.ReactNode
}

// @ts-ignore
export default function SaveButton({ onSave, children = "Save Changes" }: SaveButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        await onSave()
        setIsLoading(false)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 1000)
    }

    return (
        <Button
            type="submit"
            variant="outline"
            className="w-full relative overflow-hidden transition-all duration-300 ease-in-out hover:bg-green-500 hover:text-white"
            onClick={handleSave}
            disabled={isLoading || isSaved}
        >
            <motion.span
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoading || isSaved ? 0 : 1 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.span>
            {isLoading && (
                <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Loader2 className="animate-spin" size={20} />
                </motion.span>
            )}
            {isSaved && (
                <motion.span
                    className="absolute inset-0 flex items-center justify-center bg-green-500 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Check size={20} />
                </motion.span>
            )}
        </Button>
    )
}

