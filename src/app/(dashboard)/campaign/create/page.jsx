"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbbox from "@/components/Breadcrumb/Breadcrumbbox";

import { useEffect, useState } from "react";
import CampaignName from "@/components/Campaign/CampaignName";
import SelectContacts from "@/components/Campaign/SelectContacts";
import SelectTemplate from "@/components/Campaign/SelectTemplate";
import ScheduleCampaign from "@/components/Campaign/ScheduleCampaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps, Step } from "@/components/ui/steps";
import { useAuth } from "@/contexts/AuthContext"
import { arrayUnion, collection, doc, getDoc, setDoc } from "firebase/firestore"
import { storedb } from "@/config/config"
import axios from "axios";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";

export default function Page() {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    contacts: [],
    template: "",
    templateVariables: {},
    schedule: null,
  });

  const { user } = useAuth();
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchTags = async () => {
      try {
        const userDocRef = doc(storedb, "Contacts", user.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
        const data = snapshot.data();
        console.log(data.contacts); // Array of contacts
        setCampaignData((prev) => ({ ...prev, contacts: data.contacts || [] }));
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [user?.uid]);

  const updateCampaignData = (data) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CampaignName
            campaignName={campaignData.name}
            updateCampaignData={updateCampaignData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <SelectContacts
            contacts={campaignData.contacts}
            updateCampaignData={updateCampaignData}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <SelectTemplate
            template={campaignData.template}
            templateVariables={campaignData.templateVariables}
            updateCampaignData={updateCampaignData}
            nextStep={nextStep}
          />
        );
      case 4:
        return (
          <ScheduleCampaign
            schedule={campaignData.schedule}
            updateCampaignData={updateCampaignData}
            submitCampaign={submitCampaign}
          />
        );
      default:
        return null;
    }
  };

  const {toast} = useToast();
  const router = useRouter();

  const submitCampaign = async () => {
    console.log("Submitting campaign:", campaignData);
  
    if (!user?.uid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated.",
      });
      return; // Ensure user is logged in before fetching
    }
  
    try {
      const userDocRef = doc(storedb, "Settings", user.uid); // Reference to the user's settings document
      const snapshot = await getDoc(userDocRef);
  
      if (!snapshot.exists()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User settings not found.",
        });
        return;
      }
  
      const settingsData = snapshot.data();
      const campaignDocRef = doc(collection(storedb, "Campaigns"), user.uid); // Reference to the user's campaigns
  
      const timestamp = new Date().toISOString();
  
      // Save campaign details in Firestore
      await setDoc(
        campaignDocRef,
        {
          campaigns: arrayUnion({
            contacts: campaignData.contacts,
            templateName: campaignData.name, // Template name
            createdAt: timestamp,
            otherInfo: campaignData.otherInfo || {},
          }),
        },
        { merge: true }
      );
  
      // Send WhatsApp messages for each contact
      campaignData.contacts.forEach(async (contact) => {
        const requestData = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: `${contact.countryCode.slice(1)}${contact.phoneNumber}`,
          type: "template",
          template: {
            name: "hello_world",
            language: {
              code: "en_US",
            },
          },
        };
  
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `https://graph.facebook.com/${settingsData.apiVersion}/${settingsData.phoneNumberId}/messages`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settingsData.accessToken}`,
          },
          data: requestData,
        };
  
        try {
          await axios.request(config);
          toast({
            title: "Success",
            description: "Message sent successfully.",
          });
          router.push("/campaign");
        } catch (error) {
          console.error("Error sending message:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to send message to ${contact.phoneNumber}.`,
          });
        }
      });
  
      // Notify success for campaign submission
      toast({
        title: "Success",
        description: "Campaign submitted successfully and saved in Firestore.",
      });
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error submitting the campaign.",
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
            <Breadcrumbbox />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto p-4 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Create WhatsApp Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Steps currentStep={step} className="mb-8">
                  <Step title="Campaign Name" />
                  <Step title="Select Contacts" />
                  <Step title="Choose Template" />
                  <Step title="Schedule" />
                </Steps>
                {renderStep()}
                <div className="mt-6 flex justify-between">
                  {step > 1 && (
                    <Button onClick={prevStep} variant="outline">
                      Previous
                    </Button>
                  )}
                  {step < 4 && (
                    <Button onClick={nextStep} className="ml-auto">
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
