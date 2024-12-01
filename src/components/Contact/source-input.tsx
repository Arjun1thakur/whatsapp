import React, { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Tag {
  value: string
  label: string
  color: string
}

interface TagInputProps {
  tags: Tag[]
  selectedTags: string[]
  onTagsChange: (selectedTags: string[]) => void
  onCreateTag: (newTag: Tag) => void
}

export function TagInput({ tags, selectedTags, onTagsChange, onCreateTag }: TagInputProps) {
  const [open, setOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#000000')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        value: newTagName.toLowerCase().replace(/\s+/g, '-'),
        label: newTagName,
        color: newTagColor,
      }
      onCreateTag(newTag)
      setNewTagName('')
      setNewTagColor('#000000')
      setOpenCreateDialog(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTags && selectedTags.length > 0
            ? selectedTags.map((tag) => {
                const selectedTag = tags.find((t) => t.value === tag)
                return selectedTag ? (
                  <Badge key={tag} style={{backgroundColor: selectedTag.color}}>
                    {selectedTag.label}
                  </Badge>
                ) : null
              })
            : "Select tags..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {tags.map((tag) => (
              <CommandItem
                key={tag.value}
                onSelect={() => {
                  onTagsChange(
                    selectedTags && selectedTags.includes(tag.value)
                      ? selectedTags.filter((t) => t !== tag.value)
                      : [...(selectedTags || []), tag.value]
                  )
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedTags && selectedTags.includes(tag.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                <Badge style={{backgroundColor: tag.color}}>{tag.label}</Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create new tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTag}>Create tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  )
}

