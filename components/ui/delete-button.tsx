import React from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog"; // Adjust import paths
import {useRouter} from "next/router";
import {ButtonProps} from "@/components/ui/button";
import "./delete-button.css"
interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onConfirm: () => void; // Function to call when the delete is confirmed
}

const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
    ({className, onConfirm, ...props}, ref) => {

        return (
            <AlertDialog >
                <AlertDialogTrigger asChild>
                    <button ref={ref} className={`delete-button ${className}`} {...props}>
                        <svg className="delete-svgIcon" viewBox="0 0 448 512">
                            <path
                                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                        </svg>
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[var(--background)]">
                    <AlertDialogHeader className="text-white">
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-white" >Cancel</AlertDialogCancel>
                        <AlertDialogAction className="text-[var(--accent)] border" onClick={onConfirm} >Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
);

DeleteButton.displayName = "DeleteButton";

export {DeleteButton};
