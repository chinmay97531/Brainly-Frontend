import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Folder {
  _id: string;
  name: string;
}

interface FolderContextValue {
  folders: Folder[];
  refresh: () => Promise<void>;
  createFolder: (name: string) => Promise<Folder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

const FolderContext = createContext<FolderContextValue | null>(null);

function authHeaders() {
  return { token: localStorage.getItem("token") };
}

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFolders([]);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/folders`, {
        headers: authHeaders(),
      });
      setFolders(response.data.folders || []);
    } catch {
      setFolders([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createFolder(name: string) {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/folders`,
      { name },
      { headers: authHeaders() }
    );
    const folder = response.data.folder as Folder;
    await refresh();
    return folder;
  }

  async function renameFolder(id: string, name: string) {
    await axios.patch(
      `${BACKEND_URL}/api/v1/folders/${id}`,
      { name },
      { headers: authHeaders() }
    );
    await refresh();
  }

  async function deleteFolder(id: string) {
    await axios.delete(`${BACKEND_URL}/api/v1/folders/${id}`, {
      headers: authHeaders(),
    });
    await refresh();
  }

  return (
    <FolderContext.Provider value={{ folders, refresh, createFolder, renameFolder, deleteFolder }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolders must be used within FolderProvider");
  }
  return context;
}
