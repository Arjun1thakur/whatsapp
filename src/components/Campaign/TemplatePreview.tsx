import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplatePreviewProps {
  template: any;
  variables: Record<string, string>;
}

export default function TemplatePreview({ template, variables }: TemplatePreviewProps) {
  const replaceVariables = (text: string) => {
    return text.replace(/{{(\d+)}}/g, (match, key) => variables[key] || match);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {template.components.map((component: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{component.type}</h3>
            {component.type === 'HEADER' && component.format === 'IMAGE' && (
              <img src={component.example?.header_handle?.[0]} alt="Header" className="max-w-full h-auto" />
            )}
            {component.text && <p>{replaceVariables(component.text)}</p>}
            {component.type === 'BUTTONS' && component.buttons && (
              <div className="mt-2">
                {component.buttons.map((button: any, buttonIndex: number) => (
                  <button key={buttonIndex} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-2">
                    {button.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

