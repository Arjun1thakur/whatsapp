import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CampaignNameProps {
  campaignName: string
  updateCampaignData: (data: { name: string }) => void
  nextStep: () => void
}

export default function CampaignName({ campaignName, updateCampaignData, nextStep }: CampaignNameProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            type="text"
            value={campaignName}
            onChange={(e) => updateCampaignData({ name: e.target.value })}
            placeholder="Enter campaign name"
            required
          />
        </div>
        <Button type="submit" className="w-full">Next</Button>
      </div>
    </form>
  )
}

