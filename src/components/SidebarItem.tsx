import { ReactElement } from "react";

interface SidebarItemProps {
    title: string;
    icon?: ReactElement;
    onClick?: () => void;
}

export function SidebarItem(props: SidebarItemProps) {
  return (
    <div className="flex items-center text-[#7e848f] cursor-pointer hover:bg-gray-200 rounded-lg max-w-42 pl-4 transition-all duration-300" onClick={props.onClick}>
      <div className="p-2">
        {props.icon} 
      </div>
      <div className="p-2">
        {props.title}
      </div>
    </div>
  );
}
