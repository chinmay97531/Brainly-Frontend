import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/plusIcon";
import { ShareIcon } from "../icons/shareIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { shareDashboard } from "../lib/share";

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedUsername, setSharedUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");
  const [shareScope, setShareScope] = useState<"brain" | "folder">("brain");
  const [sharedFolderName, setSharedFolderName] = useState("");
  const { shareId } = useParams();

  useEffect(() => {
    if (shareId) {
      setIsSharedView(true);
      fetchSharedContent(shareId);
    } else {
      setIsSharedView(false);
      fetchUserContent();
    }
  }, [shareId, modelOpen]);

  const fetchUserContent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setContents(response.data.content || []);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("Failed to load content. Please try again.");
      }
      setLoading(false);
    }
  };

  const fetchSharedContent = async (hash: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
      setContents(response.data.content || []);
      setSharedUsername(response.data.username || "");
      setShareScope(response.data.scope === "folder" ? "folder" : "brain");
      setSharedFolderName(response.data.folderName || "");
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 411) {
          setError(err.response.data?.message || "Invalid share link");
        } else {
          setError("Failed to load shared content. Please check the link and try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setShareSuccess("");
      setError("");
      const result = await shareDashboard();
      setShareSuccess(
        result.copied ? `Share link copied to clipboard! ${result.url}` : `Share link: ${result.url}`
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || "Failed to create share link. Please try again.");
        } else if (err.request) {
          setError("Unable to connect to server. Please check your connection.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <AppShell
      hideSidebar={isSharedView}
      title={
        isSharedView
          ? shareScope === "folder"
            ? `${sharedUsername || "Shared"}'s ${sharedFolderName || "folder"}`
            : `${sharedUsername || "Shared"}'s BrainBox`
          : "Your BrainBox"
      }
      subtitle={
        isSharedView
          ? shareScope === "folder"
            ? "A shared folder of saved ideas"
            : "A public snapshot of saved ideas"
          : "Everything you've saved, in one place"
      }
      actions={
        !isSharedView ? (
          <>
            <Button
              onClick={handleShare}
              loading={false}
              startIcon={<ShareIcon size="md" />}
              variant="secondary"
              text="Share BrainBox"
              size="sm"
              hideLabelOnMobile
            />
            <Button
              onClick={() => setModelOpen(true)}
              startIcon={<PlusIcon size="md" />}
              variant="primary"
              text="Add content"
              size="sm"
              hideLabelOnMobile
            />
          </>
        ) : undefined
      }
    >
      {!isSharedView && (
        <CreateContentModel open={modelOpen} onClose={() => setModelOpen(false)} />
      )}

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
          Loading your BrainBox...
        </div>
      ) : contents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6 2xl:grid-cols-4">
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
              isSharedView={isSharedView}
              onDelete={isSharedView ? undefined : fetchUserContent}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 text-center lg:min-h-[28rem]">
          <p className="text-lg font-bold text-ink">Nothing saved yet</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {isSharedView
              ? shareScope === "folder"
                ? "This shared folder doesn't have any content."
                : "This shared BrainBox doesn't have any content."
              : "Add a video, tweet, or note to get started."}
          </p>
          {!isSharedView && (
            <div className="mt-5">
              <Button
                onClick={() => setModelOpen(true)}
                startIcon={<PlusIcon size="md" />}
                variant="primary"
                text="Add your first item"
                size="sm"
              />
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
