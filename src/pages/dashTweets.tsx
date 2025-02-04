import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/plusIcon";
import { ShareIcon } from "../icons/shareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContentTwitter } from "../hooks/useTweets";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function DashTweets() {
  const [modelOpen, setModelOpen] = useState(false);
  const {contents, Refresh} = useContentTwitter();

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
              const respone = await axios.post(`${BACKEND_URL}/api/v1/brain/share/`, {
                share: true
              }, {
                headers: {
                  "token": localStorage.getItem("token")
                } 
              });
              const shareURL = `http://localhost:5173/share/${respone.data.hash}`;
              alert(shareURL);
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
