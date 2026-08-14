import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const dimension =
    size === "sm" ? "size-8 text-[10px]" : size === "lg" ? "size-11 text-sm" : "size-10 text-xs";
  const initials =
    name
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "B";

  useEffect(() => {
    if (!src) {
      setPhoto(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPhoto(src);
      return;
    }

    let objectUrl: string | null = null;
    const controller = new AbortController();

    axios
      .get(`${BACKEND_URL}/api/v1/me/photo`, {
        headers: { token },
        responseType: "blob",
        signal: controller.signal,
      })
      .then((response) => {
        objectUrl = URL.createObjectURL(response.data);
        setPhoto(objectUrl);
      })
      .catch(() => {
        setPhoto(src);
      });

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${dimension} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${dimension} flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white ring-2 ring-white shadow-sm`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
