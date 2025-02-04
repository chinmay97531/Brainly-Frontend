import { useNavigate } from "react-router-dom";
import { BrainIcon } from "../icons/brain";
import { HomeIcon } from "../icons/home";
import { SignOutIcon } from "../icons/signout";
import { TweetIcon } from "../icons/tweet";
import { YoutubeIcon } from "../icons/youtube";
import { SidebarItem } from "./SidebarItem";
import { useState } from "react";

export function Sidebar() {

    const navigate = useNavigate();
    const [open, setClosed] = useState(false);

    function signOut() {
        navigate("/signin");
        localStorage.removeItem("token");
    }

  return (
    <div>
    <div className="h-screen bg-white border-r border-[#e8ebef] w-54 fixed left-0 top-0 pl-4 transition-transform duration-1000 -translate-x-full md:translate-x-0">
      <div className="flex text-2xl pt-8 items-center">
        <div className="pr-2 text-[#5047e5]">
          <BrainIcon size="lg" />
        </div>
        Brainly
      </div>
      <div className="pt-4">
        <SidebarItem onClick={() => navigate("/dashboard")} title="Home" icon={<HomeIcon size="md" />} />
        <SidebarItem onClick={() => navigate("/dashboard/tweets")} title="Tweets" icon={<TweetIcon size="md" />} />
        <SidebarItem onClick={() => navigate("/dashboard/youtube")} title="Youtube" icon={<YoutubeIcon size="md" />} />
        <SidebarItem onClick={signOut} title="Sign out" icon={<SignOutIcon size="md" />} />
      </div>
    </div>
    </div>
  );
}
