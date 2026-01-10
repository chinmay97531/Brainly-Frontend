import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/plusIcon";
import { ShareIcon } from "../icons/shareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContentYoutube } from "../hooks/useYoutube";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function DashYoutube() {
  const [modelOpen, setModelOpen] = useState(false);
  const {contents, Refresh} = useContentYoutube();

  useEffect(() => {
    Refresh();
  }, [modelOpen, Refresh])

  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-54 min-h-screen bg-[#f8fbfb] border-solid border-[#e8ebef] border-2">
        <CreateContentModel
          open={modelOpen}
          onClose={() => {
            setModelOpen(false);
          }}
        />
        <div className="flex justify-end gap-4">
          <Button
            onClick={async () => {
              try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                  share: true
                }, {
                  headers: {
                    "token": localStorage.getItem("token")
                  } 
                });

                // Handle both response formats from backend
                let hash: string;
                if (response.data.hash) {
                  hash = response.data.hash;
                } else if (response.data.message && response.data.message.startsWith("/share/")) {
                  hash = response.data.message.split("/share/")[1];
                } else {
                  throw new Error("Unexpected response format");
                }

                // Use window.location.origin for production compatibility
                const shareURL = `${window.location.origin}/share/${hash}`;
                
                // Copy to clipboard
                try {
                  await navigator.clipboard.writeText(shareURL);
                  alert(`Share link copied to clipboard!\n${shareURL}`);
                } catch (clipboardErr) {
                  // Fallback if clipboard API fails
                  alert(`Share link: ${shareURL}`);
                }
              } catch (err) {
                if (axios.isAxiosError(err)) {
                  if (err.response) {
                    alert(err.response.data?.message || "Failed to create share link. Please try again.");
                  } else if (err.request) {
                    alert("Unable to connect to server. Please check your connection.");
                  } else {
                    alert("An unexpected error occurred. Please try again.");
                  }
                } else {
                  alert("An unexpected error occurred. Please try again.");
                }
              }
            }}
            startIcon={<ShareIcon size="md" />}
            variant="secondary"
            text="Share Brain"
            size="sm"
          />
          <Button
            onClick={() => {
              setModelOpen(true);
            }}
            startIcon={<PlusIcon size="md" />}
            variant="primary"
            text="Add Content"
            size="sm"
          />
        </div>

        <div className="flex flex-row flex-wrap gap-10 min-h-48 min-w-72 pt-4">
          {contents.map(({ type, link, title, _id }) => 
            <Card title={title} type={type} link={link} contentId={_id} />
          )}
        </div>
      </div>
    </div>
  );
}
