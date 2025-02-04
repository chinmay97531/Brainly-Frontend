import axios from "axios";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import { useRef } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Signin() {

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;
      const respone = await axios.post(BACKEND_URL + "/api/v1/signin", {
              username,
              password
      })

      const jwt = respone.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard")
  }

  return (
    <div className="h-screen w-screen bg-[#f8fbfb] flex justify-center items-center">
      <div className="bg-white rounded-lg border-[#E5E7EB] min-w-48 p-8">
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="password" />
        <div className="flex justify-center">
          <Button onClick={signin} loading={false} variant="primary" size="sm" text="Signin" fullWidth={true} />
        </div>
      </div>
    </div>
  );
}
