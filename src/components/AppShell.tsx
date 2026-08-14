import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Avatar } from "./Avatar";
import { useUser } from "../hooks/useUser";

interface AppShellProps {
  title: string;
  subtitle?: string;
  hideSidebar?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, subtitle, hideSidebar = false, actions, children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const user = useUser();

  return (
    <div className="min-h-screen bg-[#f4f5fb] text-ink">
      {!hideSidebar && (
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      )}

      <main className={hideSidebar ? "" : "md:ml-64"}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f4f5fb]/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              {!hideSidebar && (
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
                  onClick={() => setNavOpen(true)}
                  aria-label="Open navigation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  {title}
                </h1>
                {subtitle && <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {actions}
              {user && (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm">
                  <Avatar name={user.username} src={user.avatar} size="md" />
                  <span className="hidden max-w-32 truncate text-sm font-semibold text-ink sm:inline">
                    {user.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
