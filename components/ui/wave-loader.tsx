import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export interface WaveLoaderProps
    extends React.BaseHTMLAttributes<HTMLSpanElement>{
    text: string
    asChild?: boolean
}

const WaveLoader = React.forwardRef<HTMLSpanElement, WaveLoaderProps>(
    ({ className, text, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "span"
        return (
            <Comp
                className={cn({className })}
                ref={ref}
                {...props}
            />
        )
    }
)
WaveLoader.displayName = "WaveLoader"

export { WaveLoader }
