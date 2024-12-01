'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from '@/components/Contact/phone-input'
import { TagInput } from '@/components/Contact/source-input'
import { SourceInput } from '@/components/Contact/tag-input'
import { useAuth } from '@/contexts/AuthContext'
import {  arrayUnion, doc, setDoc } from 'firebase/firestore'
import { storedb } from '@/config/config'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  countryCode: z.string(),
  tags: z.array(z.string()),
  source: z.string(),
})

interface Tag {
  value: string
  label: string
  color: string
}

export function ContactForm() {
    const {user} = useAuth();
    const {toast} = useToast();
  const [tags, setTags] = useState<Tag[]>([
    { value: 'important', label: 'Important', color: '#ff0000' },
    { value: 'new-lead', label: 'New Lead', color: '#00ff00' },
    { value: 'follow-up', label: 'Follow Up', color: '#0000ff' },
  ])
  const [sources, setSources] = useState<string[]>(['Custom', 'Imported'])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      countryCode: "+1",
      tags: [],
      source: "",
    },
  })

 

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const timestamp = new Date().toISOString()
    console.log({ ...values, createdAt: timestamp })
    try {
        if (!user?.uid) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'User not authenticated',
          });
          return;
        }
    
        // Reference the user's document directly
        const userDocRef = doc(storedb, "Contacts", user.uid);
    
        // Update the user's document with the new contact data
        await setDoc(
          userDocRef,
          {
            contacts: arrayUnion({ ...values, createdAt: timestamp }),
          },
          { merge: true } // Merge to avoid overwriting existing data
        );
    
        form.reset(); // Reset the form after successful submission
    
        toast({
          title: 'Success',
          description: 'Contact added successfully',
        });
      } catch (error) {
        console.error("Error adding contact:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error adding the contact',
        });
      }   
  }

  const handleCreateTag = (newTag: Tag) => {
    setTags([...tags, newTag])
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Arjun Thakur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  countryCode={form.watch('countryCode')}
                  onCountryCodeChange={(value) => form.setValue('countryCode', value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  tags={tags}
                  selectedTags={field.value}
                  onTagsChange={field.onChange}
                  onCreateTag={handleCreateTag}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <SourceInput
                  sources={sources}
                  onSourcesChange={(newSources) => {
                    setSources(newSources)
                    field.onChange(newSources[newSources.length - 1])
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

