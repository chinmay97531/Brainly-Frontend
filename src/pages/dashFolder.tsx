import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { FolderNameModal } from "../components/FolderNameModal";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/plusIcon";
import { ShareIcon } from "../icons/shareIcon";
import { BACKEND_URL } from "../config";
import { AppShell } from "../components/AppShell";
import { useFolders } from "../hooks/useFolders";
import { shareFolder } from "../lib/share";

interface FolderContent {
  _id: string;
  title: string;
  type: "twitter" | "youtube" | "note";
  link?: string;
  body?: Record<string, unknown> | null;
  bodyText?: string;
  folderId?: string | null;
}

export function DashFolder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { folders, renameFolder, deleteFolder } = useFolders();
  const [modelOpen, setModelOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [contents, setContents] = useState<FolderContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");

  const folder = folders.find((item) => item._id === id);

  async function fetchFolderContent() {
    if (!id) {
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: { token: localStorage.getItem("token") },
        params: { folderId: id },
      });
      setContents(response.data.content || []);
      setError("");
    } catch {
      setError("Failed to load this folder.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchFolderContent();
  }, [id, modelOpen]);

  async function handleShare() {
    if (!id) {
      return;
    }
    try {
      setShareSuccess("");
      setError("");
      const result = await shareFolder(id);
      setShareSuccess(
        result.copied ? `Share link copied to clipboard! ${result.url}` : `Share link: ${result.url}`
      );
    } catch {
      setError("Failed to create a share link for this folder.");
    }
  }

  async function handleDelete() {
    if (!id || !folder) {
      return;
    }
    const confirmed = window.confirm(
      `Delete “${folder.name}”? Items stay in BrainBox; they just leave this folder.`
    );
    if (!confirmed) {
      return;
    }
    await deleteFolder(id);
    navigate("/dashboard");
  }

  return (
    <AppShell
      title={folder?.name || "Folder"}
      subtitle="Notes, tweets, and videos in this folder"
      actions={
        <>
          <Button onClick={() => setRenameOpen(true)} variant="secondary" text="Rename" size="sm" />
          <Button onClick={handleDelete} variant="secondary" text="Delete" size="sm" />
          <Button
            onClick={handleShare}
            startIcon={<ShareIcon size="md" />}
            variant="secondary"
            text="Share folder"
            size="sm"
          />
          <Button
            onClick={() => setModelOpen(true)}
            startIcon={<PlusIcon size="md" />}
            variant="primary"
            text="Add content"
            size="sm"
          />
        </>
      }
    >
      <CreateContentModel
        open={modelOpen}
        folderId={id}
        onClose={() => setModelOpen(false)}
      />
      <FolderNameModal
        open={renameOpen}
        title="Rename folder"
        initialName={folder?.name || ""}
        confirmText="Save name"
        onClose={() => setRenameOpen(false)}
        onSave={(name) => renameFolder(id as string, name)}
      />

      {shareSuccess && (
        <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 break-all">
          {shareSuccess}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
          Loading folder...
        </div>
      ) : contents.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {contents.map(({ type, link, title, _id, body, bodyText, folderId }) => (
            <Card
              key={_id}
              title={title}
              type={type}
              link={link}
              contentId={_id}
              body={body}
              bodyText={bodyText}
              folderId={folderId}
              onDelete={fetchFolderContent}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 text-center">
          <p className="text-lg font-bold text-ink">This folder is empty</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add a video, tweet, or note, or move existing items here from Home.
          </p>
          <div className="mt-5">
            <Button
              onClick={() => setModelOpen(true)}
              startIcon={<PlusIcon size="md" />}
              variant="primary"
              text="Add to folder"
              size="sm"
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
