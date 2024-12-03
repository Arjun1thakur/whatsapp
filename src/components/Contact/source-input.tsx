import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function TagInput({
  onChange,
  tags,
}: {
  onChange: (selectedTags: string[]) => void
  tags: string[]
}) {
  const availableTags = ["Tech", "Alpha", "CS", "Web", "Mobile", "AI"] 

  const handleCheckboxChange = (tag: string, checked: boolean) => {
    // Update the selected tags
    let updatedTags = [...tags]
    if (checked) {
      updatedTags.push(tag)
    } else {
      updatedTags = updatedTags.filter((t) => t !== tag)
    }
    onChange(updatedTags) // Call the onChange prop to update the form state
  }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">Select Tags</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableTags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag}
            checked={tags.includes(tag)} // Check if the tag is in the selected tags
            onCheckedChange={(checked) => handleCheckboxChange(tag, checked)}
          >
            {tag}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
