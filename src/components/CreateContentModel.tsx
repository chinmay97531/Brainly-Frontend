import { CrossIcon } from "../icons/cross";
import { Button } from "./ui/Button";
import { Input } from "./Input";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { NoteEditor, NoteDoc } from "./NoteEditor";
import { useFolders } from "../hooks/useFolders";

interface CreateContentModelProps {
  open: boolean;
  onClose: () => void;
  initialType?: ContentType;
  folderId?: string;
}

export enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Note = "note",
}

export function CreateContentModel({
  open,
  onClose,
  initialType = ContentType.Youtube,
  folderId,
}: CreateContentModelProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(initialType);
  const [noteBody, setNoteBody] = useState<NoteDoc | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(folderId || "");
  const { folders } = useFolders();

  useEffect(() => {
    if (open) {
      setType(initialType);
      setSelectedFolderId(folderId || "");
    }
  }, [open, initialType, folderId]);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    if (!title) {
      return;
    }

    if (type !== ContentType.Note && !link) {
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        type === ContentType.Note
          ? { title, type, body: noteBody, bodyText: noteText, folderId: selectedFolderId || undefined }
          : { link, title, type, folderId: selectedFolderId || undefined },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setNoteBody(null);
      setNoteText("");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={`relative z-10 w-full overflow-visible rounded-2xl border border-stone-200 bg-cream p-6 shadow-xl ${
          type === ContentType.Note ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Add to BrainBox</h2>
            <p className="mt-1 text-sm text-stone-500">
              Save a video, tweet, or a note of your own.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <CrossIcon size="md" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-stone-700">Type</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                text="YouTube"
                size="sm"
                variant={type === ContentType.Youtube ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Youtube)}
              />
              <Button
                text="Twitter"
                size="sm"
                variant={type === ContentType.Twitter ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Twitter)}
              />
              <Button
                text="Note"
                size="sm"
                variant={type === ContentType.Note ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Note)}
              />
            </div>
          </div>

          <Input reference={titleRef} label="Title" placeholder="Give it a name" />

          {folders.length > 0 && (
            <div>
              <label htmlFor="content-folder" className="mb-1.5 block text-[13px] font-medium text-stone-700">
                Folder
              </label>
              <select
                id="content-folder"
                value={selectedFolderId}
                onChange={(event) => setSelectedFolderId(event.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Home (no folder)</option>
                {folders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === ContentType.Note ? (
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-stone-700">Note</p>
              <NoteEditor
                placeholder="Lecture takeaways, quotes, questions…"
                onChange={(json, text) => {
                  setNoteBody(json);
                  setNoteText(text);
                }}
              />
            </div>
          ) : (
            <Input reference={linkRef} label="Link" placeholder="https://" />
          )}

          <Button
            onClick={addContent}
            loading={saving}
            size="md"
            variant="primary"
            text="Save to BrainBox"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
