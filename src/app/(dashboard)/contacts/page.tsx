"use client"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Breadcrumbbox from "@/components/Breadcrumb/Breadcrumbbox"
import { ContactTable } from "@/components/Table/ContactTable"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { storedb } from "@/config/config"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error message
  const { toast } = useToast();
  useEffect(() => {
    if (!user?.uid) return;
    const fetchTags = async () => {
      try {
        const userDocRef = doc(storedb, "Contacts", user.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
        const data = snapshot.data();
        console.log(data.contacts); // Array of contacts
        setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [user?.uid]);

  const deleteContact = async (phoneNumber: string) => {
    try {
      // Remove the contact from the local state
      setContacts((prevContacts) => prevContacts.filter(contact => contact.phoneNumber !== phoneNumber));
      
      if (!user?.uid){
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        })
        return
      };
      // Update Firestore by removing the contact
      const userDocRef = doc(storedb, "Contacts", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const updatedContacts = data.contacts.filter((contact: any) => contact.phoneNumber !== phoneNumber);
  
        // Update the contacts array in Firestore
        await updateDoc(userDocRef, {
          contacts: updatedContacts,
        });
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      setError("Failed to delete contact.");
    }
  };

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
        <ContactTable data={contacts} deleteContact={deleteContact}/>
      </div>
    </SidebarInset>
    </>
  )
}


