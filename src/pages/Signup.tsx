import { useRef, useState } from "react";
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
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>("");

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loading) {
            signup();
        }
    };

    async function signup() {
        try {
            setError("");
            setSuccess("");
            setLoading(true);

            const username = usernameRef.current?.value;
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;

            if (!username || !email || !password) {
                setError("Please fill in all fields");
                setLoading(false);
                return;
            }

            if (!validateEmail(email)) {
                setError("Please enter a valid email address");
                setLoading(false);
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                setLoading(false);
                return;
            }

            await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                email,
                password
            });

            setSuccess("Account created successfully! Redirecting...");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
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

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] flex justify-center items-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-8 md:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600 text-sm">Sign up to get started with Brainly</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 mb-6">
                        <Input reference={usernameRef} placeholder="Username" type="text" />
                        <Input reference={emailRef} placeholder="Email" type="email" />
                        <Input reference={passwordRef} placeholder="Password" type="password" />
                    </div>

                    <div className="space-y-3">
                        <Button 
                            type="submit"
                            loading={loading} 
                            variant="primary" 
                            size="md" 
                            text={loading ? "Creating account..." : "Sign Up"} 
                            fullWidth={true} 
                        />
                        <Button 
                            type="button"
                            onClick={() => navigate("/")} 
                            loading={false} 
                            variant="secondary" 
                            size="sm" 
                            text="Already have an account? Sign in" 
                            fullWidth={true} 
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
