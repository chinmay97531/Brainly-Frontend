import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface CurrentUser {
  username: string;
  email: string;
  avatar: string | null;
}

const USER_KEY = "brainbox_user";

function readCachedUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: CurrentUser | null) {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("brainbox-user"));
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("brainbox-user"));
}

const UserContext = createContext<CurrentUser | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(() => readCachedUser());

  useEffect(() => {
    const sync = () => setUser(readCachedUser());
    window.addEventListener("brainbox-user", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("brainbox-user", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/me`, {
        headers: { token },
      })
      .then((response) => {
        saveCurrentUser(response.data);
        setUser(response.data);
      })
      .catch(() => {
        setUser(readCachedUser());
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
