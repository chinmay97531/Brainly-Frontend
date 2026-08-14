import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { ReactNode, useEffect, useRef, useState } from "react";

export type NoteDoc = Record<string, unknown>;

interface NoteEditorProps {
  content?: NoteDoc | null;
  editable?: boolean;
  placeholder?: string;
  onChange?: (json: NoteDoc, text: string) => void;
}

const TEXT_COLORS = [
  { name: "Default", value: "" },
  { name: "Red", value: "#e11d48" },
  { name: "Orange", value: "#ea580c" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Green", value: "#16a34a" },
  { name: "Blue", value: "#2563eb" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Pink", value: "#db2777" },
  { name: "Gray", value: "#78716c" },
];

const HIGHLIGHTS = [
  { name: "None", value: "" },
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Orange", value: "#fed7aa" },
  { name: "Purple", value: "#ddd6fe" },
];

export function NoteEditor({
  content,
  editable = true,
  placeholder = "Start writing…",
  onChange,
}: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onChange?.(instance.getJSON() as NoteDoc, instance.getText());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor outline-none min-h-40 px-3 py-2 text-sm leading-6 text-ink",
      },
    },
  });

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const linkSelectionRef = useRef<{ from: number; to: number } | null>(null);

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || !content) {
      return;
    }
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(content);
    if (current !== next) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    if (!linkOpen) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [linkOpen]);

  if (!editor) {
    return <div className="min-h-40 rounded-lg border border-stone-200 bg-white" />;
  }

  const activeEditor = editor;

  const headingValue = [1, 2, 3, 4, 5, 6].find((level) =>
    activeEditor.isActive("heading", { level })
  );
  const currentTextColor =
    (activeEditor.getAttributes("textStyle").color as string | undefined) || "#1c1917";
  const currentHighlight =
    (activeEditor.getAttributes("highlight").color as string | undefined) || "";

  function restoreSelection() {
    const selection = linkSelectionRef.current;
    const chain = activeEditor.chain().focus();
    if (selection) {
      chain.setTextSelection(selection);
    }
    return chain;
  }

  function openLinkDialog() {
    const { from, to } = activeEditor.state.selection;
    linkSelectionRef.current = { from, to };
    const previous = activeEditor.getAttributes("link").href as string | undefined;
    setLinkUrl(previous || "https://");
    setLinkOpen(true);
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (!url || url === "https://") {
      restoreSelection().extendMarkRange("link").unsetLink().run();
    } else {
      restoreSelection().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkOpen(false);
  }

  function removeLink() {
    restoreSelection().unsetLink().run();
    setLinkOpen(false);
  }

  return (
    <div
      className={`relative rounded-lg border border-stone-300 bg-white ${
        editable ? "focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20" : ""
      }`}
    >
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-stone-50 px-2 py-1.5">
          <IconButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <span className="font-serif text-[15px] font-bold leading-none">B</span>
          </IconButton>
          <IconButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <span className="font-serif text-[15px] italic leading-none">I</span>
          </IconButton>
          <IconButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span className="font-serif text-[15px] underline leading-none">U</span>
          </IconButton>
          <IconButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <span className="font-serif text-[15px] leading-none line-through">S</span>
          </IconButton>

          <ToolbarDivider />

          <label className="sr-only" htmlFor="note-heading">
            Heading
          </label>
          <select
            id="note-heading"
            value={headingValue ? String(headingValue) : "p"}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "p") {
                editor.chain().focus().setParagraph().run();
                return;
              }
              editor
                .chain()
                .focus()
                .toggleHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
                .run();
            }}
            className="h-8 rounded-md border-0 bg-transparent px-1 text-xs font-semibold text-stone-700 hover:bg-stone-200"
          >
            <option value="p">Body</option>
            <option value="1">Title</option>
            <option value="2">Heading</option>
            <option value="3">Subheading</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>

          <ToolbarDivider />

          <IconButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <BulletListIcon />
          </IconButton>
          <IconButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <NumberedListIcon />
          </IconButton>
          <IconButton
            title="Add link"
            active={activeEditor.isActive("link") || linkOpen}
            onClick={openLinkDialog}
          >
            <LinkIcon />
          </IconButton>

          <ToolbarDivider />

          <ColorMenu
            title="Text color"
            current={currentTextColor}
            colors={TEXT_COLORS}
            kind="text"
            onPick={(value) => {
              if (!value) {
                editor.chain().focus().unsetColor().run();
                return;
              }
              editor.chain().focus().setColor(value).run();
            }}
          />
          <ColorMenu
            title="Highlight"
            current={currentHighlight}
            colors={HIGHLIGHTS}
            kind="highlight"
            onPick={(value) => {
              if (!value) {
                editor.chain().focus().unsetHighlight().run();
                return;
              }
              editor.chain().focus().toggleHighlight({ color: value }).run();
            }}
          />
        </div>
      )}
      <EditorContent editor={editor} />

      {linkOpen && (
        <div
          className="absolute inset-0 z-40 flex items-start justify-center rounded-lg bg-ink/35 p-4 pt-16"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.target === event.currentTarget) {
              setLinkOpen(false);
            }
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-link-title"
            className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-4 shadow-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p id="note-link-title" className="mb-3 text-sm font-semibold text-ink">
              Add link
            </p>
            <label htmlFor="note-link-url" className="mb-1.5 block text-[11px] font-medium text-stone-500">
              URL
            </label>
            <input
              id="note-link-url"
              ref={linkInputRef}
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setLinkOpen(false);
                }
              }}
              placeholder="https://"
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={removeLink}
                className="text-xs font-medium text-stone-500 hover:text-red-600"
              >
                Remove
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLinkOpen(false)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="rounded-md bg-brand px-2.5 py-1.5 text-xs font-semibold text-cream hover:bg-brand-dark"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconButton({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-md ${
        active ? "bg-stone-800 text-white" : "text-stone-700 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}

function ColorMenu({
  title,
  current,
  colors,
  kind,
  onPick,
}: {
  title: string;
  current: string;
  colors: { name: string; value: string }[];
  kind: "text" | "highlight";
  onPick: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        title={title}
        onClick={() => setOpen((value) => !value)}
        className={`flex h-8 items-center rounded-md px-1.5 hover:bg-stone-200 ${
          open ? "bg-stone-200" : ""
        }`}
      >
        {kind === "text" ? (
          <span className="flex flex-col items-center leading-none">
            <span className="font-serif text-[15px] font-semibold text-stone-800">A</span>
            <span
              className="mt-0.5 h-[3px] w-4 rounded-full"
              style={{ backgroundColor: current || "#1c1917" }}
            />
          </span>
        ) : (
          <span
            className="flex size-6 items-center justify-center rounded-sm font-serif text-[13px] font-semibold text-stone-800"
            style={{ backgroundColor: current || "#fef08a" }}
          >
            A
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-9 z-20 w-40 rounded-xl border border-stone-200 bg-white p-2.5 shadow-lg">
          <p className="mb-2 text-[11px] font-medium text-stone-500">{title}</p>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => {
                  onPick(color.value);
                  setOpen(false);
                }}
                className={`relative flex size-7 items-center justify-center rounded-full border ${
                  (color.value || "#1c1917") === (current || "#1c1917")
                    ? "border-ink ring-2 ring-stone-300"
                    : "border-stone-200"
                }`}
                style={{
                  backgroundColor:
                    color.value || (kind === "highlight" ? "#ffffff" : "#1c1917"),
                }}
                aria-label={color.name}
              >
                {!color.value && (
                  <span className="absolute inset-1 rounded-full border border-stone-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-stone-300" />;
}

function BulletListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="5" r="1.4" />
      <circle cx="3.5" cy="10" r="1.4" />
      <circle cx="3.5" cy="15" r="1.4" />
      <rect x="7" y="4" width="10.5" height="2" rx="1" />
      <rect x="7" y="9" width="10.5" height="2" rx="1" />
      <rect x="7" y="14" width="10.5" height="2" rx="1" />
    </svg>
  );
}

function NumberedListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
      <text x="1" y="6.5" fontSize="6" fontWeight="700">
        1
      </text>
      <text x="1" y="11.8" fontSize="6" fontWeight="700">
        2
      </text>
      <text x="1" y="17" fontSize="6" fontWeight="700">
        3
      </text>
      <rect x="7" y="4" width="10.5" height="2" rx="1" />
      <rect x="7" y="9" width="10.5" height="2" rx="1" />
      <rect x="7" y="14" width="10.5" height="2" rx="1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M10 13a5 5 0 0 0 7.54.54l1.5-1.5a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M14 11a5 5 0 0 0-7.54-.54l-1.5 1.5a5 5 0 0 0 7.07 7.07l1.71-1.71"
      />
    </svg>
  );
}
