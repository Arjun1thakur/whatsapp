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
import { arrayUnion, doc, setDoc } from 'firebase/firestore'
import { storedb } from '@/config/config'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '../ui/badge'
import { CircleUser } from 'lucide-react'

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
  const { user } = useAuth();
  const { toast } = useToast();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      countryCode: "+1",
      tags: [],
      source: "Custom",
    },
  })

  const tags = form.watch("tags")



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

      const userDocRef = doc(storedb, "Contacts", user.uid);

      await setDoc(
        userDocRef,
        {
          contacts: arrayUnion({ ...values, createdAt: timestamp }),
        },
        { merge: true }
      );

      form.reset();

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

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <br />
              <FormControl>
                <TagInput tags={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* If no tags are selected, display this message */}
        {form.watch("tags").length === 0 ? (
          <p>No tag selected yet.</p>
        ) : (
          <div>
            {form.watch("tags").map((tag) => (
              <Badge style={{ marginRight: 5 }} key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )}


        {/* Ensure the button is on a new line */}
        <Button type="submit" className='w-full flex items-center'>
          <CircleUser className="mr-2 h-4 w-4" /> Create Contact
        </Button>

      </form>
    </Form>
  )
}


