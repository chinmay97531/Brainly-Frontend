function normalizeBackendUrl(url: string) {
  return url.replace(/\/+$/, "").replace(/\/api\/v1$/i, "");
}

export const BACKEND_URL = normalizeBackendUrl(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
);
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
