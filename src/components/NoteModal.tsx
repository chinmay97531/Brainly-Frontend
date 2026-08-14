import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { NoteEditor, NoteDoc } from "./NoteEditor";
import { Button } from "./ui/Button";
import { CrossIcon } from "../icons/cross";

interface NoteModalProps {
  open: boolean;
  title: string;
  body?: NoteDoc | null;
  contentId: string;
  readOnly?: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function NoteModal({
  open,
  title: initialTitle,
  body,
  contentId,
  readOnly = false,
  onClose,
  onSaved,
}: NoteModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [noteBody, setNoteBody] = useState<NoteDoc | null>(body ?? null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/content/${contentId}`,
        { title, body: noteBody, bodyText: noteText },
        { headers: { token: localStorage.getItem("token") } }
      );
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close note"
      />
      <div className="relative z-10 max-h-[100dvh] w-full overflow-y-auto rounded-t-2xl border border-stone-200 bg-cream p-4 shadow-xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {readOnly ? "Note" : "Edit note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <CrossIcon size="md" />
          </button>
        </div>

        {readOnly ? (
          <>
            <h3 className="mb-3 text-lg font-semibold text-ink">{initialTitle}</h3>
            <NoteEditor content={body} editable={false} />
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="note-title" className="mb-1.5 block text-[13px] font-medium text-stone-700">
                Title
              </label>
              <input
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <NoteEditor
              content={body}
              onChange={(json, text) => {
                setNoteBody(json);
                setNoteText(text);
              }}
            />
            <Button
              onClick={save}
              loading={saving}
              variant="primary"
              size="md"
              text={saving ? "Saving" : "Save note"}
              fullWidth
            />
          </div>
        )}
      </div>
    </div>
  );
}
