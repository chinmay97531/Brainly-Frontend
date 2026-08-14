import { useRef, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthDivider, GoogleAuthButton } from "../components/GoogleAuthButton";

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
        password,
      });

      setSuccess("Account created. Redirecting you in...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            "An error occurred. Please try again.";
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
    <AuthLayout
      title="Create an account"
      subtitle="Start saving the things you want to learn."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-brand hover:text-brand-dark">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleAuthButton onError={setError} />
      <AuthDivider />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          reference={usernameRef}
          label="Username"
          placeholder="your name on BrainBox"
          type="text"
          name="username"
          autoComplete="username"
        />
        <Input
          reference={emailRef}
          label="Email"
          placeholder="you@college.edu"
          type="email"
          name="email"
          autoComplete="email"
        />
        <Input
          reference={passwordRef}
          label="Password"
          placeholder="at least 6 characters"
          type="password"
          name="password"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={loading}
          variant="primary"
          size="md"
          text={loading ? "Creating account" : "Sign up"}
          fullWidth={true}
        />
      </form>
    </AuthLayout>
  );
}
