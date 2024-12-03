import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScheduleCampaignProps {
  schedule: string | null
  updateCampaignData: (data: { schedule: string | null }) => void
  submitCampaign: () => void
}

export default function ScheduleCampaign({ schedule, updateCampaignData, submitCampaign }: ScheduleCampaignProps) {
  const [sendOption, setSendOption] = useState(schedule ? 'schedule' : 'now')
  const [scheduleDate, setScheduleDate] = useState(schedule || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCampaignData({ schedule: sendOption === 'schedule' ? scheduleDate : null })
    submitCampaign()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={sendOption} onValueChange={setSendOption} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now">Send Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="schedule" id="schedule" />
              <Label htmlFor="schedule">Schedule for Later</Label>
            </div>
          </RadioGroup>

          {sendOption === 'schedule' && (
            <div className="mt-4">
              <Label htmlFor="schedule-date">Schedule Date and Time</Label>
              <Input
                id="schedule-date"
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">Submit Campaign</Button>
    </form>
  )
}

