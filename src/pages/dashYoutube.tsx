import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/plusIcon";
import { ShareIcon } from "../icons/shareIcon";
import { useContentYoutube } from "../hooks/useYoutube";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { AppShell } from "../components/AppShell";

export function DashYoutube() {
  const [modelOpen, setModelOpen] = useState(false);
  const { contents, Refresh } = useContentYoutube();

  useEffect(() => {
    Refresh();
  }, [modelOpen, Refresh]);

  return (
    <AppShell
      title="YouTube"
      subtitle="Videos you want to come back to"
      actions={
        <>
          <Button
            onClick={async () => {
              try {
                const response = await axios.post(
                  `${BACKEND_URL}/api/v1/brain/share`,
                  {
                    share: true,
                  },
                  {
                    headers: {
                      token: localStorage.getItem("token"),
                    },
                  }
                );

                let hash: string;
                if (response.data.hash) {
                  hash = response.data.hash;
                } else if (response.data.message && response.data.message.startsWith("/share/")) {
                  hash = response.data.message.split("/share/")[1];
                } else {
                  throw new Error("Unexpected response format");
                }

                const shareURL = `${window.location.origin}/share/${hash}`;

                try {
                  await navigator.clipboard.writeText(shareURL);
                  alert(`Share link copied to clipboard!\n${shareURL}`);
                } catch {
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
            text="Share"
            size="sm"
            hideLabelOnMobile
          />
          <Button
            onClick={() => setModelOpen(true)}
            startIcon={<PlusIcon size="md" />}
            variant="primary"
            text="Add content"
            size="sm"
            hideLabelOnMobile
          />
        </>
      }
    >
      <CreateContentModel open={modelOpen} onClose={() => setModelOpen(false)} />

      {contents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6 2xl:grid-cols-4">
          {contents.map(({ type, link, title, _id, folderId }) => (
            <Card key={_id} title={title} type={type} link={link} contentId={_id} folderId={folderId} onDelete={Refresh} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 text-center lg:min-h-[28rem]">
          <p className="text-lg font-bold text-ink">No videos saved</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add a YouTube link and it will live here.
          </p>
        </div>
      )}
    </AppShell>
  );
}
