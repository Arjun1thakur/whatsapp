import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  countryCode: string;
  tags: string[];
  name: string;
  phoneNumber: string;
  source: string;
  createdAt: string;
}

interface SelectContactsProps {
  contacts: Contact[];
  updateCampaignData: (data: { contacts: Contact[] }) => void;
  nextStep: () => void;
}

export default function SelectContacts({ contacts, updateCampaignData, nextStep }: SelectContactsProps) {
  const [newContact, setNewContact] = useState({
    name: "",
    phoneNumber: "",
    countryCode: "+91", // Default value
    tags: ["Custom"], // Default value
    source: "Manual", // Default value
    createdAt: new Date().toISOString(), // Default value
  });

  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log("Uploaded file:", e.target.files[0].name);
    }
  };

  const addContact = () => {
    if (newContact.name && newContact.phoneNumber) {
      setSelectedContacts([...selectedContacts, { ...newContact }]);
      setNewContact({
        name: "",
        phoneNumber: "",
        countryCode: "+91",
        tags: ["Custom"],
        source: "Manual",
        createdAt: new Date().toISOString(),
      });
    }
  };

  const uniqueTags = [...new Set(contacts.flatMap((contact) => contact.tags))];

  const toggleContact = (contact: Contact) => {
    const updatedContacts = selectedContacts.includes(contact)
      ? selectedContacts.filter((c) => c !== contact)
      : [...selectedContacts, contact];
    setSelectedContacts(updatedContacts);
  };

  

  const selectByTag = (tag: string) => {
    const contactsByTag = contacts.filter((contact) => contact.tags.includes(tag));
  
    // Check if all contacts with the tag are already selected
    const allSelected = contactsByTag.every((contact) =>
      selectedContacts.some((selected) => selected.phoneNumber === contact.phoneNumber)
    );
  
    let updatedContacts;
  
    if (allSelected) {
      // Remove contacts with the tag
      updatedContacts = selectedContacts.filter(
        (selected) => !contactsByTag.some((contact) => contact.phoneNumber === selected.phoneNumber)
      );
    } else {
      // Add contacts with the tag, ensuring no duplicates
      updatedContacts = [...selectedContacts, ...contactsByTag].filter(
        (contact, index, self) =>
          self.findIndex((c) => c.phoneNumber === contact.phoneNumber) === index // Unique by ID
      );
    }
  
    setSelectedContacts(updatedContacts);
  };
  
  const {toast} = useToast()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContacts.length === 0) {
        toast({
            title: "Error",
            description: "Please select at least one contact.",
            variant: "destructive",
        })
        return
    }
    updateCampaignData({ contacts: selectedContacts });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Excel Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Contact Manually</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={newContact.phoneNumber}
                onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                placeholder="Phone"
              />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addContact} className="w-full">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter by Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-x-4">
            {uniqueTags.map((tag) => (
              <Button key={tag} variant={selectedContacts.some((contact) => contact.tags.includes(tag)) ? "default" : "outline"} type="button" onClick={() => selectByTag(tag)}>
                {tag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country Code</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact)}
                      onCheckedChange={() => toggleContact(contact)}
                    />
                  </TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.phoneNumber}</TableCell>
                  <TableCell>{contact.countryCode}</TableCell>
                  <TableCell>{contact.tags.join(", ")}</TableCell>
                  <TableCell>{contact.source}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
