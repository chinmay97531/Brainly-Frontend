import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";


export function useContentYoutube() {
    const [contents, setContents] = useState([]);

    function Refresh() {
        axios.get(`${BACKEND_URL}/api/v1/content`, {
            headers: {
                "token": localStorage.getItem("token")
            }
        }).then((response) => {
            const filteredContent = response.data.content.filter((item: { type: string }) => 
                item.type === "youtube"
            );

            setContents(filteredContent);
        });
    }

    useEffect(() => {
        Refresh()
        
        const interval = setInterval(() => {
            Refresh()
        }, 10*1000)

        return () => {
            clearInterval(interval);
        }
    }, [])

    return {contents, Refresh};
}