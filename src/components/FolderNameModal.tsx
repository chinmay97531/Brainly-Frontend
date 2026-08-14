import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CrossIcon } from "../icons/cross";
import { Button } from "./ui/Button";

interface FolderNameModalProps {
  open: boolean;
  title: string;
  initialName?: string;
  confirmText: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
}

export function FolderNameModal({
  open,
  title,
  initialName = "",
  confirmText,
  onClose,
  onSave,
}: FolderNameModalProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, initialName]);

  if (!open) {
    return null;
  }

  async function save() {
    const next = name.trim();
    if (!next) {
      setError("Enter a folder name");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(next);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            (err.request && !err.response
              ? "Cannot reach the server. Restart the backend, then try again."
              : "Could not save folder")
        );
      } else {
        setError("Could not save folder");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-stone-200 bg-cream p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <CrossIcon size="md" />
          </button>
        </div>
        <label htmlFor="folder-name" className="mb-1.5 block text-[13px] font-medium text-stone-700">
          Name
        </label>
        <input
          id="folder-name"
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              save();
            }
          }}
          placeholder="CS 101, Internship…"
          className="mb-4 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}
        <Button
          onClick={save}
          loading={saving}
          variant="primary"
          size="md"
          text={confirmText}
          fullWidth
        />
      </div>
    </div>
  );
}
