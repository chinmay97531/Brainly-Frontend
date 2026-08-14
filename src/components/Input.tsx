import { useId, useState } from "react";

interface InputProps {
  placeholder: string;
  reference?: React.Ref<HTMLInputElement>;
  type?: "text" | "password" | "email";
  label?: string;
  autoComplete?: string;
  name?: string;
}

export function Input({
  placeholder,
  reference,
  type = "text",
  label,
  autoComplete,
  name,
}: InputProps) {
  const generatedId = useId();
  const inputId = name ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-stone-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          ref={reference}
          placeholder={placeholder}
          type={inputType}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-stone-400 transition duration-150 hover:border-stone-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-stone-500 hover:text-brand"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}
