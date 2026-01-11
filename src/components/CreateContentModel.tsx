import { CrossIcon } from "../icons/cross";
import { Button } from "./ui/Button";
import { Input } from "./Input";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface CreateContentModelProps {
  open: boolean;
  onClose: () => void;
}

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

export function CreateContentModel({ open, onClose }: CreateContentModelProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    await axios.post(`${BACKEND_URL}/api/v1/content`, {
      link,
      title,
      type
    },{
      headers: {
        "token": localStorage.getItem("token")
      }
    })

    onClose();
  }

  return (
    <div>
      {open && (
        <div>
          <div className="w-screen h-screen bg-slate-400 fixed top-0 left-0 opacity-60 flex justify-center"></div>
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
              <span className="bg-white opacity-100 p-4 rounded-lg fixed">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon size="md" />
                  </div>
                </div>
                <div>
                  <div className="h-3"></div>
                  <Input reference={titleRef} placeholder={"Title"} />
                  <div className="h-2"></div>
                  <Input reference={linkRef} placeholder={"Link"} />
                  <div className="flex justify-center items-center">
                    <h1>Type: </h1>
                    <div className="flex justify-between gap-3 p-3">
                      <Button
                        text="Youtube"
                        size="sm"
                        variant={
                          type === ContentType.Youtube ? "primary" : "secondary"
                        }
                        onClick={() => {
                          setType(ContentType.Youtube);
                        }}
                      ></Button>
                      <Button
                        text="Twitter"
                        size="sm"
                        variant={
                          type === ContentType.Twitter ? "primary" : "secondary"
                        }
                        onClick={() => {
                          setType(ContentType.Twitter);
                        }}
                      ></Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={addContent}
                      size="sm"
                      variant="primary"
                      text="Submit"
                    />
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
