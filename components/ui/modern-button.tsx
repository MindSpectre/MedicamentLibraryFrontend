import React from "react";
// Adjust import paths
import "./modern-button.css"
interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onConfirm: () => void; // Function to call when the Edit is confirmed
    text: string;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
    ({className, text, onConfirm, ...props}, ref) => {

        return (

            /* From Uiverse.io by aaronross1 */
            <button ref={ref} className={`modern-button ${className}`} {...props} onClick={onConfirm}>
                <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                    ></path>
                </svg>
                <span className="text">{text}</span>
                <span className="circle"></span>
                <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                    ></path>
                </svg>
            </button>

        );
    }
);

ModernButton.displayName = "ModernButton";

export {ModernButton};
