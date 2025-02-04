interface InputProps{
    placeholder: string;
    reference?: React.Ref<HTMLInputElement>
}

export function Input({placeholder, reference}: InputProps) {
    return(
        <div>
            <input ref={reference} placeholder={placeholder} type={"text"} className="px-4 py-2 border border-[#bbbec3] rounded-md m-2"></input>
        </div>
    )
}