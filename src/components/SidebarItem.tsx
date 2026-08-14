import { ReactElement } from "react";

interface SidebarItemProps {
  title: string;
  icon?: ReactElement;
  onClick?: () => void;
  active?: boolean;
}

export function SidebarItem({ title, icon, onClick, active = false }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-brand/10 text-brand shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      <span className={`shrink-0 ${active ? "text-brand" : "text-slate-400"}`}>{icon}</span>
      <span className="truncate">{title}</span>
    </button>
  );
}
