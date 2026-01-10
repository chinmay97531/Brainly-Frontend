import axios from "axios";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Signin() {

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function signin() {
    try {
      setError("");
      setLoading(true);

      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      if (!username || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
        username,
        password
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = err.response.data?.message || err.response.data?.error || "An error occurred. Please try again.";
          setError(errorMessage);
        } else if (err.request) {
          setError("Unable to connect to server. Please check your connection.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      signin();
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-8 md:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 mb-6">
            <Input reference={usernameRef} placeholder="Username" type="text" />
            <Input reference={passwordRef} placeholder="Password" type="password" />
          </div>

          <div className="space-y-3">
            <Button 
              type="submit"
              loading={loading} 
              variant="primary" 
              size="md" 
              text={loading ? "Signing in..." : "Sign In"} 
              fullWidth={true} 
            />
            <Button 
              type="button"
              onClick={() => navigate("/signup")} 
              loading={false} 
              variant="secondary" 
              size="sm" 
              text="Don't have an account? Sign up" 
              fullWidth={true} 
            />
          </div>
        </form>
      </div>
    </div>
  );
}
