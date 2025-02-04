import { useRef } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signup() {
        const username = usernameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                email,
                password
        })

        alert("You have signed up!");
        navigate("/dashboard")
    }

  return (
    <div className="h-screen w-screen bg-[#f8fbfb] flex justify-center items-center">
      <div className="bg-white rounded-lg border-[#E5E7EB] min-w-48 p-8">
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={emailRef} placeholder="email" />
        <Input reference={passwordRef} placeholder="password" />
        <div className="flex justify-center">
          <Button onClick={signup} loading={false} variant="primary" size="sm" text="Signup" fullWidth={true} />
        </div>
      </div>
    </div>
  );
}
