'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Image, Paperclip, Video, Smile, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { sendWhatsappMessage } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { storedb } from '@/config/config'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

const WhatsAppEditor = ({data}: any) => {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<{ type: string; content: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [messageType, setMessageType] = useState("text");

  const applyFormatting = useCallback((format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
  
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
  
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'numbered-list':
        formattedText = `\n1. ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }
  
    // Update the message with formatting
    const newMessage =
      message.substring(0, start) +
      formattedText +
      message.substring(end);
    setMessage(newMessage);
  
    // Maintain focus and adjust the caret position
    textarea.focus();
    textarea.setSelectionRange(
      start + formattedText.length,
      start + formattedText.length
    );
  }, [message]);
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ' ') {
      e.stopPropagation(); // Ensure no interruptions
    }
    if (e.key === 'Enter') {
      const textarea = e.currentTarget
      const { selectionStart, value } = textarea
      const currentLine = value.substring(0, selectionStart).split('\n').pop() || ''
      
      if (currentLine.match(/^(\d+\.|-)/) && !currentLine.match(/^(\d+\.|-)\s*$/)) {
        e.preventDefault()
        const isNumbered = currentLine.startsWith('1.')
        const nextItem = isNumbered ? 
          (parseInt(currentLine.split('.')[0]) + 1) + '. ' :
          '- '
        const newMessage = value.substring(0, selectionStart) + '\n' + nextItem + value.substring(selectionStart)
        setMessage(newMessage)
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + nextItem.length + 1
        }, 0)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'video') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setAttachments([...attachments, { type, content }])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newMessage = message.substring(0, start) + emojiObject.emoji + message.substring(end)
    setMessage(newMessage)

    textarea.focus()
    const newCursorPosition = start + emojiObject.emoji.length
    textarea.setSelectionRange(newCursorPosition, newCursorPosition)
  }

  // const handleSendMessage = async () => {
  //   console.log('Sending message:', message)
    
  //   await sendWhatsappMessage(
  //     message, 
  //     attachments, 
  //     data.phoneNumber, 
  //     messageType, 
  //     data.phoneNumberId, 
  //     data.accessToken)
  //   setMessage('')
  //   setAttachments([])
  // }


  const {toast} = useToast()
  const {user} = useAuth()
  const handleSendMessage = async () => {
    try {
      console.log("Preparing to send message:", message);
  
      if (!data.phoneNumber || !message) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Message content or phone number is missing.",
        });
        return;
      }
  
      if (!user?.uid) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not authenticated.",
        });
        return;
      }
  
      // Fetch configuration from Firebase
      const configDocRef = doc(storedb, "Settings", user.uid);
      const configSnapshot = await getDoc(configDocRef);
  
      if (!configSnapshot.exists()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Configuration not found in Firebase.",
        });
        return;
      }
  
      const configData = configSnapshot.data();
      const accessToken = configData?.accessToken;
      const phoneNumberId = configData?.phoneNumberId;
  
      if (!accessToken || !phoneNumberId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Access token or phone number ID is missing in configuration.",
        });
        return;
      }
  
      // Send WhatsApp message
      await sendWhatsappMessage(
        message,
        attachments,
        `${data.countryCode.slice(1)}${data.phoneNumber}`,
        messageType,
        phoneNumberId,
        accessToken
      );
  
      // Clear message and attachments after sending
      setMessage("");
      setAttachments([]);
  
      toast({
        title: "Success",
        description: "Message sent successfully.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error sending the message.",
      });
    }
  };

  return (
    <Card className="w-full flex-1 mx-auto">
      {/* <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>WhatsApp Editor</CardTitle>
      </CardHeader> */}
      <CardContent className="p-4">
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <ReactMarkdown className="text-sm prose dark:prose-invert max-w-none">
            {message}
          </ReactMarkdown>
          {attachments.map((attachment, index) => (
            <div key={index} className="mt-2 p-2 bg-accent rounded-md">
              {attachment.type === 'image' && (
                <img src={attachment.content} alt="Attached" className="max-w-full h-auto rounded-md" />
              )}
              {attachment.type === 'document' && (
                <div className="flex items-center">
                  <Paperclip className="mr-2" />
                  <span>Document attached</span>
                </div>
              )}
              {attachment.type === 'video' && (
                <video controls className="max-w-full h-auto rounded-md">
                  <source src={attachment.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-2">
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {[
              { icon: Bold, label: 'Bold', format: 'bold' },
              { icon: Italic, label: 'Italic', format: 'italic' },
              { icon: Strikethrough, label: 'Strikethrough', format: 'strikethrough' },
              { icon: Code, label: 'Code', format: 'code' },
              { icon: List, label: 'Bullet List', format: 'list' },
              { icon: ListOrdered, label: 'Numbered List', format: 'numbered-list' },
            ].map(({ icon: Icon, label, format }) => (
              <Tooltip key={format}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => applyFormatting(format)}>
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Image</p>
              </TooltipContent>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, 'image')}
              accept="image/*"
              className="hidden"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => videoInputRef.current?.click()}>
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Video</p>
              </TooltipContent>
            </Tooltip>
            <input
              type="file"
              ref={videoInputRef}
              onChange={(e) => handleFileUpload(e, 'video')}
              accept="video/*"
              className="hidden"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </PopoverContent>
            </Popover>
          </TooltipProvider>
        </div>
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            
            className="flex-grow"
          />
          <Button className='h-auto' onClick={handleSendMessage}>
            <Send className="h-8 w-8" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default WhatsAppEditor

