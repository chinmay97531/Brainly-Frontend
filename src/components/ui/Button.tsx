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
  hideLabelOnMobile?: boolean;
}
type Variants = "primary" | "secondary";

const variantStyle = {
  primary:
    "bg-brand text-cream hover:bg-brand-dark",
  secondary:
    "bg-white text-stone-700 border border-stone-300 hover:border-stone-400 hover:bg-stone-50",
};

const sizeStyle = {
  sm: "h-10 px-3.5 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const defaultStyles =
  "rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

export const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      aria-label={props.hideLabelOnMobile ? props.text : undefined}
      className={`${variantStyle[props.variant]} ${defaultStyles} ${sizeStyle[props.size]} ${
        props.fullWidth ? "w-full" : ""
      } ${props.hideLabelOnMobile ? "px-2.5 lg:px-3.5" : ""} ${
        props.loading ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      disabled={props.loading}
    >
      {props.loading && (
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-current" />
        </span>
      )}
      {props.startIcon && !props.loading && <span className="flex items-center">{props.startIcon}</span>}
      <span className={props.hideLabelOnMobile ? "hidden lg:inline" : ""}>{props.text}</span>
      {props.endIcon && !props.loading && <span className="flex items-center">{props.endIcon}</span>}
    </button>
  );
};
