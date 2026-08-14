import axios from "axios";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthDivider, GoogleAuthButton } from "../components/GoogleAuthButton";
import { saveCurrentUser } from "../hooks/useUser";

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function signin() {
    try {
      setError("");
      setInfo("");
      setLoading(true);

      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
        email,
        username: email,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      if (response.data.user) {
        saveCurrentUser(response.data.user);
      }
      navigate("/dashboard");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      signin();
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue your learning journey."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-brand hover:text-brand-dark">
            Sign up
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
      {info && (
        <div className="mb-4 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          reference={emailRef}
          label="Email"
          placeholder="you@college.edu"
          type="email"
          name="email"
          autoComplete="email"
        />
        <div>
          <Input
            reference={passwordRef}
            label="Password"
            placeholder="••••••••"
            type="password"
            name="password"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() =>
              setInfo("Password reset isn’t available yet. Sign in with Google, or use the password you created.")
            }
            className="mt-2 text-[13px] font-medium text-brand hover:text-brand-dark"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={loading}
          variant="primary"
          size="md"
          text={loading ? "Signing in" : "Sign in"}
          fullWidth={true}
        />
      </form>
    </AuthLayout>
  );
}
