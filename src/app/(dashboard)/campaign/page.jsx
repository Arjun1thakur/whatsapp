"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbbox from "@/components/Breadcrumb/Breadcrumbbox";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps, Step } from "@/components/ui/steps";
import { useAuth } from "@/contexts/AuthContext"
import { arrayUnion, collection, doc, getDoc, setDoc } from "firebase/firestore"
import { storedb } from "@/config/config"
import axios from "axios";
import { useToast } from "@/hooks/use-toast"
import CampaignTable from "@/components/Table/campaignTable";

export default function Page() {
  const { user } = useAuth();
  const [campaign, setCampaign] = useState([]);
  const { toast } = useToast();
  useEffect(() => {
    if (!user?.uid) return;
    const fetchTags = async () => {
      try {
        const userDocRef = doc(storedb, "Campaigns", user.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
        const data = snapshot.data();
        console.log(data.campaigns); // Array of campaign
        setCampaign(data.campaigns || []);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [user?.uid]);
  
  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbbox />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CampaignTable data={campaign} />
        </div>
      </SidebarInset>
    </>
  );
}
