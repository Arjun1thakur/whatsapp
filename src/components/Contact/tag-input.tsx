import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SourceInputProps {
  sources: string[]
  onSourcesChange: (sources: string[]) => void
}

export function SourceInput({ sources, onSourcesChange }: SourceInputProps) {
  const [newSource, setNewSource] = useState('')
  const [selectedSource, setSelectedSource] = useState('')

  const handleAddSource = () => {
    if (newSource.trim() && !sources.includes(newSource.trim())) {
      onSourcesChange([...sources, newSource.trim()])
      setNewSource('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you would typically process the Excel file
      // For this example, we'll just add a placeholder source
      onSourcesChange([...sources, `Imported from ${file.name}`])
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex">
        <Input
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          placeholder="Add a new source"
          className="flex-1"
        />
        <Button onClick={handleAddSource} className="ml-2">Add</Button>
      </div>
      <div className="flex items-center">
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="ml-2"
        />
      </div>
    </div>
  )
}

