interface InputProps{
    placeholder: string;
    reference?: React.Ref<HTMLInputElement>;
    type?: "text" | "password" | "email";
}

export function Input({placeholder, reference, type = "text"}: InputProps) {
    return(
        <div className="w-full">
            <input 
                ref={reference} 
                placeholder={placeholder} 
                type={type} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5046e4] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
        </div>
    )
}