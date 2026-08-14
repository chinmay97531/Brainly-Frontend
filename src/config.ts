function normalizeBackendUrl(url: string) {
  const cleaned = url.trim().replace(/\/+$/, "").replace(/\/api\/v1$/i, "");
  if (!/^https?:\/\//i.test(cleaned)) {
    console.error(
      `[BrainBox] VITE_BACKEND_URL must be an absolute http(s) URL, not "${url}". Example: https://brainly-backend-p31x.onrender.com`
    );
    return "http://localhost:3000";
  }
  return cleaned;
}

export const BACKEND_URL = normalizeBackendUrl(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
);
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
