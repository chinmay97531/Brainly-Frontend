import axios from "axios";
import { BACKEND_URL } from "../config";

export function shareUrlFromHash(hash: string) {
  return `${window.location.origin}/share/${hash}`;
}

export function hashFromShareResponse(data: { hash?: string; message?: string }) {
  if (data.hash) {
    return data.hash;
  }
  if (data.message && data.message.startsWith("/share/")) {
    return data.message.split("/share/")[1];
  }
  throw new Error("Unexpected response format");
}

export async function copyShareUrl(hash: string) {
  const shareURL = shareUrlFromHash(hash);
  try {
    await navigator.clipboard.writeText(shareURL);
    return { url: shareURL, copied: true };
  } catch {
    return { url: shareURL, copied: false };
  }
}

export async function shareDashboard() {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/brain/share`,
    { share: true },
    { headers: { token: localStorage.getItem("token") } }
  );
  return copyShareUrl(hashFromShareResponse(response.data));
}

export async function shareFolder(folderId: string) {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/folders/${folderId}/share`,
    { share: true },
    { headers: { token: localStorage.getItem("token") } }
  );
  return copyShareUrl(hashFromShareResponse(response.data));
}
