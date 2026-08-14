import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, GOOGLE_CLIENT_ID } from "../config";
import { saveCurrentUser } from "../hooks/useUser";

interface GoogleAuthButtonProps {
  onError: (message: string) => void;
}

export function GoogleAuthButton({ onError }: GoogleAuthButtonProps) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axios.post(`${BACKEND_URL}/api/v1/auth/google`, {
          accessToken: tokenResponse.access_token,
        });
        localStorage.setItem("token", data.token);
        if (data.user) {
          saveCurrentUser(data.user);
        }
        navigate("/dashboard");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const apiMessage =
            typeof err.response?.data?.message === "string"
              ? err.response.data.message
              : undefined;
          if (err.response?.status === 404 || err.response?.status === 405) {
            onError(
              `API is not at ${BACKEND_URL}. On Vercel set VITE_BACKEND_URL to https://brainly-backend-p31x.onrender.com (not the Google client ID) and redeploy.`
            );
            return;
          }
          onError(apiMessage || "Google sign-in failed. Please try again.");
          return;
        }
        onError("Google sign-in failed. Please try again.");
      }
    },
    onError: () => onError("Google sign-in was cancelled or failed."),
  });

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </button>
  );
}

export function AuthDivider() {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="my-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
      <span className="h-px flex-1 bg-stone-200" />
      or
      <span className="h-px flex-1 bg-stone-200" />
    </div>
  );
}
