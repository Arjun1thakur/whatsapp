"use client"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Breadcrumbbox from "@/components/Breadcrumb/Breadcrumbbox"
import { getDatabase, ref, get, set } from "firebase/database";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { database, storedb } from "@/config/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  const {user} = useAuth(); 
  const [formData, setFormData] = useState({
    displayName: "",
    whatsappNumber: "",
    businessId: "",
    phoneNumberId: "",
    accessToken: "",
    WABAID: "",
    apiVersion: "",
  })
  const {toast} = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.uid) return; // Ensure user is logged in before fetching

      try {
        const docRef = doc(storedb, "Settings", user.uid); // Reference to the user's document
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data(); // Fetch document data
          if (data) {
            setFormData((prevSettings) => ({
              ...prevSettings,
              ...data, // Populate formData with the Firestore data
            }));
          }
        } else {
          console.log("No data available for this user");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [user?.uid]); // Run the effect when user.uid changes


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user.uid) {
        toast({
          variant: "destructive",
          title: "Error adding data",
          description: "There was an error adding the data",
        });
      }
      const docRef = doc(storedb, "Settings", user.uid); 
      await setDoc(docRef, formData); 
      toast({
        title: "Data added successfully",
        description: "The data has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding data:", error);
      toast({
        variant: "destructive",
        title: "Error adding data",
        description: "There was an error adding the data",
      });
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


      <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Please fill out all the fields below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="The Alpha Agency"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Whatsapp Number</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="1234567890"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                required
                minLength={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessId">Business ID</Label>
              <Input
                id="businessId"
                type="text"
                placeholder="b9M8fdsc23dew24"
                name="businessId"
                value={formData.businessId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">Phone Number ID</Label>
              <Input
                id="phoneNumberId"
                placeholder=""
                name="phoneNumberId"
                value={formData.phoneNumberId}
                onChange={handleInputChange}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="WABAID">WABAID</Label>
              <Input
                id="WABAID"
                type="text"
                placeholder="b9M8fdsc23dew24"
                name="WABAID"
                value={formData.WABAID}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiVersion">API Version</Label>
              <Input
                id="apiVersion"
                placeholder=""
                name="apiVersion"
                value={formData.apiVersion}
                onChange={handleInputChange}
                required
                minLength={2}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              placeholder=""
              name="accessToken"
              value={formData.accessToken}
              onChange={handleInputChange}
              required
              minLength={5}
            />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>


      </div>
    </SidebarInset>
    </>
  )
}