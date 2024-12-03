import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TemplatePreview from './TemplatePreview'

interface SelectTemplateProps {
  template: string
  templateVariables: Record<string, string>
  updateCampaignData: (data: { template: string, templateVariables: Record<string, string> }) => void
  nextStep: () => void
}

const templates = [
    {
        "name": "hello_world",
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "HEADER",
                "format": "TEXT",
                "text": "Hello World"
            },
            {
                "type": "BODY",
                "text": "Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us."
            },
            {
                "type": "FOOTER",
                "text": "WhatsApp Business Platform sample message"
            }
        ],
        "language": "en_US",
        "status": "APPROVED",
        "category": "UTILITY",
        "id": "461000503412575"
    },
    {
        "name": "authentication_template",
        "message_send_ttl_seconds": 600,
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "BODY",
                "text": "*{{1}}* is your verification code. For your security, do not share this code.",
                "add_security_recommendation": true,
                "example": {
                    "body_text": [
                        [
                            "123456"
                        ]
                    ]
                }
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Copy code",
                        "url": "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=otp{{1}}",
                        "example": [
                            "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=otp123456"
                        ]
                    }
                ]
            }
        ],
        "language": "en_US",
        "status": "APPROVED",
        "category": "AUTHENTICATION",
        "id": "1560106131241788"
    },
    {
        "name": "kkk",
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "BODY",
                "text": "Hi {{1}}, this is to remind you of your upcoming scheduled payment: \n\nDate: {{2}}\nAccount: {{3}}\nAmount: {{4}}\n\nThank you and have a nice day.",
                "example": {
                    "body_text": [
                        [
                            "John",
                            "Jan 1, 2024",
                            "CS Mutual debit plus",
                            "$12.34"
                        ]
                    ]
                }
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Manage payment",
                        "url": "https://www.example.com/"
                    }
                ]
            }
        ],
        "language": "en_US",
        "status": "REJECTED",
        "category": "UTILITY",
        "library_template_name": "payment_scheduled_3",
        "id": "1238046177629542"
    },
    {
        "name": "verification",
        "message_send_ttl_seconds": 600,
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "BODY",
                "text": "*{{1}}* is your verification code. For your security, do not share this code.",
                "add_security_recommendation": true,
                "example": {
                    "body_text": [
                        [
                            "123456"
                        ]
                    ]
                }
            },
            {
                "type": "FOOTER",
                "text": "This code expires in 10 minutes.",
                "code_expiration_minutes": 10
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Copy code",
                        "url": "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code_expiration_minutes=10&code=otp{{1}}",
                        "example": [
                            "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code_expiration_minutes=10&code=otp123456"
                        ]
                    }
                ]
            }
        ],
        "language": "en",
        "status": "APPROVED",
        "category": "AUTHENTICATION",
        "id": "838613031575993"
    },
    {
        "name": "shipment_confirmation_2",
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "BODY",
                "text": "{{1}}, great news! Your order {{2}} has shipped.\n\nTracking #: {{3}}\nEstimated delivery: {{4}}\n\nWe will provide updates until delivery.",
                "example": {
                    "body_text": [
                        [
                            "John",
                            "#12345",
                            "ZK4539O2311J",
                            "Jan 1, 2024"
                        ]
                    ]
                }
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Track shipment",
                        "url": "https://www.example.com/"
                    }
                ]
            }
        ],
        "language": "en_US",
        "status": "APPROVED",
        "category": "UTILITY",
        "sub_category": "CUSTOM",
        "id": "511059231594652"
    },
    {
        "name": "shipment_confirmation_3",
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "BODY",
                "text": "{{1}}, your order {{2}} has left our {{3}} and is on its way to you! \n\nYour tracking ID is {{4}}. \n\nClick below to track your package.",
                "example": {
                    "body_text": [
                        [
                            "John",
                            "#12345",
                            "facility",
                            "ZK12345KI999"
                        ]
                    ]
                }
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Track my order",
                        "url": "https://www.example.com/"
                    }
                ]
            }
        ],
        "language": "en_US",
        "status": "APPROVED",
        "category": "UTILITY",
        "sub_category": "CUSTOM",
        "id": "3829769163974472"
    },
    {
        "name": "techinfo",
        "parameter_format": "POSITIONAL",
        "components": [
            {
                "type": "HEADER",
                "format": "IMAGE",
                "example": {
                    "header_handle": [
                        "https://scontent.whatsapp.net/v/t61.29466-34/419002484_443478388676715_6042529548461415813_n.jpg?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=yWtarrSeydUQ7kNvgGVZ2-9&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=Ay_ixSwewHMdZEMrYqhPoSs&oh=01_Q5AaILSekwF5vmCRS3PQPy5kEFFcIQURFbokqcQ8xRzbgSiB&oe=67759639"
                    ]
                }
            },
            {
                "type": "BODY",
                "text": "Hello techinfo techinfo Hello techinfo techinfoHello techinfo techinfo Hello techinfo techinfo Hello techinfo techinfo Hello techinfo techinfoHello techinfo techinfo Hello techinfo techinfo"
            }
        ],
        "language": "en",
        "status": "APPROVED",
        "category": "MARKETING",
        "sub_category": "CUSTOM",
        "id": "443478382010049"
    }
]

export default function SelectTemplate({
    template,
    templateVariables,
    updateCampaignData,
    nextStep,
  }: SelectTemplateProps) {
    const [selectedTemplate, setSelectedTemplate] = useState(template);
    const [variables, setVariables] = useState(templateVariables);
  
    useEffect(() => {
        if (selectedTemplate) {
          const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);
          if (selectedTemplateData) {
            const newVariables = selectedTemplateData.components.reduce((acc, component) => {
              if (component.type === 'BODY' || component.type === 'HEADER' || component.type === 'FOOTER') {
                const matches = component.text?.match(/{{\d+}}/g) || [];
                matches.forEach((match) => {
                  const key = match.replace(/[{}]/g, '');
                  if (!(key in acc)) acc[key] = ''; // Add default only if key is new
                });
              }
              return acc;
            }, { ...variables }); // Start with existing variables to avoid resetting
      
            // Only update state if there are actual changes to prevent infinite loop
            if (JSON.stringify(newVariables) !== JSON.stringify(variables)) {
              setVariables(newVariables);
            }
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedTemplate]); // Use `selectedTemplate` only to prevent unnecessary runs
      
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateCampaignData({ template: selectedTemplate, templateVariables: variables });
      nextStep();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
  
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(variables).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    id={key}
                    type="text"
                    value={value}
                    onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                    placeholder={key}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
  
        {selectedTemplate && (
          <TemplatePreview
            template={templates.find((t) => t.id === selectedTemplate)}
            variables={variables}
          />
        )}
  
        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    );
  }
