import axios from "axios";
import { useState } from "react";
import { DeleteIcon } from "../icons/delete";
import { ShareIcon } from "../icons/shareIcon";
import { BACKEND_URL } from "../config";
import { NoteDoc } from "./NoteEditor";
import { NoteModal } from "./NoteModal";
import { useFolders } from "../hooks/useFolders";

interface CardProps {
  title: string;
  link?: string;
  type: "twitter" | "youtube" | "note";
  contentId: string;
  body?: NoteDoc | null;
  bodyText?: string;
  isSharedView?: boolean;
  folderId?: string | null;
  onDelete?: () => void;
}

export function Card({
  title,
  link,
  type,
  contentId,
  body,
  bodyText,
  isSharedView = false,
  folderId = null,
  onDelete,
}: CardProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const { folders } = useFolders();

  async function deleteItem() {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          token: localStorage.getItem("token"),
        },
        data: { contentId },
      });
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Failed to delete the item:", error);
    }
  }

  async function moveItem(nextFolderId: string) {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/v1/content/${contentId}`,
        { folderId: nextFolderId || null },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      onDelete?.();
    } catch (error) {
      console.error("Failed to move the item:", error);
    }
  }

  const isYoutube = type === "youtube";
  const isNote = type === "note";
  const preview = (bodyText || "").trim();
  const currentFolderId = folderId ? String(folderId) : "";

  return (
    <>
      <article
        className={`flex w-full max-w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80 ${
          isNote ? "cursor-pointer" : ""
        }`}
        onClick={isNote ? () => setNoteOpen(true) : undefined}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                isNote
                  ? "bg-amber-50 text-amber-800"
                  : isYoutube
                    ? "bg-red-50 text-red-600"
                    : "bg-sky-50 text-sky-600"
              }`}
            >
              {isNote ? "Note" : isYoutube ? "YouTube" : "Tweet"}
            </span>
            <h3 className="mt-2 truncate text-base font-bold text-ink">{title}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-slate-400" onClick={(e) => e.stopPropagation()}>
            {!isSharedView && folders.length > 0 && (
              <>
                <label className="sr-only" htmlFor={`move-${contentId}`}>
                  Move to folder
                </label>
                <select
                  id={`move-${contentId}`}
                  value={currentFolderId}
                  title="Move to folder"
                  onChange={(event) => moveItem(event.target.value)}
                  className="max-w-28 truncate rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  <option value="">Home</option>
                  {folders.map((folder) => (
                    <option key={folder._id} value={folder._id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-brand"
                aria-label="Open original"
              >
                <ShareIcon size="md" />
              </a>
            )}
            {!isSharedView && (
              <button
                type="button"
                onClick={deleteItem}
                className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-500"
                aria-label="Delete"
              >
                <DeleteIcon size="md" />
              </button>
            )}
          </div>
        </div>

        <div className="p-5 pt-4">
          {isNote && (
            <p className="line-clamp-5 min-h-24 text-sm leading-6 text-stone-600">
              {preview || "Empty note"}
            </p>
          )}

          {isYoutube && link && (
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <iframe
                className="aspect-video w-full"
                src={link.replace("watch", "embed").replace("?v=", "/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {type === "twitter" && link && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}
        </div>
      </article>

      {isNote && (
        <NoteModal
          open={noteOpen}
          title={title}
          body={body}
          contentId={contentId}
          readOnly={isSharedView}
          onClose={() => setNoteOpen(false)}
          onSaved={onDelete}
        />
      )}
    </>
  );
}
