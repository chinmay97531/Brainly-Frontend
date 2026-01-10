import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/plusIcon";
import { ShareIcon } from "../icons/shareIcon";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useParams } from "react-router-dom";

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedUsername, setSharedUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");
  const { shareId } = useParams();

  useEffect(() => {
    if (shareId) {
      setIsSharedView(true);
      fetchSharedContent(shareId);
    } else {
      setIsSharedView(false);
      fetchUserContent();
    }
  }, [shareId, modelOpen]);

  const fetchUserContent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          "token": localStorage.getItem("token")
        }
      });
      setContents(response.data.content || []);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("Failed to load content. Please try again.");
      }
      setLoading(false);
    }
  };

  const fetchSharedContent = async (hash: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
      setContents(response.data.content || []);
      setSharedUsername(response.data.username || "");
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 411) {
          setError(err.response.data?.message || "Invalid share link");
        } else {
          setError("Failed to load shared content. Please check the link and try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setShareSuccess("");
      setError("");
      const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
        share: true
      }, {
        headers: {
          "token": localStorage.getItem("token")
        } 
      });

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
        setShareSuccess(`Share link copied to clipboard! ${shareURL}`);
      } catch {
        setShareSuccess(`Share link: ${shareURL}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || "Failed to create share link. Please try again.");
        } else if (err.request) {
          setError("Unable to connect to server. Please check your connection.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      {!isSharedView && <Sidebar />}
      <div className={`p-4 min-h-screen bg-[#f8fbfb] border-solid border-[#e8ebef] border-2 ${!isSharedView ? 'ml-54' : ''}`}>
        {isSharedView && sharedUsername && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Shared by: <span className="text-[#5046e4]">{sharedUsername}</span>
            </h2>
          </div>
        )}

        {shareSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium break-all">{shareSuccess}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {!isSharedView && (
          <>
            <CreateContentModel
              open={modelOpen}
              onClose={() => {
                setModelOpen(false);
              }}
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleShare}
                loading={false}
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
          </>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-48">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-10 min-h-48 min-w-72 pt-4">
            {contents.length > 0 ? (
              contents.map(({ type, link, title, _id }) => 
                <Card 
                  key={_id} 
                  title={title} 
                  type={type} 
                  link={link} 
                  contentId={_id} 
                  isSharedView={isSharedView}
                  onDelete={isSharedView ? undefined : fetchUserContent}
                />
              )
            ) : (
              <div className="w-full text-center text-gray-500 py-12">
                {isSharedView ? "No content available in this shared brain." : "No content yet. Add some content to get started!"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
