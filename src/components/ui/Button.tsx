import { ReactElement } from "react";

interface ButtonProps {
    variant: Variants;
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
}
type Variants = "primary" | "secondary"

const variantStyle = {
    "primary": "bg-[#5046e4] text-white",
    "secondary": "bg-[#e0e7fe] text-[#3e38a7]"
}

const sizeStyle = {
    "sm": "py-2 px-3",
    "md": "py-4 px-4",
    "lg": "py-6 px-5"
}

const defaultStyles = "rounded-xl font-medium flex items-center justify-center transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

export const Button = (props: ButtonProps) => {

    return <button 
        type={props.type || "button"}
        onClick={props.onClick} 
        className={`${variantStyle[props.variant]} ${defaultStyles} 
        ${sizeStyle[props.size]} ${props.fullWidth ? "w-full" : ""} ${props.loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`} 
        disabled={props.loading}
    >
        {props.loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )}
        {props.startIcon && !props.loading && <div className="pr-2">{props.startIcon}</div>} 
        {props.text} 
        {props.endIcon && !props.loading && props.endIcon}
    </button>
}