import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentIcon } from "../icons/document";
import { FolderIcon } from "../icons/folder";
import { HomeIcon } from "../icons/home";
import { SignOutIcon } from "../icons/signout";
import { TweetIcon } from "../icons/tweet";
import { YoutubeIcon } from "../icons/youtube";
import { SidebarItem } from "./SidebarItem";
import { Logo } from "./Logo";
import { FolderNameModal } from "./FolderNameModal";
import { saveCurrentUser } from "../hooks/useUser";
import { useFolders } from "../hooks/useFolders";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { folders, createFolder } = useFolders();
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  function go(path: string) {
    navigate(path);
    onClose?.();
  }

  function signOut() {
    localStorage.removeItem("token");
    saveCurrentUser(null);
    navigate("/");
    onClose?.();
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,calc(100vw-3rem))] flex-col border-r border-slate-200 bg-white px-4 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-sm transition-transform duration-200 md:w-64 xl:w-72 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between gap-2">
          <Logo />
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-8 flex min-h-0 flex-1 flex-col gap-1 xl:mt-10">
          <SidebarItem
            onClick={() => go("/dashboard")}
            title="Home"
            icon={<HomeIcon size="lg" />}
            active={location.pathname === "/dashboard"}
          />
          <SidebarItem
            onClick={() => go("/dashboard/notes")}
            title="Notes"
            icon={<DocumentIcon size="lg" />}
            active={location.pathname === "/dashboard/notes"}
          />
          <SidebarItem
            onClick={() => go("/dashboard/tweets")}
            title="Tweets"
            icon={<TweetIcon size="lg" />}
            active={location.pathname === "/dashboard/tweets"}
          />
          <SidebarItem
            onClick={() => go("/dashboard/youtube")}
            title="YouTube"
            icon={<YoutubeIcon size="lg" />}
            active={location.pathname === "/dashboard/youtube"}
          />

          <div className="mt-5 flex items-center justify-between px-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Folders</p>
            <button
              type="button"
              onClick={() => setNewFolderOpen(true)}
              className="text-[11px] font-semibold text-brand hover:text-brand-dark"
            >
              New
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {folders.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-400">Create a folder to group and share items.</p>
            ) : (
              folders.map((folder) => (
                <SidebarItem
                  key={folder._id}
                  onClick={() => go(`/dashboard/folders/${folder._id}`)}
                  title={folder.name}
                  icon={<FolderIcon size="lg" />}
                  active={location.pathname === `/dashboard/folders/${folder._id}`}
                />
              ))
            )}
          </div>
        </nav>
        <div className="border-t border-slate-100 pt-3">
          <SidebarItem onClick={signOut} title="Sign out" icon={<SignOutIcon size="lg" />} />
        </div>
      </aside>

      <FolderNameModal
        open={newFolderOpen}
        title="New folder"
        confirmText="Create folder"
        onClose={() => setNewFolderOpen(false)}
        onSave={async (name) => {
          const folder = await createFolder(name);
          go(`/dashboard/folders/${folder._id}`);
        }}
      />
    </>
  );
}
