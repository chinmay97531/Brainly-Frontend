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

const defaultStyles = "rounded-xl font-light flex items-center cursor-pointer";


export const Button = (props: ButtonProps) => {

    return <button onClick={props.onClick} className={`${variantStyle[props.variant]} ${defaultStyles} 
    ${sizeStyle[props.size]} ${props.fullWidth ? "w-full flex justify-center items-center" : ""} ${props.loading ? "opacity-45" : ""}`} disabled={props.loading}>
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null} { props.text } {props.endIcon}
        </button>
}