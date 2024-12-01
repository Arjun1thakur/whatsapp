"use client"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Breadcrumbbox from "@/components/Breadcrumb/Breadcrumbbox"
import { DataTableDemo } from "@/components/Table/Table"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { storedb } from "@/config/config"
import axios from "axios"
export default function Page() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error message
  useEffect(() => {
    if (!user?.uid) return;

    const fetchTemplates = async () => {
      setLoading(true); // Set loading to true when fetching
      setError(null); // Clear previous errors

      try {
        const docRef = doc(storedb, "Settings", user.uid); // Reference to the user's document
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data =  snapshot.data();
          console.log(data);
          const config = {
            method: "get",
            url: `https://graph.facebook.com/v20.0/${data.WABAID}/message_templates`,
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          };
          const response = await axios(config);
          console.log(response.data.data);
          setTemplates(response.data.data);
        } else {
          setError("User settings not found.");
        }
      } catch (error: any) {
        console.error("Error fetching templates:", error);
        setError("Failed to fetch templates. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchTemplates();
  }, [user?.uid]);
  return (
    <>
       <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbbox/>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DataTableDemo data={templates}/>
      </div>
    </SidebarInset>
    </>
  )
}


