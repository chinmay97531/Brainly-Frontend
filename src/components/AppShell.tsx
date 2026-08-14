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
    <div className="min-h-dvh bg-[#f4f5fb] text-ink">
      {!hideSidebar && (
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      )}

      <main className={hideSidebar ? "" : "md:ml-64 xl:ml-72"}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f4f5fb]/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
              {!hideSidebar && (
                <button
                  type="button"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
                  onClick={() => setNavOpen(true)}
                  aria-label="Open navigation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl lg:text-[1.75rem]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-0.5 hidden truncate text-sm text-slate-500 sm:block">{subtitle}</p>
                )}
              </div>
              {user && (
                <div className="flex shrink-0 items-center rounded-full border border-slate-200 bg-white p-0.5 shadow-sm lg:hidden">
                  <Avatar name={user.username} src={user.avatar} size="sm" />
                </div>
              )}
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {actions && (
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 [&>button]:min-h-10 [&>button]:flex-1 sm:[&>button]:flex-none lg:flex-none lg:justify-end">
                  {actions}
                </div>
              )}
              {user && (
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm lg:flex">
                  <Avatar name={user.username} src={user.avatar} size="md" />
                  <span className="max-w-36 truncate text-sm font-semibold text-ink">
                    {user.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[90rem] px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
