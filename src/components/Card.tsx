import axios from "axios";
import { DeleteIcon } from "../icons/delete";
import { DocumentIcon } from "../icons/document";
import { ShareIcon } from "../icons/shareIcon";
import { BACKEND_URL } from "../config";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  contentId: string;
  isSharedView?: boolean;
  onDelete?: () => void;
}

export function Card({ title, link, type, contentId, isSharedView = false, onDelete }: CardProps) {

  async function deleteItem() {
      try {
        await axios.delete(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            token: localStorage.getItem("token"),
          },
          data: {contentId},
        });
        // Call refresh callback if provided
        if (onDelete) {
          onDelete();
        }
      } catch(error) {
        console.error("Failed to delete the item:", error);
      }
  }

  return (
    <div className="bg-white p-8 rounded-md shadow-md border-1 border-[#ecf2f1] max-w-96">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="pr-2 text-[#787d84]">
            <DocumentIcon size="md" />
          </div>
          {title}
        </div>
        <div className="flex items-center text-[#787d84]">
          <div className="pr-4">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ShareIcon size="md" />
            </a>
          </div>
          {!isSharedView && (
            <div onClick={deleteItem} className="cursor-pointer">
              <DeleteIcon size="md" />
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        {type ==="youtube" && <iframe
          className="w-full"
          src={link.replace("watch", "embed").replace("?v=", "/")}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>}

        {type === "twitter" && <blockquote className="twitter-tweet">
          <a href={link.replace("x.com", "twitter.com")}></a>
        </blockquote>}
      </div>
    </div>
  );
}
