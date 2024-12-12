'use client'

import { SetStateAction, useState} from 'react'
import {Check, ChevronsUpDown} from 'lucide-react'
import {Button} from "@/components/ui/button"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandList,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {useRouter} from 'next/navigation'
import Link from "next/link";

const pages = [
    {value: "home", label: "Home"},
    {value: "disease/search", label: "Disease Search"},
    {value: "medicament/search", label: "Medicament Search"},
    {value: "patient/search", label: "Patient Search"},
    {value: "organization/search", label: "Organization Search"},
]

export default function BrowseButton() {
    const [value, setValue] = useState("")
    const router = useRouter()

    const handleSelect = (selectedValue: SetStateAction<string>) => {
        setValue(selectedValue)
        router.push(`/${selectedValue === "home" ? "" : selectedValue}`)
    }

    return (<Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={!!value}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? pages.find((page) => page.value === value)?.label
                        : "Browse..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[200px] p-0 bg-[var(--background)] border border-[var(--foreground)] rounded-lg shadow-lg"
            >
                <Command>
                    <CommandInput
                        className="bg-[var(--background)] text-[var(--foreground)] border-[var(--foreground)] px-2 py-1 rounded-t-lg"
                        placeholder="Search pages..."
                    />

                    <CommandList className="hover: text-lg click:text-[var(--accent)]">
                        <CommandEmpty className="text-[var(--foreground)] px-2 py-1 ">
                            No page found.
                        </CommandEmpty>
                        <CommandGroup className="text-[var(--accent)] px-2 py-1 " >
                            {pages.map((page) => (
                                <CommandItem className="browse-link"
                                    key={page.value}
                                    onSelect={() => handleSelect(page.value)}

                                    // className="  px-2 py-1 cursor-pointer rounded border border-[var(--foreground)] m-1 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)"
                                >
                                    {page.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>


    )
}
